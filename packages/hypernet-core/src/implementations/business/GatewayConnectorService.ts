import {
  LogicalError,
  GatewayConnectorError,
  GatewayValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  GatewayAuthorizationDeniedError,
  GatewayUrl,
  Signature,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils } from "@hypernetlabs/utils";
import { IGatewayConnectorService } from "@interfaces/business";
import {
  IAccountsRepository,
  IGatewayConnectorRepository,
} from "@interfaces/data";
import { ResultAsync } from "neverthrow";

import { IContextProvider, IConfigProvider } from "@interfaces/utilities";

export class GatewayConnectorService implements IGatewayConnectorService {
  constructor(
    protected merchantConnectorRepository: IGatewayConnectorRepository,
    protected accountsRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
    protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, LogicalError | GatewayConnectorError> {
    return this.contextProvider.getContext().map((context) => {
      // Subscribe to the various events, and sort them out for the gateway connector
      context.onPushPaymentSent.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPushPaymentSent(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentUpdated.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPushPaymentUpdated(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentReceived.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPushPaymentReceived(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentSent.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPullPaymentSent(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentUpdated.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPullPaymentUpdated(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentReceived.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPullPaymentReceived(payment.gatewayUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onBalancesChanged.subscribe((balances) => {
        this.merchantConnectorRepository
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
    ]).map(async (vals) => {
      const [context, authorizedGatewaysMap, balances] = vals;

      // Remove the gateway iframe proxy related to that gatewayUrl if there is any activated ones.
      if (authorizedGatewaysMap.get(gatewayUrl)) {
        this.merchantConnectorRepository.deauthorizeGateway(gatewayUrl);
      }

      this.merchantConnectorRepository
        .addAuthorizedGateway(gatewayUrl, balances)
        .map(() => {
          context.onGatewayAuthorized.next(gatewayUrl);
        });
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

      return ResultUtils.race([
        this._getDeauthorizationTimeoutResult(gatewayUrl),
        this.merchantConnectorRepository.deauthorizeGateway(gatewayUrl),
      ]);
    });
  }

  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  > {
    return this.merchantConnectorRepository.getAuthorizedGateways();
  }

  public getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
  > {
    return this.merchantConnectorRepository.getAuthorizedGatewaysConnectorsStatus();
  }

  public activateAuthorizedGateways(): ResultAsync<
    void,
    | GatewayConnectorError
    | GatewayValidationError
    | BlockchainUnavailableError
    | LogicalError
    | ProxyError
  > {
    return this.accountsRepository.getBalances().andThen((balances) => {
      return this.merchantConnectorRepository.activateAuthorizedGateways(
        balances,
      );
    });
  }

  public closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError> {
    return this.merchantConnectorRepository.closeGatewayIFrame(gatewayUrl);
  }

  public displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError> {
    return this.merchantConnectorRepository.displayGatewayIFrame(gatewayUrl);
  }

  /* Destroy gateway connector if deauthorizeGateway lasted more than merchantDeauthorizationTimeout */
  private _getDeauthorizationTimeoutResult(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, Error> {
    return this.configProvider.getConfig().andThen((config) => {
      const deauthorizationTimeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          this.merchantConnectorRepository.destroyProxy(gatewayUrl);
          resolve(undefined);
        }, config.merchantDeauthorizationTimeout);
      });
      return ResultAsync.fromPromise(
        deauthorizationTimeoutPromise,
        (e) => e as Error,
      );
    });
  }
}
