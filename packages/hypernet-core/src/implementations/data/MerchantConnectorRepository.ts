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
  GatewayUrl,
  Balances,
  AuthorizedGatewaysSchema,
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
  ILogUtils,
  IAjaxUtilsType,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { BigNumber, ethers } from "ethers";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IMerchantConnectorRepository,
  IAuthorizedMerchantEntry,
} from "@interfaces/data";
import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";
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
} from "@interfaces/utilities";
import {
  IMerchantConnectorProxyFactory,
  IMerchantConnectorProxyFactoryType,
} from "@interfaces/utilities/factory";

@injectable()
export class MerchantConnectorRepository
  implements IMerchantConnectorRepository {
  protected authorizedGatewayProxies: Map<
    GatewayUrl,
    ResultAsync<
      IMerchantConnectorProxy,
      | MerchantActivationError
      | MerchantValidationError
      | MerchantAuthorizationDeniedError
      | ProxyError
    >
  >;
  protected existingProxies: Map<GatewayUrl, IMerchantConnectorProxy>;
  protected domain: TypedDataDomain;
  protected types: Record<string, TypedDataField[]>;
  protected activateAuthorizedGatewaysResult:
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
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IMerchantConnectorProxyFactoryType)
    protected merchantConnectorProxyFactory: IMerchantConnectorProxyFactory,
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.authorizedGatewayProxies = new Map();
    this.existingProxies = new Map();
    this.domain = {
      name: "Hypernet Protocol",
      version: "1",
    };
    this.types = {
      AuthorizedMerchant: [
        { name: "authorizedGatewayUrl", type: "string" },
        { name: "merchantValidatedSignature", type: "string" },
      ],
    };
  }

  public getMerchantAddresses(
    merchantUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, EthereumAddress>,
    AjaxError | ProxyError | MerchantAuthorizationDeniedError
  > {
    // TODO: right now, the merchant will publish a URL with their address; eventually, they should be held in a smart contract

    // For merchants that are already authorized, we can just go to their connector for the
    // public key.
    const addressRequests = new Array<
      ResultAsync<
        { gatewayUrl: GatewayUrl; address: EthereumAddress },
        | MerchantConnectorError
        | LogicalError
        | ProxyError
        | MerchantAuthorizationDeniedError
      >
    >();
    for (const gatewayUrl of merchantUrls) {
      // We can't use _getActivatedMerchantProxy because it may fire an error when activateAuthorizedGatewaysResult is null
      // and in our case here we might need to pull the address from the source using ajax request not from the proxy.
      const authorizedGatewayProxyResult = this.authorizedGatewayProxies.get(
        gatewayUrl,
      );

      if (authorizedGatewayProxyResult == null) {
        addressRequests.push(this._getMerchantAddress(gatewayUrl));
      } else {
        addressRequests.push(
          authorizedGatewayProxyResult
            .andThen((merchantProxy) => {
              return merchantProxy.getAddress().map((address) => {
                return { gatewayUrl, address };
              });
            })
            .orElse(() => {
              // Need to get it from the source
              return this._getMerchantAddress(gatewayUrl);
            }),
        );
      }
    }

    return ResultUtils.combine(addressRequests).map((vals) => {
      const returnMap = new Map<GatewayUrl, EthereumAddress>();
      for (const val of vals) {
        returnMap.set(
          GatewayUrl(val.gatewayUrl.toString()),
          EthereumAddress(val.address),
        );
      }

      return returnMap;
    });
  }

  public addAuthorizedMerchant(
    gatewayUrl: GatewayUrl,
    initialBalances: Balances,
  ): ResultAsync<
    void,
    | PersistenceError
    | LogicalError
    | MerchantValidationError
    | ProxyError
    | BlockchainUnavailableError
    | MerchantConnectorError
    | MerchantActivationError
  > {
    let proxy: IMerchantConnectorProxy;
    let context: InitializedHypernetContext;

    // First, we will create the proxy
    return this.contextProvider
      .getInitializedContext()
      .andThen((myContext) => {
        context = myContext;
        return this.merchantConnectorProxyFactory.factoryProxy(gatewayUrl);
      })
      .andThen((myProxy) => {
        proxy = myProxy;
        this.existingProxies.set(gatewayUrl, proxy);

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
          authorizedGatewayUrl: gatewayUrl,
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
          this.getAuthorizedGateways(),
        ]);
      })
      .andThen((vals) => {
        // The connector has been authorized, store it as an authorized connector
        const [authorizationSignature, authorizedGateways] = vals;

        authorizedGateways.set(gatewayUrl, Signature(authorizationSignature));

        return this._setAuthorizedGateways(authorizedGateways);
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
        this.authorizedGatewayProxies.set(gatewayUrl, okAsync(proxy));
      })
      .mapErr((e) => {
        // If we encounter a problem, destroy the proxy so we can start afresh.
        this.destroyProxy(gatewayUrl);

        // Notify the world
        if (context != null) {
          context.onAuthorizedMerchantActivationFailed.next(gatewayUrl);
        }

        return new MerchantActivationError(
          `Unable to activate merchant ${gatewayUrl}`,
          e,
        );
      });
  }

  /**
   * Returns a map of merchant URLs with their authorization signatures.
   */
  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  > {
    return this.storageUtils
      .read<IAuthorizedMerchantEntry[]>(AuthorizedGatewaysSchema.title)
      .andThen((storedAuthorizedGateways) => {
        const authorizedGateways = new Map<GatewayUrl, Signature>();

        if (storedAuthorizedGateways != null) {
          for (const authorizedGatewayEntry of storedAuthorizedGateways) {
            authorizedGateways.set(
              GatewayUrl(authorizedGatewayEntry.gatewayUrl),
              Signature(authorizedGatewayEntry.authorizationSignature),
            );
          }
        }

        return okAsync(authorizedGateways);
      });
  }

  public resolveChallenge(
    gatewayUrl: GatewayUrl,
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
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
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
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
      return proxy.closeMerchantIFrame();
    });
  }

  public displayMerchantIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
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
  public activateAuthorizedGateways(
    balances: Balances,
  ): ResultAsync<void, never> {
    this.balances = balances;

    if (this.activateAuthorizedGatewaysResult == null) {
      this.activateAuthorizedGatewaysResult = ResultUtils.combine([
        this.contextProvider.getInitializedContext(),
        this.getAuthorizedGateways().orElse((e) => {
          return okAsync(new Map());
        }),
        this.blockchainProvider.getSigner(),
      ])
        .andThen((vals) => {
          const [context, authorizedGateways, signer] = vals;
          const activationResults = new Array<() => ResultAsync<void, never>>();

          for (const [gatewayUrl, signature] of authorizedGateways) {
            activationResults.push(() => {
              return this._activateAuthorizedMerchant(
                balances,
                gatewayUrl,
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
                    `Could not activate authorized merchant ${gatewayUrl}`,
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
            "Could not get prerequisites for activateAuthorizedGateways",
          );
          this.logUtils.error(e);
          return okAsync(undefined);
        });
    }
    return this.activateAuthorizedGatewaysResult;
  }

  public notifyPushPaymentSent(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentSent(payment);
    });
  }

  public notifyPushPaymentUpdated(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentUpdated(payment);
    });
  }

  public notifyPushPaymentReceived(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentReceived(payment);
    });
  }

  public notifyPullPaymentSent(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentSent(payment);
    });
  }

  public notifyPullPaymentUpdated(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentUpdated(payment);
    });
  }

  public notifyPullPaymentReceived(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    MerchantAuthorizationDeniedError | ProxyError | MerchantConnectorError
  > {
    return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
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
    return this.getAuthorizedGateways().andThen((authorizedGateways) => {
      for (const [gatewayUrl] of authorizedGateways) {
        results.push(
          this._getActivatedMerchantProxy(gatewayUrl).map((proxy) => {
            proxy.notifyBalancesReceived(balances);
          }),
        );
      }
      return ResultUtils.combine(results).map(() => {});
    });
  }

  public deauthorizeMerchant(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
  > {
    return this.getAuthorizedGateways()
      .map((authorizedGateways) => {
        authorizedGateways.delete(gatewayUrl);

        return this._setAuthorizedGateways(authorizedGateways);
      })
      .andThen(() => {
        return this._getActivatedMerchantProxy(gatewayUrl).andThen((proxy) => {
          return proxy.deauthorize();
        });
      })
      .map(() => {
        // Remove the proxy
        return this.destroyProxy(gatewayUrl);
      });
  }

  public getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
  > {
    const retMap = new Map<GatewayUrl, boolean>();
    if (this.activateAuthorizedGatewaysResult == null) {
      throw new Error("You must call activateAuthorizedGateways first!");
    }

    return this.getAuthorizedGateways()
      .andThen((authorizedGateways) => {
        // Go through the results for the merchant
        const proxyResults = new Array<ResultAsync<void, never>>();
        for (const [gatewayUrl, _signature] of authorizedGateways) {
          const proxyResult = this.authorizedGatewayProxies.get(gatewayUrl);

          if (proxyResult == null) {
            throw new Error("Something deeply screwed up!");
          }

          proxyResults.push(
            proxyResult
              .map(() => {
                retMap.set(gatewayUrl, true);
              })
              .orElse(() => {
                retMap.set(gatewayUrl, false);
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

  public destroyProxy(gatewayUrl: GatewayUrl): void {
    const proxy = this.existingProxies.get(gatewayUrl);
    if (proxy != null) {
      proxy.destroy();
      this.existingProxies.delete(gatewayUrl);
    }
  }

  protected _getMerchantAddress(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    { gatewayUrl: GatewayUrl; address: EthereumAddress },
    | MerchantConnectorError
    | LogicalError
    | ProxyError
    | MerchantAuthorizationDeniedError
  > {
    const url = new URL(gatewayUrl.toString());
    url.pathname = "address";
    return this.ajaxUtils.get<EthereumAddress>(url).map((address) => {
      return { gatewayUrl, address };
    });
  }

  protected _getActivatedMerchantProxy(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    IMerchantConnectorProxy,
    ProxyError | MerchantAuthorizationDeniedError | PersistenceError
  > {
    // The goal of this method is to return an activated merchant proxy,
    // and not resolve unless all hope is lost.

    // Wait until activateAuthorizedGateways is done doing its thing
    if (this.activateAuthorizedGatewaysResult == null) {
      throw new Error("You need to call activateAuthorizedGateways first!");
    }

    let cachedAuthorizationSignature: Signature | undefined;

    // Check that the gatewayUrl is authorized
    return ResultUtils.combine([
      this.getAuthorizedGateways(),
      this.activateAuthorizedGatewaysResult,
    ])
      .andThen((vals) => {
        const [authorizedGateways] = vals;
        // If the merchant is not authorized, that's a fatal error.
        // Now, you may ask yourself, what about addAuthorizedMerchant?
        // Well, you can't call this method until that one is complete.
        // If the merchant was already authorized, you can call this
        // method and get the in-progress activation.
        const authorizationSignature = authorizedGateways.get(gatewayUrl);
        if (authorizationSignature == null) {
          throw new Error(`Gateway ${gatewayUrl} is unauthorized!`);
        }

        // Store the signature in case we need to retry anything.
        cachedAuthorizationSignature = authorizationSignature;

        const proxyResult = this.authorizedGatewayProxies.get(gatewayUrl);
        if (proxyResult == null) {
          throw new Error(
            `There is not result for merchant ${gatewayUrl}, even though it is authorized. Something strange going on.`,
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
            this.authorizedGatewayProxies.delete(gatewayUrl);
            this.destroyProxy(gatewayUrl);
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
                gatewayUrl,
                cachedAuthorizationSignature,
                context,
                signer,
              );
            });
            this.authorizedGatewayProxies.set(gatewayUrl, activationResult);
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
   * @param gatewayUrl
   * @param authorizationSignature
   * @param context
   * @param signer
   * @returns
   */
  protected _activateAuthorizedMerchant(
    balances: Balances,
    gatewayUrl: GatewayUrl,
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
    const existingProxyResult = this.authorizedGatewayProxies.get(gatewayUrl);

    if (existingProxyResult != null) {
      return existingProxyResult;
    }

    let proxy: IMerchantConnectorProxy;

    this.logUtils.debug(`Activating merchant connector ${gatewayUrl}`);
    const proxyResult = this.merchantConnectorProxyFactory
      .factoryProxy(gatewayUrl)
      .andThen((myProxy) => {
        this.logUtils.debug(`Proxy created for ${gatewayUrl}`);
        proxy = myProxy;
        this.existingProxies.set(gatewayUrl, proxy);

        // We need to get the validated signature, so we can see if it was authorized
        return this._validateConnector(
          gatewayUrl,
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
        context.onAuthorizedMerchantActivationFailed.next(gatewayUrl);

        this.logUtils.error(
          `Gateway connector ${gatewayUrl} failed to activate`,
        );

        // TODO: make sure of error cases where we want to destroy the proxy or not
        if (e instanceof ProxyError || e instanceof MerchantActivationError) {
          this.destroyProxy(gatewayUrl);
        }

        return e;
      });

    this.authorizedGatewayProxies.set(gatewayUrl, proxyResult);

    return proxyResult;
  }

  protected _validateConnector(
    gatewayUrl: GatewayUrl,
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
    this.logUtils.debug(`Validating code signature for ${gatewayUrl}`);
    return proxy.getValidatedSignature().andThen((validatedSignature) => {
      const value = {
        authorizedGatewayUrl: gatewayUrl,
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
        context.onAuthorizedMerchantUpdated.next(gatewayUrl);

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
          return this.deauthorizeMerchant(gatewayUrl).andThen(() => {
            // And then propagate the error
            this.logUtils.error(e);
            return errAsync(
              new MerchantAuthorizationDeniedError(
                `User declined authorization of the validator`,
                e,
              ),
            );
          });
        });

        return ResultUtils.combine([
          signerResult,
          this.getAuthorizedGateways(),
        ])
          .map((vals) => {
            const [newAuthorizationSignature, authorizedGateways] = vals;

            authorizedGateways.set(
              gatewayUrl,
              Signature(newAuthorizationSignature),
            );

            return this._setAuthorizedGateways(authorizedGateways);
          })
          .map(() => {});
      }

      this.logUtils.debug(`Code signature validated for ${gatewayUrl}`);
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
    this.logUtils.debug(`Activating connector for ${proxy.gatewayUrl}`);
    return proxy
      .activateConnector(context.publicIdentifier, balances)
      .map(() => {
        this.logUtils.debug(`Connector activated for ${proxy.gatewayUrl}`);
        return proxy;
      });
  }

  protected _setAuthorizedGateways(
    authorizedGatewayMap: Map<GatewayUrl, Signature>,
  ): ResultAsync<void, PersistenceError> {
    const authorizedGatewayEntries = new Array<IAuthorizedMerchantEntry>();

    for (const keyval of authorizedGatewayMap) {
      authorizedGatewayEntries.push({
        gatewayUrl: GatewayUrl(keyval[0]),
        authorizationSignature: Signature(keyval[1]),
      });
    }

    return this.storageUtils.write<IAuthorizedMerchantEntry[]>(
      AuthorizedGatewaysSchema.title,
      authorizedGatewayEntries,
    );
  }
}
