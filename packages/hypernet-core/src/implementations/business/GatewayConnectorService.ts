import {
  GatewayConnectorError,
  GatewayValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  GatewayAuthorizationDeniedError,
  GatewayUrl,
  Signature,
  EthereumAddress,
  ChainId,
  PublicIdentifier,
  RouterUnauthorizedError,
  GatewayTokenInfo,
  ActiveStateChannel,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IGatewayConnectorService } from "@interfaces/business";
import {
  IAccountsRepository,
  IAccountsRepositoryType,
  IGatewayConnectorRepository,
  IGatewayConnectorRepositoryType,
  IRouterRepository,
  IRouterRepositoryType,
} from "@interfaces/data";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IContextProvider,
  IConfigProvider,
  IConfigProviderType,
  IContextProviderType,
} from "@interfaces/utilities";

@injectable()
export class GatewayConnectorService implements IGatewayConnectorService {
  constructor(
    @inject(IGatewayConnectorRepositoryType)
    protected gatewayConnectorRepository: IGatewayConnectorRepository,
    @inject(IAccountsRepositoryType)
    protected accountsRepository: IAccountsRepository,
    @inject(IRouterRepositoryType)
    protected routerRepository: IRouterRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, GatewayConnectorError> {
    return this.contextProvider.getContext().map((context) => {
      // Subscribe to the various events, and sort them out for the gateway connector
      context.onPushPaymentSent.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentSent(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentUpdated.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentUpdated(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentReceived.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentReceived(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentDelayed.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentDelayed(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentCanceled.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPushPaymentCanceled(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentSent.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentSent(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentUpdated.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentUpdated(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentReceived.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentReceived(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentDelayed.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentDelayed(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentCanceled.subscribe((payment) => {
        this.gatewayConnectorRepository
          .notifyPullPaymentCanceled(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onBalancesChanged.subscribe((balances) => {
        this.gatewayConnectorRepository
          .notifyBalancesReceived(balances)
          .mapErr((e) => {
            console.log(e);
          });
      });
    });
  }

  public authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayValidationError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAuthorizedGateways(),
      this.accountsRepository.getBalances(),
    ]).andThen((vals) => {
      const [context, authorizedGatewaysMap, balances] = vals;

      let deauthResult: ResultAsync<
        void,
        PersistenceError | ProxyError | GatewayAuthorizationDeniedError
      >;
      // Remove the gateway iframe proxy related to that gatewayUrl if there is any activated ones.
      if (authorizedGatewaysMap.get(gatewayUrl)) {
        deauthResult =
          this.gatewayConnectorRepository.deauthorizeGateway(gatewayUrl);
      } else {
        deauthResult = okAsync(undefined);
      }

      return deauthResult
        .andThen(() => {
          return this.gatewayConnectorRepository.getGatewayRegistrationInfo([
            gatewayUrl,
          ]);
        })
        .andThen((gatewayRegistrationInfoMap) => {
          const gatewayRegistrationInfo =
            gatewayRegistrationInfoMap.get(gatewayUrl);
          if (gatewayRegistrationInfo == null) {
            throw new Error(
              "Gateway registration info not available but no error!",
            );
          }

          return this.gatewayConnectorRepository
            .addAuthorizedGateway(gatewayRegistrationInfo, balances)
            .map(() => {
              context.onGatewayAuthorized.next(gatewayUrl);
            });
        });
    });
  }

  public ensureStateChannel(
    gatewayUrl: GatewayUrl,
    chainId: ChainId,
    routerPublicIdentifiers: PublicIdentifier[],
  ): ResultAsync<EthereumAddress, PersistenceError | RouterUnauthorizedError> {
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
                  return channelAddress;
                });
            });
        });
      } else {
        // We need to verify that the router allows the gateway.
        return this.assureGatewayAuthorizedByRouter(
          gatewayUrl,
          existingStateChannel.routerPublicIdentifier,
        ).map(() => {
          return existingStateChannel.channelAddress;
        });
      }
    });
  }

  public getGatewayTokenInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayTokenInfo[]>,
    ProxyError | PersistenceError | GatewayAuthorizationDeniedError
  > {
    const retMap = new Map<GatewayUrl, GatewayTokenInfo[]>();
    return ResultUtils.combine(
      gatewayUrls.map((gatewayUrl) => {
        return this.gatewayConnectorRepository
          .getGatewayTokenInfo(gatewayUrl)
          .map((gatewayTokenInfo) => {
            retMap.set(gatewayUrl, gatewayTokenInfo);
          });
      }),
    ).map(() => {
      return retMap;
    });
  }

  protected assureGatewayAuthorizedByRouter(
    gatewayUrl: GatewayUrl,
    routerPublicIdentifier: PublicIdentifier,
  ): ResultAsync<void, RouterUnauthorizedError | PersistenceError> {
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

  public deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      context.onGatewayDeauthorizationStarted.next(gatewayUrl);

      return this.gatewayConnectorRepository.deauthorizeGateway(gatewayUrl);
    });
  }

  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  > {
    return this.gatewayConnectorRepository.getAuthorizedGateways();
  }

  public getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
  > {
    return this.gatewayConnectorRepository.getAuthorizedGatewaysConnectorsStatus();
  }

  public activateAuthorizedGateways(): ResultAsync<
    void,
    | GatewayConnectorError
    | GatewayValidationError
    | BlockchainUnavailableError
    | ProxyError
  > {
    return this.accountsRepository.getBalances().andThen((balances) => {
      return this.gatewayConnectorRepository.activateAuthorizedGateways(
        balances,
      );
    });
  }

  public closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError> {
    return this.gatewayConnectorRepository.closeGatewayIFrame(gatewayUrl);
  }

  public displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError> {
    return this.gatewayConnectorRepository.displayGatewayIFrame(gatewayUrl);
  }
}
