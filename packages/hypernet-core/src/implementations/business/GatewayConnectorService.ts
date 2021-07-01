import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  MerchantAuthorizationDeniedError,
  GatewayUrl,
  Signature,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

import { IGatewayConnectorService } from "@interfaces/business";
import {
  IAccountsRepository,
  IMerchantConnectorRepository,
} from "@interfaces/data";
import { IContextProvider, IConfigProvider } from "@interfaces/utilities";

export class GatewayConnectorService implements IGatewayConnectorService {
  constructor(
    protected merchantConnectorRepository: IMerchantConnectorRepository,
    protected accountsRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
    protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<
    void,
    LogicalError | MerchantConnectorError
  > {
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

  public authorizeMerchant(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, MerchantValidationError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAuthorizedGateways(),
      this.accountsRepository.getBalances(),
    ]).map(async (vals) => {
      const [context, authorizedGatewaysMap, balances] = vals;

      // Remove the gateway iframe proxy related to that gatewayUrl if there is any activated ones.
      if (authorizedGatewaysMap.get(gatewayUrl)) {
        this.merchantConnectorRepository.deauthorizeMerchant(gatewayUrl);
      }

      this.merchantConnectorRepository
        .addAuthorizedMerchant(gatewayUrl, balances)
        .map(() => {
          context.onMerchantAuthorized.next(gatewayUrl);
        });
    });
  }

  public deauthorizeMerchant(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      context.onMerchantDeauthorizationStarted.next(gatewayUrl);

      return ResultUtils.race([
        this._getDeauthorizationTimeoutResult(gatewayUrl),
        this.merchantConnectorRepository.deauthorizeMerchant(gatewayUrl),
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
    | MerchantConnectorError
    | MerchantValidationError
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

  public closeMerchantIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.closeMerchantIFrame(gatewayUrl);
  }

  public displayMerchantIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.displayMerchantIFrame(gatewayUrl);
  }

  /* Destroy gateway connector if deauthorizeMerchant lasted more than merchantDeauthorizationTimeout */
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
