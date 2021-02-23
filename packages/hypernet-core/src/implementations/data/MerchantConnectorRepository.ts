import { IMerchantConnectorRepository } from "@interfaces/data";
import { HexString, PublicKey, BigNumber, HypernetContext, HypernetConfig } from "@interfaces/objects";
import {
  CoreUninitializedError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
} from "@interfaces/objects/errors";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ParentProxy, ResultUtils, IAjaxUtils } from "@hypernetlabs/utils";
import { IBlockchainProvider, IConfigProvider, IContextProvider, IVectorUtils } from "@interfaces/utilities";
import { ethers } from "ethers";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";

class MerchantConnectorProxy extends ParentProxy {
  constructor(element: HTMLElement | null, iframeUrl: string) {
    super(element, iframeUrl);
  }

  public activateConnector(): ResultAsync<void, MerchantConnectorError> {
    return this._createCall("activateConnector", null);
  }

  public resolveChallenge(paymentId: HexString): ResultAsync<IResolutionResult, MerchantConnectorError> {
    return this._createCall("resolveChallenge", paymentId);
  }

  public getPublicKey(): ResultAsync<PublicKey, MerchantConnectorError> {
    return this._createCall("getPublicKey", null);
  }

  public getValidatedSignature(): ResultAsync<string, MerchantValidationError> {
    return this._createCall("getValidatedSignature", null);
  }
}

interface IAuthorizedMerchantEntry {
  merchantUrl: string;
  authorizationSignature: string;
}

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  protected activatedMerchants: Map<string, MerchantConnectorProxy>;
  protected domain: TypedDataDomain;
  protected types: Record<string, TypedDataField[]>;

  constructor(
    protected blockchainProvider: IBlockchainProvider,
    protected ajaxUtils: IAjaxUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected vectorUtils: IVectorUtils,
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

  public getMerchantConnectorSignature(merchantUrl: URL): ResultAsync<string, Error> {
    const url = new URL(merchantUrl.toString());
    url.pathname = "signature";
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }
  public getMerchantPublicKeys(merchantUrls: string[]): ResultAsync<Map<string, PublicKey>, Error> {
    // TODO: right now, the merchant will publish a URL with their public key; eventually, they should be held in a smart contract

    // For merchants that are already authorized, we can just go to their connector for the
    // public key.
    const publicKeyRequests = new Array<
      ResultAsync<{ merchantUrl: string; publicKey: PublicKey }, MerchantConnectorError | Error>
    >();
    for (const merchantUrl of merchantUrls) {
      const merchantProxy = this.activatedMerchants.get(merchantUrl);

      if (merchantProxy != null) {
        publicKeyRequests.push(
          merchantProxy.getPublicKey().map((publicKey) => {
            return { merchantUrl, publicKey };
          }),
        );
      } else {
        // Need to get it from the source
        const url = new URL(merchantUrl.toString());
        url.pathname = "publicKey";
        publicKeyRequests.push(
          this.ajaxUtils.get<string, Error>(url).map((publicKey) => {
            return { merchantUrl, publicKey };
          }),
        );
      }
    }

    return ResultUtils.combine(publicKeyRequests).map((vals) => {
      const returnMap = new Map<string, PublicKey>();
      for (const val of vals) {
        returnMap.set(val.merchantUrl.toString(), val.publicKey);
      }

      return returnMap;
    });
  }

  public addAuthorizedMerchant(merchantUrl: URL): ResultAsync<void, PersistenceError> {
    let proxy: MerchantConnectorProxy;
    let config: HypernetConfig;
    let context: HypernetContext;
    return ResultUtils.combine([this.configProvider.getConfig(),
      this.contextProvider.getContext()])
      .andThen((vals) => {
        [config, context] = vals;

        // First, we will create the proxy
        proxy = this._factoryProxy(config.merchantIframeUrl, merchantUrl.toString());

        return proxy.activate();
      })
      .andThen(() => {
        // With the proxy activated, we can get the validated merchant signature
        return ResultUtils.combine([proxy.getValidatedSignature(), this.blockchainProvider.getSigner()]);
      })
      .andThen((vals) => {
        const [merchantSignature, signer] = vals;

        // merchantSignature has been validated by the iframe, so this is already confirmed.
        // Now we need to get an authorization signature
        const value = {
          authorizedMerchantUrl: merchantUrl.toString(),
          merchantValidatedSignature: merchantSignature,
        } as Record<string, any>;
        const signerPromise = signer._signTypedData(this.domain, this.types, value);

        return ResultAsync.fromPromise(signerPromise, (e) => e as MerchantConnectorError);
      })
      .andThen((authorizationSignature) => {
        const authorizedMerchants = this._getAuthorizedMerchants();

        authorizedMerchants.set(merchantUrl.toString(), authorizationSignature);

        this._setAuthorizedMerchants(authorizedMerchants);

        // Activate the merchant connector
        return proxy.activateConnector();
      })
      .map(() => {
        this.activatedMerchants.set(merchantUrl.toString(), proxy);
      })
      .mapErr((e) => {
        // If we encounter a problem, destroy the proxy so we can start afresh.
        proxy.destroy();

        // Notify the world
        context.onAuthorizedMerchantActivationFailed.next(merchantUrl);

        return e;
      });
  }

  /**
   * Returns a map of merchant URLs with their authorization signatures.
   */
  public getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError> {
    const authorizedMerchants = this._getAuthorizedMerchants();

    return okAsync(authorizedMerchants);
  }

  public resolveChallenge(
    merchantUrl: URL,
    paymentId: string,
    transferId: string,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | CoreUninitializedError> {
    const proxy = this.activatedMerchants.get(merchantUrl.toString());

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

  protected _setAuthorizedMerchants(authorizedMerchantMap: Map<string, string>) {
    const authorizedMerchantEntries = new Array<IAuthorizedMerchantEntry>();
    for (const keyval of authorizedMerchantMap) {
      authorizedMerchantEntries.push({ merchantUrl: keyval[0], authorizationSignature: keyval[1] });
    }
    window.localStorage.setItem("AuthorizedMerchants", JSON.stringify(authorizedMerchantEntries));
  }

  protected _getAuthorizedMerchants(): Map<string, string> {
    let authorizedMerchantStr = window.localStorage.getItem("AuthorizedMerchants");

    if (authorizedMerchantStr == null) {
      authorizedMerchantStr = "[]";
    }
    const authorizedMerchantEntries = JSON.parse(authorizedMerchantStr) as IAuthorizedMerchantEntry[];

    const authorizedMerchants = new Map<string, string>();
    for (const authorizedMerchantEntry of authorizedMerchantEntries) {
      authorizedMerchants.set(authorizedMerchantEntry.merchantUrl, authorizedMerchantEntry.authorizationSignature);
    }
    return authorizedMerchants;
  }

  public activateAuthorizedMerchants(): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | CoreUninitializedError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.getAuthorizedMerchants(),
      this.blockchainProvider.getSigner()
    ]).andThen((vals) => {
      const [config, context, authorizedMerchants, signer] = vals;
      const activationResults = new Array<ResultAsync<void, Error>>();

      for (const keyval of authorizedMerchants) {
        activationResults.push(
          this._activateAuthorizedMerchant(context.account, 
            keyval[0], // URL
            keyval[1], 
            config.merchantIframeUrl,
            context,
            signer),
        );
      }

      return ResultUtils.combine(activationResults).map(() => {});
    });
  }

  protected _activateAuthorizedMerchant(
    address: string,
    merchantUrl: string,
    authorizationSignature: string,
    merchantIFrameUrl: string,
    context: HypernetContext,
    signer: ethers.providers.JsonRpcSigner
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError> {
    const proxy = this._factoryProxy(merchantIFrameUrl, merchantUrl);
    return proxy
      .activate()
      .andThen(() => {
        // Once the proxy is activated, we need to get the validated signature
        return proxy.getValidatedSignature();
      })
      .andThen((validatedSignature) => {
        //const validationAddress = ethers.utils.verifyMessage(validatedSignature, authorizationSignature);
        const value = {
          authorizedMerchantUrl: merchantUrl,
          merchantValidatedSignature: validatedSignature,
        } as Record<string, any>;
        const validationAddress = ethers.utils.verifyTypedData(this.domain, this.types, value, authorizationSignature);

        if (validationAddress !== address) {
          // Notify the user that one of their authorized merchants has changed their code
          context.onAuthorizedMerchantUpdated.next(new URL(merchantUrl));

          // Get a new signature
          // validatedSignature means the code is signed by the provider, so we just need
          // to sign this new version.
        const signerPromise = signer._signTypedData(this.domain, this.types, value);

        return ResultAsync.fromPromise(signerPromise, (e) => e as MerchantConnectorError);
        }

        return okAsync<string, MerchantValidationError>(validationAddress);
      })
      .andThen(() => {
        return proxy.activateConnector();
      })
      .map(() => {
        this.activatedMerchants.set(merchantUrl, proxy);
      })
      .mapErr((e) => {
        // The connector could not be authenticated, so just get rid of it.
        proxy.destroy();

        // Notify the world
        context.onAuthorizedMerchantActivationFailed.next(new URL(merchantUrl));

        return e;
      })
  }

  protected _factoryProxy(merchantIFrameUrl: string, merchantUrl: string): MerchantConnectorProxy {
    const iframeUrl = new URL(merchantIFrameUrl);
    iframeUrl.searchParams.set("merchantUrl", merchantUrl);
    const proxy = new MerchantConnectorProxy(null, iframeUrl.toString());
    return proxy;
  }
}
