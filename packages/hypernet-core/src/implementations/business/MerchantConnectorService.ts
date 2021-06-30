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

import { IMerchantConnectorService } from "@interfaces/business";
import {
  IAccountsRepository,
  IMerchantConnectorRepository,
} from "@interfaces/data";
import { IContextProvider, IConfigProvider } from "@interfaces/utilities";

export class MerchantConnectorService implements IMerchantConnectorService {
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
      // Subscribe to the various events, and sort them out for the merchant connector
      context.onPushPaymentSent.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPushPaymentSent(payment.merchantUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentUpdated.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPushPaymentUpdated(payment.merchantUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPushPaymentReceived.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPushPaymentReceived(payment.merchantUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentSent.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPullPaymentSent(payment.merchantUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentUpdated.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPullPaymentUpdated(payment.merchantUrl, payment)
          .mapErr((e) => {
            this.logUtils.debug(e);
          });
      });

      context.onPullPaymentReceived.subscribe((payment) => {
        this.merchantConnectorRepository
          .notifyPullPaymentReceived(payment.merchantUrl, payment)
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
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantValidationError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAuthorizedGateways(),
      this.accountsRepository.getBalances(),
    ]).map(async (vals) => {
      const [context, authorizedGatewaysMap, balances] = vals;

      // Remove the merchant iframe proxy related to that merchantUrl if there is any activated ones.
      if (authorizedGatewaysMap.get(merchantUrl)) {
        this.merchantConnectorRepository.deauthorizeMerchant(merchantUrl);
      }

      this.merchantConnectorRepository
        .addAuthorizedMerchant(merchantUrl, balances)
        .map(() => {
          context.onMerchantAuthorized.next(merchantUrl);
        });
    });
  }

  public deauthorizeMerchant(
    merchantUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      context.onMerchantDeauthorizationStarted.next(merchantUrl);

      return ResultUtils.race([
        this._getDeauthorizationTimeoutResult(merchantUrl),
        this.merchantConnectorRepository.deauthorizeMerchant(merchantUrl),
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
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.closeMerchantIFrame(merchantUrl);
  }

  public displayMerchantIFrame(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.displayMerchantIFrame(merchantUrl);
  }

  /* Destroy merchant connector if deauthorizeMerchant lasted more than merchantDeauthorizationTimeout */
  private _getDeauthorizationTimeoutResult(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, Error> {
    return this.configProvider.getConfig().andThen((config) => {
      const deauthorizationTimeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          this.merchantConnectorRepository.destroyProxy(merchantUrl);
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
