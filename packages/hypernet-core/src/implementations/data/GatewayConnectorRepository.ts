import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  PullPayment,
  PushPayment,
  ProxyError,
  BlockchainUnavailableError,
  EthereumAddress,
  Signature,
  GatewayUrl,
  Balances,
  AuthorizedGatewaysSchema,
  GatewayConnectorError,
  GatewayValidationError,
  GatewayActivationError,
  GatewayAuthorizationDeniedError,
  PersistenceError,
  GatewayRegistrationInfo,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  IAjaxUtils,
  ILogUtils,
  IAjaxUtilsType,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import {
  IGatewayConnectorRepository,
  IAuthorizedGatewayEntry,
} from "@interfaces/data";
import { InitializedHypernetContext } from "@interfaces/objects";
import { ethers } from "ethers";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { urlJoinP } from "url-join-ts";

import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IBlockchainUtils,
  IBlockchainUtilsType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IGatewayConnectorProxy,
  IVectorUtils,
  IVectorUtilsType,
} from "@interfaces/utilities";
import {
  IGatewayConnectorProxyFactory,
  IGatewayConnectorProxyFactoryType,
} from "@interfaces/utilities/factory";

@injectable()
export class GatewayConnectorRepository implements IGatewayConnectorRepository {
  protected authorizedGatewayProxies: Map<
    GatewayUrl,
    ResultAsync<
      IGatewayConnectorProxy,
      | GatewayActivationError
      | GatewayValidationError
      | GatewayAuthorizationDeniedError
      | ProxyError
    >
  >;
  protected existingProxies: Map<GatewayUrl, IGatewayConnectorProxy>;
  protected domain: TypedDataDomain;
  protected types: Record<string, TypedDataField[]>;
  protected activateAuthorizedGatewaysResult:
    | ResultAsync<void, never>
    | undefined;
  protected balances: Balances | undefined;
  protected gatewayRegistrationInfoMap: Map<
    GatewayUrl,
    GatewayRegistrationInfo
  >;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IAjaxUtilsType) protected ajaxUtils: IAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IVectorUtilsType) protected vectorUtils: IVectorUtils,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IGatewayConnectorProxyFactoryType)
    protected gatewayConnectorProxyFactory: IGatewayConnectorProxyFactory,
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.authorizedGatewayProxies = new Map();
    this.existingProxies = new Map();
    this.gatewayRegistrationInfoMap = new Map();
    this.domain = {
      name: "Hypernet Protocol",
      version: "1",
    };
    this.types = {
      AuthorizedGateway: [
        { name: "authorizedGatewayUrl", type: "string" },
        { name: "gatewayValidatedSignature", type: "string" },
      ],
    };
  }

  public getGatewayRegistrationInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    BlockchainUnavailableError
  > {
    const returnInfo = new Map<GatewayUrl, GatewayRegistrationInfo>();
    const newGatewayResults = new Array<
      ResultAsync<void, BlockchainUnavailableError>
    >();

    // Check for entries that are already cached.
    for (const gatewayUrl of gatewayUrls) {
      const cachedRegistration =
        this.gatewayRegistrationInfoMap.get(gatewayUrl);
      if (cachedRegistration != null) {
        returnInfo.set(gatewayUrl, cachedRegistration);
      } else {
        // We need to get the registration info that's not in the cache
        newGatewayResults.push(
          this.blockchainUtils
            .getGatewayRegistrationInfo(gatewayUrl)
            .map((registrationInfo) => {
              returnInfo.set(gatewayUrl, registrationInfo);
              this.gatewayRegistrationInfoMap.set(gatewayUrl, registrationInfo);
            }),
        );
      }
    }

    // Wait for all the new results, and return the final list
    return ResultUtils.combine(newGatewayResults).map(() => {
      return returnInfo;
    });
  }

  public addAuthorizedGateway(
    gatewayRegistrationInfo: GatewayRegistrationInfo,
    initialBalances: Balances,
  ): ResultAsync<
    void,
    | PersistenceError
    | GatewayValidationError
    | ProxyError
    | BlockchainUnavailableError
    | GatewayConnectorError
    | GatewayActivationError
  > {
    let proxy: IGatewayConnectorProxy;
    let context: InitializedHypernetContext;

    // First, we will create the proxy
    return this.contextProvider
      .getInitializedContext()
      .andThen((myContext) => {
        context = myContext;
        return this.gatewayConnectorProxyFactory.factoryProxy(
          gatewayRegistrationInfo,
        );
      })
      .andThen((myProxy) => {
        proxy = myProxy;
        this.existingProxies.set(gatewayRegistrationInfo.url, proxy);

        // With the proxy activated, we can get the validated gateway signature
        return ResultUtils.combine([
          proxy.getValidatedSignature(),
          this.blockchainProvider.getSigner(),
        ]);
      })
      .andThen((vals) => {
        const [gatewaySignature, signer] = vals;

        // gatewaySignature has been validated by the iframe, so this is already confirmed.
        // Now we need to get an authorization signature
        const value = {
          authorizedGatewayUrl: gatewayRegistrationInfo.url,
          gatewayValidatedSignature: gatewaySignature,
        } as Record<string, unknown>;
        const signerPromise = signer._signTypedData(
          this.domain,
          this.types,
          value,
        );

        return ResultUtils.combine([
          ResultAsync.fromPromise<string, GatewayValidationError>(
            signerPromise,
            (e) => e as GatewayValidationError,
          ),
          this.getAuthorizedGateways(),
        ]);
      })
      .andThen((vals) => {
        // The connector has been authorized, store it as an authorized connector
        const [authorizationSignature, authorizedGateways] = vals;

        authorizedGateways.set(
          gatewayRegistrationInfo.url,
          Signature(authorizationSignature),
        );

        return this._setAuthorizedGateways(authorizedGateways);
      })
      .andThen(() => {
        // Notify the world that the gateway connector exists
        // Notably, API listeners could start
        if (context != null) {
          context.onGatewayConnectorProxyActivated.next(proxy);
        }

        // Activate the gateway connector
        return proxy.activateConnector(
          context.publicIdentifier,
          initialBalances,
        );
      })
      .map(() => {
        // Only if the gateway is successfully activated do we stick it in the list.
        this.authorizedGatewayProxies.set(
          gatewayRegistrationInfo.url,
          okAsync(proxy),
        );
      })
      .mapErr((e) => {
        // If we encounter a problem, destroy the proxy so we can start afresh.
        this.destroyProxy(gatewayRegistrationInfo.url);

        // Notify the world
        if (context != null) {
          context.onAuthorizedGatewayActivationFailed.next(
            gatewayRegistrationInfo.url,
          );
        }

        return new GatewayActivationError(
          `Unable to activate gateway ${gatewayRegistrationInfo.url}`,
          e,
        );
      });
  }

  /**
   * Returns a map of gateway URLs with their authorization signatures.
   */
  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  > {
    return this.storageUtils
      .read<IAuthorizedGatewayEntry[]>(AuthorizedGatewaysSchema.title)
      .map((storedAuthorizedGateways) => {
        const authorizedGateways = new Map<GatewayUrl, Signature>();

        if (storedAuthorizedGateways != null) {
          for (const authorizedGatewayEntry of storedAuthorizedGateways) {
            authorizedGateways.set(
              GatewayUrl(authorizedGatewayEntry.gatewayUrl),
              Signature(authorizedGatewayEntry.authorizationSignature),
            );
          }
        }

        return authorizedGateways;
      });
  }

  public closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.closeGatewayIFrame();
    });
  }

  public displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.displayGatewayIFrame();
    });
  }

  /**
   * This function will attempt to activate all of your authorized gateways. It should only error
   * in the case that the whole startup process should be aborted- something is fatally fucked up.
   * This means that even otherwise fatal errors such as like the blockchain being unavailable will
   * not stop it; the net effect is that you have no activated gateways. Authorized, yes, activated no.
   * There are lots of things you can do with an inactive gateway connector.
   */
  public activateAuthorizedGateways(
    balances: Balances,
  ): ResultAsync<void, never> {
    this.balances = balances;

    if (this.activateAuthorizedGatewaysResult != null) {
      return this.activateAuthorizedGatewaysResult;
    }

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

        const gatewayUrls = new Array<GatewayUrl>();
        for (const [gatewayUrl] of authorizedGateways) {
          gatewayUrls.push(gatewayUrl);
        }

        // Get the registration info
        return this.getGatewayRegistrationInfo(gatewayUrls)
          .andThen((registrationInfoMap) => {
            for (const [
              gatewayUrl,
              authorizationSignature,
            ] of authorizedGateways) {
              const registrationInfo = registrationInfoMap.get(gatewayUrl);

              // If the registration info is not available, skip it
              if (registrationInfo == null) {
                continue;
              }

              activationResults.push(() => {
                return this._activateAuthorizedGateway(
                  balances,
                  registrationInfo,
                  authorizationSignature,
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
                      `Could not activate authorized gateway ${gatewayUrl}`,
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
          .map(() => {});
      })
      .orElse((e) => {
        this.logUtils.error(
          "Could not get prerequisites for activateAuthorizedGateways",
        );
        this.logUtils.error(e);
        return okAsync<void, never>(undefined);
      });
    return this.activateAuthorizedGatewaysResult;
  }

  public notifyPushPaymentSent(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentSent(payment);
    });
  }

  public notifyPushPaymentUpdated(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentUpdated(payment);
    });
  }

  public notifyPushPaymentReceived(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentReceived(payment);
    });
  }

  public notifyPushPaymentDelayed(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentDelayed(payment);
    });
  }

  public notifyPushPaymentCanceled(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPushPaymentCanceled(payment);
    });
  }

  public notifyPullPaymentSent(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentSent(payment);
    });
  }

  public notifyPullPaymentUpdated(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentUpdated(payment);
    });
  }

  public notifyPullPaymentReceived(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentReceived(payment);
    });
  }

  public notifyPullPaymentDelayed(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentDelayed(payment);
    });
  }

  public notifyPullPaymentCanceled(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<
    void,
    GatewayAuthorizationDeniedError | ProxyError | GatewayConnectorError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.notifyPullPaymentCanceled(payment);
    });
  }

  public notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<
    void,
    | GatewayAuthorizationDeniedError
    | ProxyError
    | GatewayConnectorError
    | PersistenceError
  > {
    const results = new Array<ResultAsync<void, GatewayConnectorError>>();
    return this.getAuthorizedGateways().andThen((authorizedGateways) => {
      for (const [gatewayUrl] of authorizedGateways) {
        results.push(
          this._getActivatedGatewayProxy(gatewayUrl).map((proxy) => {
            proxy.notifyBalancesReceived(balances);
          }),
        );
      }
      return ResultUtils.combine(results).map(() => {});
    });
  }

  public deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl)
      .andThen((proxy) => {
        return proxy.deauthorize();
      })
      .andThen(() => {
        return this.getAuthorizedGateways();
      })
      .andThen((authorizedGateways) => {
        authorizedGateways.delete(gatewayUrl);

        return this._setAuthorizedGateways(authorizedGateways);
      })
      .map(() => {
        // Remove the proxy
        return this.destroyProxy(gatewayUrl);
      })
      .orElse(() => {
        this.destroyProxy(gatewayUrl);
        return okAsync(undefined);
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

    return this.activateAuthorizedGatewaysResult
      .andThen(() => {
        return this.getAuthorizedGateways();
      })
      .andThen((authorizedGateways) => {
        // Go through the results for the gateway
        const proxyResults = new Array<ResultAsync<void, never>>();
        for (const [gatewayUrl, _signature] of authorizedGateways) {
          const proxyResult = this.authorizedGatewayProxies.get(gatewayUrl);

          if (proxyResult == null) {
            // Gateway is not currently activated
            retMap.set(gatewayUrl, false);
            continue;
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

  protected _getGatewayAddress(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    { gatewayUrl: GatewayUrl; address: EthereumAddress },
    GatewayConnectorError | ProxyError | GatewayAuthorizationDeniedError
  > {
    const url = new URL(urlJoinP(gatewayUrl, ["address"]));
    return this.ajaxUtils.get<EthereumAddress>(url).map((address) => {
      return { gatewayUrl, address };
    });
  }

  protected _getActivatedGatewayProxy(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    IGatewayConnectorProxy,
    ProxyError | GatewayAuthorizationDeniedError | PersistenceError
  > {
    // The goal of this method is to return an activated gateway proxy,
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
        // If the gateway is not authorized, that's a fatal error.
        // Now, you may ask yourself, what about addAuthorizedGateway?
        // Well, you can't call this method until that one is complete.
        // If the gateway was already authorized, you can call this
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
            `There is not result for gateway ${gatewayUrl}, even though it is authorized. Something strange going on.`,
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
        if (e instanceof GatewayAuthorizationDeniedError) {
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
              this.getGatewayRegistrationInfo([gatewayUrl]),
            ]).andThen((vals) => {
              const [context, signer, registrationInfoMap] = vals;

              const gatewayRegistrationInfo =
                registrationInfoMap.get(gatewayUrl);

              if (
                this.balances == null ||
                cachedAuthorizationSignature == null ||
                gatewayRegistrationInfo == null
              ) {
                throw new Error("No cached balances");
              }
              return this._activateAuthorizedGateway(
                this.balances,
                gatewayRegistrationInfo,
                cachedAuthorizationSignature,
                context,
                signer,
              );
            });
            this.authorizedGatewayProxies.set(gatewayUrl, activationResult);
            return activationResult;
          }, [ProxyError, GatewayValidationError, GatewayActivationError]);
        }

        // Backoff
        return errAsync(e);
      });
  }

  /**
   * This function does all the work of trying to activate a gateway connector. It can be called multiple times.
   * @param accountAddress
   * @param balances
   * @param gatewayUrl
   * @param authorizationSignature
   * @param context
   * @param signer
   * @returns
   */
  protected _activateAuthorizedGateway(
    balances: Balances,
    gatewayRegistrationInfo: GatewayRegistrationInfo,
    authorizationSignature: Signature,
    context: InitializedHypernetContext,
    signer: ethers.providers.JsonRpcSigner,
  ): ResultAsync<
    IGatewayConnectorProxy,
    | GatewayActivationError
    | GatewayValidationError
    | GatewayAuthorizationDeniedError
    | ProxyError
  > {
    // Do some initial cleanup, so that this can be called repeatedly.
    const existingProxyResult = this.authorizedGatewayProxies.get(
      gatewayRegistrationInfo.url,
    );

    if (existingProxyResult != null) {
      return existingProxyResult;
    }

    let proxy: IGatewayConnectorProxy;

    this.logUtils.debug(
      `Activating gateway connector ${gatewayRegistrationInfo.url}`,
    );
    const proxyResult = this.gatewayConnectorProxyFactory
      .factoryProxy(gatewayRegistrationInfo)
      .andThen((myProxy) => {
        this.logUtils.debug(`Proxy created for ${gatewayRegistrationInfo.url}`);
        proxy = myProxy;
        this.existingProxies.set(gatewayRegistrationInfo.url, proxy);

        // We need to get the validated signature, so we can see if it was authorized
        return this._validateConnector(
          gatewayRegistrationInfo.url,
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
        // TODO: make sure of the implementation here, this will trigger an event and a subscribe event in GatewayConnectorListener
        // will call advanceGatewayUnresolvedPayments.
        context.onGatewayConnectorProxyActivated.next(proxy);
        return proxy;
      })
      .mapErr((e) => {
        // Notify the world
        context.onAuthorizedGatewayActivationFailed.next(
          gatewayRegistrationInfo.url,
        );

        this.logUtils.error(
          `Gateway connector ${gatewayRegistrationInfo.url} failed to activate`,
        );

        // TODO: make sure of error cases where we want to destroy the proxy or not
        if (e instanceof ProxyError || e instanceof GatewayActivationError) {
          this.destroyProxy(gatewayRegistrationInfo.url);
        }

        return e;
      });

    this.authorizedGatewayProxies.set(gatewayRegistrationInfo.url, proxyResult);

    return proxyResult;
  }

  protected _validateConnector(
    gatewayUrl: GatewayUrl,
    proxy: IGatewayConnectorProxy,
    authorizationSignature: Signature,
    context: InitializedHypernetContext,
    signer: ethers.providers.JsonRpcSigner,
  ): ResultAsync<
    void,
    | GatewayAuthorizationDeniedError
    | GatewayValidationError
    | ProxyError
    | PersistenceError
  > {
    this.logUtils.debug(`Validating code signature for ${gatewayUrl}`);
    return proxy.getValidatedSignature().andThen((validatedSignature) => {
      const value = {
        authorizedGatewayUrl: gatewayUrl,
        gatewayValidatedSignature: validatedSignature,
      } as Record<string, unknown>;

      const validationAddress = this.blockchainUtils.verifyTypedData(
        this.domain,
        this.types,
        value,
        authorizationSignature,
      );

      if (validationAddress !== context.account) {
        // Notify the user that one of their authorized gateways has changed their code
        context.onAuthorizedGatewayUpdated.next(gatewayUrl);

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
          // We need to de-authorize this gateway
          return this.deauthorizeGateway(gatewayUrl).andThen(() => {
            // And then propagate the error
            this.logUtils.error(e);
            return errAsync(
              new GatewayAuthorizationDeniedError(
                `User declined authorization of the gateway`,
                e,
              ),
            );
          });
        });

        return ResultUtils.combine([signerResult, this.getAuthorizedGateways()])
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
      return okAsync<void, GatewayAuthorizationDeniedError>(undefined);
    });
  }

  protected _activateConnector(
    context: InitializedHypernetContext,
    proxy: IGatewayConnectorProxy,
    balances: Balances,
  ): ResultAsync<IGatewayConnectorProxy, GatewayActivationError | ProxyError> {
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
    const authorizedGatewayEntries = new Array<IAuthorizedGatewayEntry>();

    for (const keyval of authorizedGatewayMap) {
      authorizedGatewayEntries.push({
        gatewayUrl: GatewayUrl(keyval[0]),
        authorizationSignature: Signature(keyval[1]),
      });
    }

    return this.storageUtils.write<IAuthorizedGatewayEntry[]>(
      AuthorizedGatewaysSchema.title,
      authorizedGatewayEntries,
    );
  }
}
