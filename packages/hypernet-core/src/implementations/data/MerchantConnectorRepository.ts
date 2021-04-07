import { IMerchantConnectorRepository } from "@interfaces/data";
import {
  HypernetContext,
  PullPayment,
  PushPayment,
  ProxyError,
  BlockchainUnavailableError,
  TransferResolutionError,
  PaymentId,
  EthereumAddress,
  Signature,
} from "@hypernetlabs/objects";
import { LogicalError, MerchantConnectorError, MerchantValidationError, PersistenceError } from "@hypernetlabs/objects";
import { errAsync, okAsync, ResultAsync, Result } from "neverthrow";
import { ResultUtils, IAjaxUtils, ILocalStorageUtils } from "@hypernetlabs/utils";
import {
  IBlockchainProvider,
  IBlockchainUtils,
  IConfigProvider,
  IContextProvider,
  IMerchantConnectorProxy,
  IVectorUtils,
} from "@interfaces/utilities";
import { BigNumber, ethers } from "ethers";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";

interface IAuthorizedMerchantEntry {
  merchantUrl: string;
  authorizationSignature: string;
}

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  protected activatedMerchants: Map<string, IMerchantConnectorProxy>;
  protected domain: TypedDataDomain;
  protected types: Record<string, TypedDataField[]>;

  constructor(
    protected blockchainProvider: IBlockchainProvider,
    protected ajaxUtils: IAjaxUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected vectorUtils: IVectorUtils,
    protected localStorageUtils: ILocalStorageUtils,
    protected merchantConnectorProxyFactory: IMerchantConnectorProxyFactory,
    protected blockchainUtils: IBlockchainUtils,
  ) {
    this.activatedMerchants = new Map();
    this.domain = {
      name: "Hypernet Protocol",
      version: "1",
    };
    this.types = {
      AuthorizedMerchant: [
        { name: "authorizedMerchantUrl", type: "string" },
        { name: "merchantValidatedSignature", type: "string" },
      ],
    };
  }

  public getMerchantAddresses(merchantUrls: string[]): ResultAsync<Map<string, EthereumAddress>, LogicalError> {
    // TODO: right now, the merchant will publish a URL with their address; eventually, they should be held in a smart contract

    // For merchants that are already authorized, we can just go to their connector for the
    // public key.
    const addressRequests = new Array<
      ResultAsync<{ merchantUrl: string; address: string }, MerchantConnectorError | LogicalError>
    >();
    for (const merchantUrl of merchantUrls) {
      const merchantProxy = this.activatedMerchants.get(merchantUrl);

      if (merchantProxy != null) {
        addressRequests.push(
          merchantProxy.getAddress().map((address) => {
            return { merchantUrl, address };
          }),
        );
      } else {
        // Need to get it from the source
        const url = new URL(merchantUrl.toString());
        url.pathname = "address";
        addressRequests.push(
          this.ajaxUtils.get<string, LogicalError>(url).map((address) => {
            return { merchantUrl, address };
          }),
        );
      }
    }

    return ResultUtils.combine(addressRequests).map((vals) => {
      const returnMap = new Map<string, EthereumAddress>();
      for (const val of vals) {
        returnMap.set(val.merchantUrl.toString(), EthereumAddress(val.address));
      }

      return returnMap;
    });
  }

  public addAuthorizedMerchant(
    merchantUrl: string,
  ): ResultAsync<
    void,
    | PersistenceError
    | LogicalError
    | MerchantValidationError
    | ProxyError
    | BlockchainUnavailableError
    | MerchantConnectorError
  > {
    let proxy: IMerchantConnectorProxy;
    let context: HypernetContext;

    // First, we will create the proxy
    return this.contextProvider
      .getContext()
      .andThen((myContext) => {
        context = myContext;
        return this.merchantConnectorProxyFactory.factoryProxy(merchantUrl);
      })
      .andThen((myProxy) => {
        proxy = myProxy;

        // With the proxy activated, we can get the validated merchant signature
        return ResultUtils.combine([proxy.getValidatedSignature(), this.blockchainProvider.getSigner()]);
      })
      .andThen((vals) => {
        const [merchantSignature, signer] = vals;

        // merchantSignature has been validated by the iframe, so this is already confirmed.
        // Now we need to get an authorization signature
        const value = {
          authorizedMerchantUrl: merchantUrl,
          merchantValidatedSignature: merchantSignature,
        } as Record<string, any>;
        const signerPromise = signer._signTypedData(this.domain, this.types, value);

        return ResultAsync.fromPromise(signerPromise, (e) => e as MerchantValidationError);
      })
      .andThen((authorizationSignature) => {
        const authorizedMerchants = this._getAuthorizedMerchants();

        authorizedMerchants.set(merchantUrl, Signature(authorizationSignature));

        this._setAuthorizedMerchants(authorizedMerchants);

        // Activate the merchant connector
        return proxy.activateConnector();
      })
      .map(() => {
        // Only if the merchant is successfully activated do we stick it in the list.
        this.activatedMerchants.set(merchantUrl, proxy);
      })
      .mapErr((e) => {
        // If we encounter a problem, destroy the proxy so we can start afresh.
        if (proxy != null) {
          proxy.destroy();
        }

        // Notify the world
        if (context != null) {
          context.onAuthorizedMerchantActivationFailed.next(merchantUrl);
        }

        return e;
      });
  }

  public removeAuthorizedMerchant(merchantUrl: string): Result<void, never> {
    return this.merchantConnectorProxyFactory.destroyMerchantConnectorProxy(merchantUrl);
  }

  /**
   * Returns a map of merchant URLs with their authorization signatures.
   */
  public getAuthorizedMerchants(): ResultAsync<Map<string, Signature>, never> {
    const authorizedMerchants = this._getAuthorizedMerchants();

    return okAsync(authorizedMerchants);
  }

  public resolveChallenge(
    merchantUrl: string,
    paymentId: PaymentId,
    transferId: string,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | TransferResolutionError> {
    const proxy = this.activatedMerchants.get(merchantUrl);

    if (proxy == null) {
      return errAsync(new MerchantValidationError(`No existing merchant connector for ${merchantUrl}`));
    }

    return proxy
      .resolveChallenge(paymentId)
      .andThen((result) => {
        const { mediatorSignature, amount } = result;

        return this.vectorUtils.resolveInsuranceTransfer(
          transferId,
          paymentId,
          mediatorSignature,
          BigNumber.from(amount),
        );
      })
      .map(() => {});
  }

  public closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    const proxy = this.activatedMerchants.get(merchantUrl);

    if (proxy == null) {
      return errAsync(new MerchantConnectorError(`No existing merchant connector for ${merchantUrl}`));
    }

    return proxy.closeMerchantIFrame();
  }

  public displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    const proxy = this.activatedMerchants.get(merchantUrl);

    if (proxy == null) {
      return errAsync(new MerchantConnectorError(`No existing merchant connector for ${merchantUrl}`));
    }

    return proxy.displayMerchantIFrame();
  }

  public activateAuthorizedMerchants(): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | BlockchainUnavailableError | LogicalError | ProxyError
  > {
    return ResultUtils.combine([
      this.contextProvider.getInitializedContext(),
      this.getAuthorizedMerchants(),
      this.blockchainProvider.getSigner(),
    ]).andThen((vals) => {
      const [context, authorizedMerchants, signer] = vals;
      const activationResults = new Array<
        () => ResultAsync<void, MerchantConnectorError | MerchantValidationError | LogicalError | ProxyError>
      >();

      for (const keyval of authorizedMerchants) {
        activationResults.push(() => {
          return this._activateAuthorizedMerchant(
            context.account,
            keyval[0], // URL
            keyval[1],
            context,
            signer,
          );
        });
      }

      return ResultUtils.executeSerially(activationResults).map(() => {});
    });
  }

  public notifyPushPaymentSent(merchantUrl: string, payment: PushPayment): ResultAsync<void, MerchantConnectorError> {
    return this.getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPushPaymentSent(payment);
    });
  }

  public notifyPushPaymentUpdated(
    merchantUrl: string,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPushPaymentUpdated(payment);
    });
  }

  public notifyPushPaymentReceived(
    merchantUrl: string,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPushPaymentReceived(payment);
    });
  }

  public notifyPullPaymentSent(merchantUrl: string, payment: PullPayment): ResultAsync<void, MerchantConnectorError> {
    return this.getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPullPaymentSent(payment);
    });
  }

  public notifyPullPaymentUpdated(
    merchantUrl: string,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPullPaymentUpdated(payment);
    });
  }

  public notifyPullPaymentReceived(
    merchantUrl: string,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.getMerchantConnector(merchantUrl).andThen((merchantConnector) => {
      return merchantConnector.notifyPullPaymentReceived(payment);
    });
  }

  protected getMerchantConnector(merchantUrl: string): ResultAsync<IMerchantConnectorProxy, MerchantConnectorError> {
    const proxy = this.activatedMerchants.get(merchantUrl);

    if (proxy == null) {
      return errAsync(new MerchantConnectorError(`No existing merchant connector for ${merchantUrl}`));
    }

    return okAsync(proxy);
  }

  protected _activateAuthorizedMerchant(
    accountAddress: EthereumAddress,
    merchantUrl: string,
    authorizationSignature: Signature,
    context: HypernetContext,
    signer: ethers.providers.JsonRpcSigner,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | LogicalError | ProxyError> {
    let proxy: IMerchantConnectorProxy;
    return this.merchantConnectorProxyFactory
      .factoryProxy(merchantUrl)
      .andThen((myProxy) => {
        proxy = myProxy;
        // We need to get the validated signature, so we can see if it was authorized
        return proxy.getValidatedSignature();
      })
      .andThen((validatedSignature) => {
        const value = {
          authorizedMerchantUrl: merchantUrl,
          merchantValidatedSignature: validatedSignature,
        } as Record<string, any>;
        const validationAddress = this.blockchainUtils.verifyTypedData(
          this.domain,
          this.types,
          value,
          authorizationSignature,
        );

        if (validationAddress !== accountAddress) {
          // Notify the user that one of their authorized merchants has changed their code
          context.onAuthorizedMerchantUpdated.next(merchantUrl);

          // Get a new signature
          // validatedSignature means the code is signed by the provider, so we just need
          // to sign this new version.
          const signerPromise = signer._signTypedData(this.domain, this.types, value);

          return ResultAsync.fromPromise(signerPromise, (e) => e as MerchantConnectorError).map(
            (newAuthorizationSignature) => {
              const authorizedMerchants = this._getAuthorizedMerchants();

              authorizedMerchants.set(merchantUrl.toString(), Signature(newAuthorizationSignature));

              this._setAuthorizedMerchants(authorizedMerchants);
            },
          );
        }

        return okAsync<void, MerchantValidationError>(undefined);
      })
      .andThen(() => {
        return proxy.activateConnector();
      })
      .map(() => {
        this.activatedMerchants.set(merchantUrl, proxy);
      })
      .mapErr((e) => {
        // The connector could not be authenticated, so just get rid of it.
        if (proxy != null) {
          proxy.destroy();
        }

        // Notify the world
        context.onAuthorizedMerchantActivationFailed.next(merchantUrl);

        return e;
      });
  }

  protected _setAuthorizedMerchants(authorizedMerchantMap: Map<string, string>) {
    const authorizedMerchantEntries = new Array<IAuthorizedMerchantEntry>();
    for (const keyval of authorizedMerchantMap) {
      authorizedMerchantEntries.push({ merchantUrl: keyval[0], authorizationSignature: keyval[1] });
    }
    this.localStorageUtils.setItem("AuthorizedMerchants", JSON.stringify(authorizedMerchantEntries));
  }

  protected _getAuthorizedMerchants(): Map<string, Signature> {
    let authorizedMerchantStr = this.localStorageUtils.getItem("AuthorizedMerchants");

    if (authorizedMerchantStr == null) {
      authorizedMerchantStr = "[]";
    }
    const authorizedMerchantEntries = JSON.parse(authorizedMerchantStr) as IAuthorizedMerchantEntry[];

    const authorizedMerchants = new Map<string, Signature>();
    for (const authorizedMerchantEntry of authorizedMerchantEntries) {
      authorizedMerchants.set(authorizedMerchantEntry.merchantUrl, Signature(authorizedMerchantEntry.authorizationSignature));
    }
    return authorizedMerchants;
  }
}
