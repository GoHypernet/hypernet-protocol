import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  PullPayment,
  PushPayment,
  ProxyError,
  BlockchainUnavailableError,
  TransferResolutionError,
  PaymentId,
  TransferId,
  EthereumAddress,
  Signature,
  MerchantUrl,
  Balances,
  AuthorizedMerchantsSchema,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  AjaxError,
  MerchantActivationError,
  MerchantAuthorizationDeniedError,
  PersistenceError,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  IAjaxUtils,
  ILocalStorageUtils,
  ILogUtils,
  IAjaxUtilsType,
  ILocalStorageUtilsType,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { BigNumber, ethers } from "ethers";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IMerchantConnectorRepository,
  IAuthorizedMerchantEntry,
} from "@interfaces/data";
import { InitializedHypernetContext } from "@interfaces/objects";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IBlockchainUtils,
  IBlockchainUtilsType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IMerchantConnectorProxy,
  IVectorUtils,
  IVectorUtilsType,
  ICeramicUtils,
  ICeramicUtilsType,
} from "@interfaces/utilities";
import {
  IMerchantConnectorProxyFactory,
  IMerchantConnectorProxyFactoryType,
} from "@interfaces/utilities/factory";

@injectable()
export class MerchantConnectorRepository
  implements IMerchantConnectorRepository {
  protected authorizedMerchantProxies: Map<
    MerchantUrl,
    ResultAsync<
      IMerchantConnectorProxy,
      | MerchantActivationError
      | MerchantValidationError
      | MerchantAuthorizationDeniedError
      | ProxyError
    >
  >;
  protected existingProxies: Map<MerchantUrl, IMerchantConnectorProxy>;
  protected domain: TypedDataDomain;
  protected types: Record<string, TypedDataField[]>;
  protected activateAuthorizedMerchantsResult:
    | ResultAsync<void, never>
    | undefined;
  protected balances: Balances | undefined;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IAjaxUtilsType) protected ajaxUtils: IAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IVectorUtilsType) protected vectorUtils: IVectorUtils,
    @inject(ICeramicUtilsType) protected ceramicUtils: ICeramicUtils,
    @inject(IMerchantConnectorProxyFactoryType)
    protected merchantConnectorProxyFactory: IMerchantConnectorProxyFactory,
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.authorizedMerchantProxies = new Map();
    this.existingProxies = new Map();
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

  public getMerchantAddresses(
    merchantUrls: MerchantUrl[],
  ): ResultAsync<
    Map<MerchantUrl, EthereumAddress>,
    AjaxError | ProxyError | MerchantAuthorizationDeniedError
  > {
    // TODO: right now, the merchant will publish a URL with their address; eventually, they should be held in a smart contract

    // For merchants that are already authorized, we can just go to their connector for the
    // public key.
    const addressRequests = new Array<
      ResultAsync<
        { merchantUrl: MerchantUrl; address: EthereumAddress },
        | MerchantConnectorError
        | LogicalError
        | ProxyError
        | MerchantAuthorizationDeniedError
      >
    >();
    for (const merchantUrl of merchantUrls) {
      // We can't use _getActivatedMerchantProxy because it may fire an error when activateAuthorizedMerchantsResult is null
      // and in our case here we might need to pull the address from the source using ajax request not from the proxy.
      const authorizedMerchantProxyResult = this.authorizedMerchantProxies.get(
        merchantUrl,
      );

      if (authorizedMerchantProxyResult == null) {
        addressRequests.push(this._getMerchantAddress(merchantUrl));
      } else {
        addressRequests.push(
          authorizedMerchantProxyResult
            .andThen((merchantProxy) => {
              return merchantProxy.getAddress().map((address) => {
                return { merchantUrl, address };
              });
            })
            .orElse(() => {
              // Need to get it from the source
              return this._getMerchantAddress(merchantUrl);
            }),
        );
      }
    }

    return ResultUtils.combine(addressRequests).map((vals) => {
      const returnMap = new Map<MerchantUrl, EthereumAddress>();
      for (const val of vals) {
        returnMap.set(
          MerchantUrl(val.merchantUrl.toString()),
          EthereumAddress(val.address),
        );
      }

      return returnMap;
    });
  }

  public addAuthorizedMerchant(
    merchantUrl: MerchantUrl,
    initialBalances: Balances,
  ): ResultAsync<
    void,
    | PersistenceError
    | LogicalError
    | MerchantValidationError
    | ProxyError
    | BlockchainUnavailableError
    | MerchantConnectorError
    | PersistenceError
  > {
    let proxy: IMerchantConnectorProxy;
    let context: InitializedHypernetContext;

    // First, we will create the proxy
    return this.contextProvider
      .getInitializedContext()
      .andThen((myContext) => {
        context = myContext;
        return this.merchantConnectorProxyFactory.factoryProxy(merchantUrl);
      })
      .andThen((myProxy) => {
        proxy = myProxy;
        this.existingProxies.set(merchantUrl, proxy);

        // With the proxy activated, we can get the validated merchant signature
        return ResultUtils.combine([
          proxy.getValidatedSignature(),
          this.blockchainProvider.getSigner(),
        ]);
      })
      .andThen((vals) => {
        const [merchantSignature, signer] = vals;

        // merchantSignature has been validated by the iframe, so this is already confirmed.
        // Now we need to get an authorization signature
        const value = {
          authorizedMerchantUrl: merchantUrl,
          merchantValidatedSignature: merchantSignature,
        } as Record<string, unknown>;
        const signerPromise = signer._signTypedData(
          this.domain,
          this.types,
          value,
        );

        return ResultUtils.combine([
          ResultAsync.fromPromise<string, MerchantValidationError>(
            signerPromise,
            (e) => e as MerchantValidationError,
          ),
          this.getAuthorizedMerchants(),
        ]);
      })
      .andThen((vals) => {
        // The connector has been authorized, store it as an authorized connector
        const [authorizationSignature, authorizedMerchants] = vals;

        authorizedMerchants.set(merchantUrl, Signature(authorizationSignature));

        return this._setAuthorizedMerchants(authorizedMerchants);
      })
      .andThen(() => {
        // Notify the world that the merchant connector exists
        // Notably, API listeners could start
        if (context != null) {
          context.onMerchantConnectorProxyActivated.next(proxy);
        }

        // Activate the merchant connector
        return proxy.activateConnector(
          context.publicIdentifier,
          initialBalances,
        );
      })
      .map(() => {
        // Only if the merchant is successfully activated do we stick it in the list.
        this.authorizedMerchantProxies.set(merchantUrl, okAsync(proxy));
      })
      .mapErr((e) => {
        // If we encounter a problem, destroy the proxy so we can start afresh.
        this._destroyProxy(merchantUrl);

        // Notify the world
        if (context != null) {
          context.onAuthorizedMerchantActivationFailed.next(merchantUrl);
        }

        return e as PersistenceError;
      });
  }

  /**
   * Returns a map of merchant URLs with their authorization signatures.
   */
  public getAuthorizedMerchants(): ResultAsync<
    Map<MerchantUrl, Signature>,
    PersistenceError
  > {
    return this.ceramicUtils
      .readRecord<IAuthorizedMerchantEntry[]>(AuthorizedMerchantsSchema.title)
      .andThen((storedAuthorizedMerchants) => {
        const authorizedMerchants = new Map<MerchantUrl, Signature>();

        if (storedAuthorizedMerchants != null) {
          for (const authorizedMerchantEntry of storedAuthorizedMerchants) {
            authorizedMerchants.set(
              MerchantUrl(authorizedMerchantEntry.merchantUrl),
              Signature(authorizedMerchantEntry.authorizationSignature),
            );
          }
        }

        return okAsync(authorizedMerchants);
      });
  }

  public resolveChallenge(
    merchantUrl: MerchantUrl,
    paymentId: PaymentId,
    transferId: TransferId,
  ): ResultAsync<
    void,
    | MerchantConnectorError
    | MerchantValidationError
    | TransferResolutionError
    | MerchantAuthorizationDeniedError
    | ProxyError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      // if merchant is activated, start resolving the transfer
      return proxy
        .resolveChallenge(paymentId)
        .andThen((result) => {
          const { mediatorSignature, amount } = result;

          return this.vectorUtils.resolveInsuranceTransfer(
            transferId,
            paymentId,
            Signature(mediatorSignature),
            BigNumber.from(amount),
          );
        })
        .map(() => {});
    });
  }

  public closeMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      return proxy.closeMerchantIFrame();
    });
  }

  public displayMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      return proxy.displayMerchantIFrame();
    });
  }

  /**
   * This function will attempt to activate all of your authorized merchants. It should only error
   * in the case that the whole startup process should be aborted- something is fatally fucked up.
   * This means that even otherwise fatal errors such as like the blockchain being unavailable will
   * not stop it; the net effect is that you have no activated merchants. Authorized, yes, activated no.
   * There are lots of things you can do with an inactive merchant connector.
   */
  public activateAuthorizedMerchants(
    balances: Balances,
  ): ResultAsync<void, PersistenceError> {
    this.balances = balances;

    if (this.activateAuthorizedMerchantsResult == null) {
      this.activateAuthorizedMerchantsResult = ResultUtils.combine([
        this.contextProvider.getInitializedContext(),
        this.getAuthorizedMerchants(),
        this.blockchainProvider.getSigner(),
      ])
        .andThen((vals) => {
          const [context, authorizedMerchants, signer] = vals;
          const activationResults = new Array<() => ResultAsync<void, never>>();

          for (const [merchantUrl, signature] of authorizedMerchants) {
            activationResults.push(() => {
              return this._activateAuthorizedMerchant(
                balances,
                merchantUrl,
                signature,
                context,
                signer,
              )
                .map((_proxy) => {
                  return;
                })
                .orElse((e) => {
                  // This function will eat all errors, so that startup
                  // will not be denied.
                  this.logUtils.error(
                    `Could not activate authorized merchant ${merchantUrl}`,
                  );
                  this.logUtils.error(e);
                  return okAsync(undefined);
                });
            });
          }

          // There is a reason for this
          // Postmate has issues creating multiple proxies in parallel- the handshake process will break.
          // I would like to swap out or fix Postmate- there are some forks that would be good- but the easiest
          // fix is this.
          return ResultUtils.executeSerially(activationResults);
        })
        .map(() => {})
        .orElse((e) => {
          this.logUtils.error(
            "Could not get prerequisites for activateAuthorizedMerchants",
          );
          this.logUtils.error(e);
          return okAsync(undefined);
        });
    }
    return this.activateAuthorizedMerchantsResult;
  }

  public notifyPushPaymentSent(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentSent(payment);
    });
  }

  public notifyPushPaymentUpdated(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentUpdated(payment);
    });
  }

  public notifyPushPaymentReceived(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentReceived(payment);
    });
  }

  public notifyPullPaymentSent(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentSent(payment);
    });
  }

  public notifyPullPaymentUpdated(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentUpdated(payment);
    });
  }

  public notifyPullPaymentReceived(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(merchantUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentReceived(payment);
    });
  }

  public notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<
    void,
    | MerchantAuthorizationDeniedError
    | ProxyError
    | MerchantConnectorError
    | PersistenceError
  > {
    const results = new Array<ResultAsync<void, MerchantConnectorError>>();
    return this.getAuthorizedMerchants().andThen((authorizedMerchants) => {
      for (const [merchantUrl] of authorizedMerchants) {
        results.push(
          this._getActivatedMerchantProxy(merchantUrl).map((proxy) => {
            proxy.notifyBalancesReceived(balances);
          }),
        );
      }
      return ResultUtils.combine(results).map(() => {});
    });
  }

  public deauthorizeMerchant(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, PersistenceError> {
    return this.getAuthorizedMerchants()
      .map((authorizedMerchants) => {
        authorizedMerchants.delete(merchantUrl);

        return this._setAuthorizedMerchants(authorizedMerchants);
      })
      .map(() => {
        // Remove the proxy
        this._destroyProxy(merchantUrl);
      });
  }

  public getAuthorizedMerchantsConnectorsStatus(): ResultAsync<
    Map<MerchantUrl, boolean>,
    PersistenceError
  > {
    const retMap = new Map<MerchantUrl, boolean>();
    if (this.activateAuthorizedMerchantsResult == null) {
      throw new Error("You must call activateAuthorizedMerchants first!");
    }

    return ResultUtils.combine([
      this.getAuthorizedMerchants(),
      this.activateAuthorizedMerchantsResult,
    ])
      .andThen((vals) => {
        const [authorizedMerchants] = vals;
        // Go through the results for the merchant
        const proxyResults = new Array<ResultAsync<void, never>>();
        for (const [merchantUrl, _signature] of authorizedMerchants) {
          const proxyResult = this.authorizedMerchantProxies.get(merchantUrl);

          if (proxyResult == null) {
            throw new Error("Something deeply screwed up!");
          }

          proxyResults.push(
            proxyResult
              .map(() => {
                retMap.set(merchantUrl, true);
              })
              .orElse(() => {
                retMap.set(merchantUrl, false);
                return okAsync<void, never>(undefined);
              }),
          );
        }

        return ResultUtils.combine(proxyResults);
      })
      .map(() => {
        return retMap;
      });
  }

  protected _getMerchantAddress(
    merchantUrl: MerchantUrl,
  ): ResultAsync<
    { merchantUrl: MerchantUrl; address: EthereumAddress },
    | MerchantConnectorError
    | LogicalError
    | ProxyError
    | MerchantAuthorizationDeniedError
  > {
    const url = new URL(merchantUrl.toString());
    url.pathname = "address";
    return this.ajaxUtils.get<EthereumAddress>(url).map((address) => {
      return { merchantUrl, address };
    });
  }

  protected _getActivatedMerchantProxy(
    merchantUrl: MerchantUrl,
  ): ResultAsync<
    IMerchantConnectorProxy,
    ProxyError | MerchantAuthorizationDeniedError | PersistenceError
  > {
    // The goal of this method is to return an activated merchant proxy,
    // and not resolve unless all hope is lost.

    // Wait until activateAuthorizedMerchants is done doing its thing
    if (this.activateAuthorizedMerchantsResult == null) {
      throw new Error("You need to call activateAuthorizedMerchants first!");
    }

    let cachedAuthorizationSignature: Signature | undefined;

    // Check that the merchantUrl is authorized
    return ResultUtils.combine([
      this.getAuthorizedMerchants(),
      this.activateAuthorizedMerchantsResult,
    ])
      .andThen((vals) => {
        const [authorizedMerchants] = vals;
        // If the merchant is not authorized, that's a fatal error.
        // Now, you may ask yourself, what about addAuthorizedMerchant?
        // Well, you can't call this method until that one is complete.
        // If the merchant was already authorized, you can call this
        // method and get the in-progress activation.
        const authorizationSignature = authorizedMerchants.get(merchantUrl);
        if (authorizationSignature == null) {
          throw new Error(`Merchant ${merchantUrl} is unauthorized!`);
        }

        // Store the signature in case we need to retry anything.
        cachedAuthorizationSignature = authorizationSignature;

        const proxyResult = this.authorizedMerchantProxies.get(merchantUrl);
        if (proxyResult == null) {
          throw new Error(
            `There is not result for merchant ${merchantUrl}, even though it is authorized. Something strange going on.`,
          );
        }

        return proxyResult;
      })
      .map((proxy) => {
        // The proxy was activated without an error
        return proxy;
      })
      .orElse((e) => {
        // There is something wrong
        if (e instanceof MerchantAuthorizationDeniedError) {
          // Not a lot we can do about that.
          return errAsync(e);
        }

        if (e instanceof ProxyError) {
          // We could not setup the proxy.
          // This is retryable
          return ResultUtils.backoffAndRetry(() => {
            // Clean out
            this.authorizedMerchantProxies.delete(merchantUrl);
            this._destroyProxy(merchantUrl);
            const activationResult = ResultUtils.combine([
              this.contextProvider.getInitializedContext(),
              this.blockchainProvider.getSigner(),
            ]).andThen((vals) => {
              const [context, signer] = vals;

              if (
                this.balances == null ||
                cachedAuthorizationSignature == null
              ) {
                throw new Error("No cached balances");
              }
              return this._activateAuthorizedMerchant(
                this.balances,
                merchantUrl,
                cachedAuthorizationSignature,
                context,
                signer,
              );
            });
            this.authorizedMerchantProxies.set(merchantUrl, activationResult);
            return activationResult;
          }, [ProxyError, MerchantValidationError, MerchantActivationError]);
        }

        // Backoff
        return errAsync(e);
      });
  }

  /**
   * This function does all the work of trying to activate a merchant connector. It can be called multiple times.
   * @param accountAddress
   * @param balances
   * @param merchantUrl
   * @param authorizationSignature
   * @param context
   * @param signer
   * @returns
   */
  protected _activateAuthorizedMerchant(
    balances: Balances,
    merchantUrl: MerchantUrl,
    authorizationSignature: Signature,
    context: InitializedHypernetContext,
    signer: ethers.providers.JsonRpcSigner,
  ): ResultAsync<
    IMerchantConnectorProxy,
    | MerchantActivationError
    | MerchantValidationError
    | MerchantAuthorizationDeniedError
    | ProxyError
  > {
    // Do some initial cleanup, so that this can be called repeatedly.
    const existingProxyResult = this.authorizedMerchantProxies.get(merchantUrl);

    if (existingProxyResult != null) {
      return existingProxyResult;
    }

    let proxy: IMerchantConnectorProxy;

    this.logUtils.debug(`Activating merchant connector ${merchantUrl}`);
    const proxyResult = this.merchantConnectorProxyFactory
      .factoryProxy(merchantUrl)
      .andThen((myProxy) => {
        this.logUtils.debug(`Proxy created for ${merchantUrl}`);
        proxy = myProxy;
        this.existingProxies.set(merchantUrl, proxy);

        // We need to get the validated signature, so we can see if it was authorized
        return this._validateConnector(
          merchantUrl,
          proxy,
          authorizationSignature,
          context,
          signer,
        );
      })
      .andThen(() => {
        return this._activateConnector(context, proxy, balances);
      })
      .map(() => {
        // TODO: make sure of the implementation here, this will trigger an event and a subscribe event in MerchantConnectorListener
        // will call advanceMerchantUnresolvedPayments.
        context.onMerchantConnectorProxyActivated.next(proxy);
        return proxy;
      })
      .mapErr((e) => {
        // Notify the world
        context.onAuthorizedMerchantActivationFailed.next(merchantUrl);

        this.logUtils.error(
          `Merchant connector ${merchantUrl} failed to activate`,
        );

        // TODO: make sure of error cases where we want to destroy the proxy or not
        if (e instanceof ProxyError || e instanceof MerchantActivationError) {
          this._destroyProxy(merchantUrl);
        }

        return e;
      });

    this.authorizedMerchantProxies.set(merchantUrl, proxyResult);

    return proxyResult;
  }

  protected _validateConnector(
    merchantUrl: MerchantUrl,
    proxy: IMerchantConnectorProxy,
    authorizationSignature: Signature,
    context: InitializedHypernetContext,
    signer: ethers.providers.JsonRpcSigner,
  ): ResultAsync<
    void,
    | MerchantAuthorizationDeniedError
    | MerchantValidationError
    | ProxyError
    | PersistenceError
  > {
    this.logUtils.debug(`Validating code signature for ${merchantUrl}`);
    return proxy.getValidatedSignature().andThen((validatedSignature) => {
      const value = {
        authorizedMerchantUrl: merchantUrl,
        merchantValidatedSignature: validatedSignature,
      } as Record<string, unknown>;

      const validationAddress = this.blockchainUtils.verifyTypedData(
        this.domain,
        this.types,
        value,
        authorizationSignature,
      );

      if (validationAddress !== context.account) {
        // Notify the user that one of their authorized merchants has changed their code
        context.onAuthorizedMerchantUpdated.next(merchantUrl);

        // Get a new signature
        // validatedSignature means the code is signed by the provider, so we just need
        // to sign this new version.
        const signerPromise = signer._signTypedData(
          this.domain,
          this.types,
          value,
        );

        // Get a new signature from the user
        const signerResult = ResultAsync.fromPromise(
          signerPromise,
          (e) => e as Error,
        ).orElse((e) => {
          // We only end up here if the user has denied signing
          // to authorize the new connector.
          // We need to de-authorize this merchant
          return this.deauthorizeMerchant(merchantUrl).andThen(() => {
            // And then propagate the error
            this.logUtils.error(e);
            return errAsync(new MerchantAuthorizationDeniedError(e.message));
          });
        });

        return ResultUtils.combine([
          signerResult,
          this.getAuthorizedMerchants(),
        ])
          .map((vals) => {
            const [newAuthorizationSignature, authorizedMerchants] = vals;

            authorizedMerchants.set(
              merchantUrl,
              Signature(newAuthorizationSignature),
            );

            return this._setAuthorizedMerchants(authorizedMerchants);
          })
          .map(() => {});
      }

      this.logUtils.debug(`Code signature validated for ${merchantUrl}`);
      return okAsync<void, MerchantAuthorizationDeniedError>(undefined);
    });
  }

  protected _activateConnector(
    context: InitializedHypernetContext,
    proxy: IMerchantConnectorProxy,
    balances: Balances,
  ): ResultAsync<
    IMerchantConnectorProxy,
    MerchantActivationError | ProxyError
  > {
    this.logUtils.debug(`Activating connector for ${proxy.merchantUrl}`);
    return proxy
      .activateConnector(context.publicIdentifier, balances)
      .map(() => {
        this.logUtils.debug(`Connector activated for ${proxy.merchantUrl}`);
        return proxy;
      });
  }

  protected _destroyProxy(merchantUrl: MerchantUrl): void {
    const proxy = this.existingProxies.get(merchantUrl);
    if (proxy != null) {
      proxy.destroy();
      this.existingProxies.delete(merchantUrl);
    }
  }

  protected _setAuthorizedMerchants(
    authorizedMerchantMap: Map<MerchantUrl, Signature>,
  ): ResultAsync<void, PersistenceError> {
    const authorizedMerchantEntries = new Array<IAuthorizedMerchantEntry>();

    for (const keyval of authorizedMerchantMap) {
      authorizedMerchantEntries.push({
        merchantUrl: MerchantUrl(keyval[0]),
        authorizationSignature: Signature(keyval[1]),
      });
    }

    return this.ceramicUtils.writeRecord<IAuthorizedMerchantEntry[]>(
      AuthorizedMerchantsSchema.title,
      authorizedMerchantEntries,
    );
  }
}
