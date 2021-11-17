import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  GatewayConnectorError,
  GatewayValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  GatewayAuthorizationDeniedError,
  GatewayUrl,
  Signature,
  ChainId,
  PublicIdentifier,
  RouterUnauthorizedError,
  GatewayTokenInfo,
  ActiveStateChannel,
  GatewayRegistrationInfo,
  GatewayRegistrationFilter,
  Balances,
  GatewayActivationError,
  BalancesUnavailableError,
  InvalidParametersError,
  VectorError,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IGatewayConnectorService } from "@interfaces/business";
import {
  IAccountsRepository,
  IAccountsRepositoryType,
  IGatewayConnectorRepository,
  IGatewayConnectorRepositoryType,
  IGatewayRegistrationRepository,
  IGatewayRegistrationRepositoryType,
  IRouterRepository,
  IRouterRepositoryType,
} from "@interfaces/data";
import {
  HypernetContext,
  InitializedHypernetContext,
} from "@interfaces/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IContextProvider,
  IConfigProvider,
  IConfigProviderType,
  IContextProviderType,
  IGatewayConnectorProxy,
  IBlockchainUtilsType,
  IBlockchainUtils,
  IBlockchainProviderType,
  IBlockchainProvider,
} from "@interfaces/utilities";

@injectable()
export class GatewayConnectorService implements IGatewayConnectorService {
  protected activateAuthorizedGatewaysResult:
    | ResultAsync<void, never>
    | undefined;
  protected authorizedGatewayProxies: Map<
    GatewayUrl,
    ResultAsync<
      IGatewayConnectorProxy,
      | GatewayActivationError
      | GatewayValidationError
      | GatewayAuthorizationDeniedError
      | ProxyError
      | BalancesUnavailableError
      | BlockchainUnavailableError
      | VectorError
      | PersistenceError
    >
  >;
  protected domain: TypedDataDomain;
  protected types: Record<string, TypedDataField[]>;
  protected authorizationsInProgress = new Map<
    GatewayUrl,
    ResultAsync<
      void,
      | PersistenceError
      | BalancesUnavailableError
      | BlockchainUnavailableError
      | GatewayAuthorizationDeniedError
      | GatewayActivationError
      | VectorError
    >
  >();

  constructor(
    @inject(IGatewayConnectorRepositoryType)
    protected gatewayConnectorRepository: IGatewayConnectorRepository,
    @inject(IGatewayRegistrationRepositoryType)
    protected gatewayRegistrationRepository: IGatewayRegistrationRepository,
    @inject(IAccountsRepositoryType)
    protected accountsRepository: IAccountsRepository,
    @inject(IRouterRepositoryType)
    protected routerRepository: IRouterRepository,
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.authorizedGatewayProxies = new Map();

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

  public initialize(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      // Subscribe to the various events, and sort them out for the gateway connector
      context.onPushPaymentSent.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPushPaymentSent(payment);
        });
      });

      context.onPushPaymentUpdated.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPushPaymentUpdated(payment);
        });
      });

      context.onPushPaymentReceived.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPushPaymentReceived(payment);
        });
      });

      context.onPushPaymentDelayed.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPushPaymentDelayed(payment);
        });
      });

      context.onPushPaymentCanceled.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPushPaymentCanceled(payment);
        });
      });

      context.onPullPaymentSent.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPullPaymentSent(payment);
        });
      });

      context.onPullPaymentUpdated.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPullPaymentUpdated(payment);
        });
      });

      context.onPullPaymentReceived.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPullPaymentReceived(payment);
        });
      });

      context.onPullPaymentDelayed.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPullPaymentDelayed(payment);
        });
      });

      context.onPullPaymentCanceled.subscribe((payment) => {
        this._getActivatedGatewayProxy(payment.gatewayUrl).andThen((proxy) => {
          return proxy.notifyPullPaymentCanceled(payment);
        });
      });

      context.onBalancesChanged.subscribe((balances) => {
        const results = new Array<
          ResultAsync<
            void,
            | GatewayConnectorError
            | ProxyError
            | PersistenceError
            | GatewayAuthorizationDeniedError
            | BalancesUnavailableError
            | BlockchainUnavailableError
            | GatewayActivationError
            | VectorError
            | GatewayValidationError
          >
        >();
        return this.gatewayConnectorRepository
          .getAuthorizedGateways()
          .andThen((authorizedGateways) => {
            for (const [gatewayUrl] of authorizedGateways) {
              results.push(
                this._getActivatedGatewayProxy(gatewayUrl).map((proxy) => {
                  proxy.notifyBalancesReceived(balances);
                }),
              );
            }
            return ResultUtils.combine(results).map(() => {});
          });
      });
    });
  }

  public authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | PersistenceError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayAuthorizationDeniedError
    | GatewayActivationError
    | VectorError
  > {
    const inProgress = this.authorizationsInProgress.get(gatewayUrl);

    if (inProgress != null) {
      return inProgress;
    }

    const authorizationProcess = ResultUtils.combine([
      this.contextProvider.getInitializedContext(),
      this.gatewayConnectorRepository.getAuthorizedGateways(),
      this.accountsRepository.getBalances(),
    ])
      .andThen((vals) => {
        const [context, authorizedGatewaysMap, balances] = vals;

        const existingAuthorizedProxy = authorizedGatewaysMap.get(gatewayUrl);
        if (existingAuthorizedProxy != null) {
          return okAsync<
            void,
            | PersistenceError
            | BalancesUnavailableError
            | BlockchainUnavailableError
            | GatewayAuthorizationDeniedError
            | GatewayActivationError
            | VectorError
          >(undefined);
        }

        return this.gatewayRegistrationRepository
          .getGatewayRegistrationInfo([gatewayUrl])
          .andThen((gatewayRegistrationInfoMap) => {
            const gatewayRegistrationInfo =
              gatewayRegistrationInfoMap.get(gatewayUrl);
            if (gatewayRegistrationInfo == null) {
              throw new Error(
                "Gateway registration info not available but no error!",
              );
            }

            return this.gatewayConnectorRepository
              .createGatewayProxy(gatewayRegistrationInfo)
              .andThen((proxy) => {
                // With the proxy activated, we can get the validated gateway signature
                return ResultUtils.combine([
                  proxy.getValidatedSignature(),
                  this.blockchainProvider.getSigner(),
                ])
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

                    return ResultAsync.fromPromise<
                      string,
                      | GatewayValidationError
                      | ProxyError
                      | GatewayAuthorizationDeniedError
                      | BalancesUnavailableError
                    >(
                      signerPromise,
                      (e) =>
                        new GatewayAuthorizationDeniedError(
                          "User did not sign the validated connector",
                          e,
                        ),
                    );
                  })
                  .andThen((authorizationSignature) => {
                    // The connector has been authorized, store it as an authorized connector
                    return this.gatewayConnectorRepository.addAuthorizedGateway(
                      gatewayUrl,
                      Signature(authorizationSignature),
                    );
                  })
                  .andThen(() => {
                    // Activate the gateway connector
                    return this._activateConnector(context, proxy, balances);
                  })
                  .map(() => {
                    // Only if the gateway is successfully activated do we stick it in the list.
                    this.authorizedGatewayProxies.set(
                      gatewayRegistrationInfo.url,
                      okAsync(proxy),
                    );

                    context.onGatewayAuthorized.next(gatewayUrl);

                    // No matter what happens, we need to remove the ongoing auth
                    this.authorizationsInProgress.delete(gatewayUrl);
                  });
              })
              .mapErr((e) => {
                // If we encounter a problem, destroy the proxy so we can start afresh.
                this.gatewayConnectorRepository.destroyProxy(
                  gatewayRegistrationInfo.url,
                );

                // Notify the world
                context.onAuthorizedGatewayActivationFailed.next(
                  gatewayRegistrationInfo.url,
                );

                return new GatewayActivationError(
                  `Unable to activate gateway ${gatewayRegistrationInfo.url}`,
                  e,
                );
              });
          });
      })
      .mapErr((e) => {
        // No matter what happens, we need to remove the ongoing auth
        this.authorizationsInProgress.delete(gatewayUrl);
        return e;
      });

    this.authorizationsInProgress.set(gatewayUrl, authorizationProcess);

    return authorizationProcess;
  }

  public ensureStateChannel(
    gatewayUrl: GatewayUrl,
    chainId: ChainId,
    routerPublicIdentifiers: PublicIdentifier[],
  ): ResultAsync<
    ActiveStateChannel,
    | PersistenceError
    | RouterUnauthorizedError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
  > {
    if (routerPublicIdentifiers.length < 1) {
      return errAsync(
        new InvalidParametersError("No routers provided to ensureStateChannel"),
      );
    }

    return this.contextProvider.getInitializedContext().andThen((context) => {
      // Check if we have an existing state channel that matches these parameters.
      const existingStateChannel = context.activeStateChannels.find((asc) => {
        return (
          asc.chainId == chainId &&
          routerPublicIdentifiers.includes(asc.routerPublicIdentifier)
        );
      });

      if (existingStateChannel == null) {
        // No existing channel; we need to create it.
        // Choose one of the routers at random.
        const routerPublicIdentifier =
          routerPublicIdentifiers[
            Math.floor(Math.random() * routerPublicIdentifiers.length)
          ];

        return this.assureGatewayAuthorizedByRouter(
          gatewayUrl,
          routerPublicIdentifier,
        ).andThen(() => {
          // We need to create a state channel
          return this.accountsRepository
            .createStateChannel(routerPublicIdentifier, chainId)
            .andThen((channelAddress) => {
              return this.accountsRepository
                .addActiveRouter(routerPublicIdentifier)
                .andThen(() => {
                  // We need to add the new state channel to the context
                  context.activeStateChannels.push(
                    new ActiveStateChannel(
                      chainId,
                      routerPublicIdentifier,
                      channelAddress,
                    ),
                  );

                  return this.contextProvider.setContext(context);
                })
                .map(() => {
                  context.onStateChannelCreated.next(
                    new ActiveStateChannel(
                      chainId,
                      routerPublicIdentifier,
                      channelAddress,
                    ),
                  );
                  return new ActiveStateChannel(
                    chainId,
                    routerPublicIdentifier,
                    channelAddress,
                  );
                });
            });
        });
      } else {
        // We need to verify that the router allows the gateway.
        return this.assureGatewayAuthorizedByRouter(
          gatewayUrl,
          existingStateChannel.routerPublicIdentifier,
        ).map(() => {
          return existingStateChannel;
        });
      }
    });
  }

  public getGatewayTokenInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayTokenInfo[]>,
    | ProxyError
    | PersistenceError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayActivationError
    | VectorError
    | GatewayValidationError
  > {
    const retMap = new Map<GatewayUrl, GatewayTokenInfo[]>();
    return ResultUtils.combine(
      gatewayUrls.map((gatewayUrl) => {
        return this._getActivatedGatewayProxy(gatewayUrl)
          .andThen((proxy) => {
            return proxy.getGatewayTokenInfo();
          })
          .map((gatewayTokenInfo) => {
            retMap.set(gatewayUrl, gatewayTokenInfo);
          });
      }),
    ).map(() => {
      return retMap;
    });
  }

  public getGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError> {
    return this.gatewayRegistrationRepository.getFilteredGatewayRegistrationInfo(
      filter,
    );
  }

  public deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | PersistenceError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayActivationError
    | VectorError
    | GatewayValidationError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this._getActivatedGatewayProxy(gatewayUrl),
    ]).andThen((vals) => {
      const [context, proxy] = vals;
      return this._deauthorizeGateway(gatewayUrl, context, proxy);
    });
  }

  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.gatewayConnectorRepository.getAuthorizedGateways();
  }

  public getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.activateAuthorizedGatewaysResult == null) {
      throw new Error("You must call activateAuthorizedGateways first!");
    }

    return this.activateAuthorizedGatewaysResult.andThen(() => {
      const retMap = new Map<GatewayUrl, boolean>();
      return this.getAuthorizedGateways()
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
                .map((proxy) => {
                  retMap.set(gatewayUrl, proxy.getConnectorActivationStatus());
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
    });
  }

  /**
   * This function will attempt to activate all of your authorized gateways. It should only error
   * in the case that the whole startup process should be aborted- something is fatally fucked up.
   * This means that even otherwise fatal errors such as like the blockchain being unavailable will
   * not stop it; the net effect is that you have no activated gateways. Authorized, yes, activated no.
   * There are lots of things you can do with an inactive gateway connector.
   */
  public activateAuthorizedGateways(): ResultAsync<
    void,
    | GatewayConnectorError
    | GatewayValidationError
    | BlockchainUnavailableError
    | ProxyError
  > {
    if (this.activateAuthorizedGatewaysResult != null) {
      return this.activateAuthorizedGatewaysResult;
    }

    this.activateAuthorizedGatewaysResult = ResultUtils.combine([
      this.accountsRepository.getBalances(),
      this.contextProvider.getInitializedContext(),
      this.gatewayConnectorRepository.getAuthorizedGateways().orElse((e) => {
        return okAsync(new Map());
      }),
      this.blockchainProvider.getSigner(),
    ])
      .andThen((vals) => {
        const [balances, context, authorizedGateways, signer] = vals;

        const gatewayUrls = new Array<GatewayUrl>();
        for (const [gatewayUrl] of authorizedGateways) {
          gatewayUrls.push(gatewayUrl);
        }

        // Get the registration info
        return this.gatewayRegistrationRepository
          .getGatewayRegistrationInfo(gatewayUrls)
          .andThen((registrationInfoMap) => {
            const activationResults = new Array<
              () => ResultAsync<void, never>
            >();

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

  public closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | GatewayConnectorError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | GatewayActivationError
    | GatewayValidationError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.closeGatewayIFrame();
    });
  }

  public displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | GatewayConnectorError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | GatewayActivationError
    | GatewayValidationError
  > {
    return this._getActivatedGatewayProxy(gatewayUrl).andThen((proxy) => {
      return proxy.displayGatewayIFrame();
    });
  }

  protected _getActivatedGatewayProxy(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    IGatewayConnectorProxy,
    | ProxyError
    | GatewayAuthorizationDeniedError
    | PersistenceError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayActivationError
    | VectorError
    | GatewayValidationError
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
            this.gatewayConnectorRepository.destroyProxy(gatewayUrl);
            const activationResult = ResultUtils.combine([
              this.contextProvider.getInitializedContext(),
              this.blockchainProvider.getSigner(),
              this.gatewayRegistrationRepository.getGatewayRegistrationInfo([
                gatewayUrl,
              ]),
              this.accountsRepository.getBalances(),
            ]).andThen((vals) => {
              const [context, signer, registrationInfoMap, balances] = vals;

              const gatewayRegistrationInfo =
                registrationInfoMap.get(gatewayUrl);

              if (
                cachedAuthorizationSignature == null ||
                gatewayRegistrationInfo == null
              ) {
                throw new Error("No cached balances");
              }
              return this._activateAuthorizedGateway(
                balances,
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
        return errAsync<
          IGatewayConnectorProxy,
          | ProxyError
          | GatewayAuthorizationDeniedError
          | PersistenceError
          | BalancesUnavailableError
          | BlockchainUnavailableError
          | GatewayActivationError
          | VectorError
          | GatewayValidationError
        >(e);
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
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | VectorError
    | PersistenceError
  > {
    // Do some initial cleanup, so that this can be called repeatedly.
    const existingProxyResult = this.authorizedGatewayProxies.get(
      gatewayRegistrationInfo.url,
    );

    if (existingProxyResult != null) {
      return existingProxyResult;
    }

    this.logUtils.debug(
      `Activating gateway connector ${gatewayRegistrationInfo.url}`,
    );
    const proxyResult = this.gatewayConnectorRepository
      .createGatewayProxy(gatewayRegistrationInfo)
      .andThen((proxy) => {
        this.logUtils.debug(`Proxy created for ${gatewayRegistrationInfo.url}`);

        // We need to get the validated signature, so we can see if it was authorized
        return this._validateConnector(
          gatewayRegistrationInfo.url,
          proxy,
          authorizationSignature,
          context,
          signer,
        ).andThen(() => {
          return this._activateConnector(context, proxy, balances);
        });
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
          this.gatewayConnectorRepository.destroyProxy(
            gatewayRegistrationInfo.url,
          );
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
    | VectorError
    | BlockchainUnavailableError
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
        return ResultAsync.fromPromise(signerPromise, (e) => {
          return new GatewayAuthorizationDeniedError(
            `User declined authorization of the gateway`,
            e,
          );
        })
          .andThen((authorizationSignature) => {
            return this.gatewayConnectorRepository.addAuthorizedGateway(
              gatewayUrl,
              Signature(authorizationSignature),
            );
          })
          .map(() => {
            this.logUtils.debug(`Code signature validated for ${gatewayUrl}`);
          })
          .orElse((e) => {
            // We only end up here if the user has denied signing
            // to authorize the new connector.
            // We need to de-authorize this gateway
            return this._deauthorizeGateway(gatewayUrl, context, proxy).andThen(
              () => {
                // And then propagate the error
                this.logUtils.error(e);
                return errAsync(e);
              },
            );
          });
      }

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
        // Notify the world that the gateway connector exists
        // Notably, API listeners could start
        context.onGatewayConnectorProxyActivated.next(proxy);

        this.logUtils.debug(`Connector activated for ${proxy.gatewayUrl}`);
        return proxy;
      });
  }

  protected _deauthorizeGateway(
    gatewayUrl: GatewayUrl,
    context: HypernetContext,
    proxy: IGatewayConnectorProxy,
  ): ResultAsync<
    void,
    | PersistenceError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | VectorError
    | BlockchainUnavailableError
  > {
    context.onGatewayDeauthorizationStarted.next(gatewayUrl);
    return proxy
      .deauthorize()
      .andThen(() => {
        return this.gatewayConnectorRepository.deauthorizeGateway(gatewayUrl);
      })
      .map(() => {
        // Remove the proxy
        return this.gatewayConnectorRepository.destroyProxy(gatewayUrl);
      })
      .mapErr((e) => {
        // Even if we get an error, get rid of the connector. We don't want it doing anything
        this.gatewayConnectorRepository.destroyProxy(gatewayUrl);
        return e;
      });
  }

  protected assureGatewayAuthorizedByRouter(
    gatewayUrl: GatewayUrl,
    routerPublicIdentifier: PublicIdentifier,
  ): ResultAsync<
    void,
    | RouterUnauthorizedError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
  > {
    return this.routerRepository
      .getRouterDetails([routerPublicIdentifier])
      .andThen((routerDetailsMap) => {
        const routerDetails = routerDetailsMap.get(routerPublicIdentifier);

        if (routerDetails == null) {
          // Either the router has not published details (odd), or something else extremely odd has happened.
          return errAsync(
            new RouterUnauthorizedError(
              `No details for router ${routerPublicIdentifier} available. Please contact the gateway.`,
              gatewayUrl,
            ),
          );
        }

        // Make sure that this gateway is in the allowed list by the router
        if (routerDetails.allowedGateways.includes(gatewayUrl)) {
          return okAsync(undefined);
        }

        return errAsync(
          new RouterUnauthorizedError(
            `Gateway ${gatewayUrl} requested use of ${routerPublicIdentifier}, but is not on that router's list of allowed gateways. Please contact the gateway.`,
            gatewayUrl,
          ),
        );
      });
  }
}
