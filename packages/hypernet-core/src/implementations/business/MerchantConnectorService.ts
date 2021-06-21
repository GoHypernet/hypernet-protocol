import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  MerchantAuthorizationDeniedError,
} from "@hypernetlabs/objects";
import { MerchantUrl, Signature } from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

import { IMerchantConnectorService } from "@interfaces/business";
import {
  IAccountsRepository,
  IMerchantConnectorRepository,
} from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";

export class MerchantConnectorService implements IMerchantConnectorService {
  protected deauthorizationTimeout: number = 5000;
  constructor(
    protected merchantConnectorRepository: IMerchantConnectorRepository,
    protected accountsRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
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
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantValidationError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAuthorizedMerchants(),
      this.accountsRepository.getBalances(),
    ]).map(async (vals) => {
      const [context, authorizedMerchantsMap, balances] = vals;

      // Remove the merchant iframe proxy related to that merchantUrl if there is any activated ones.
      if (authorizedMerchantsMap.get(merchantUrl)) {
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
    merchantUrl: MerchantUrl,
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

  public getAuthorizedMerchants(): ResultAsync<
    Map<MerchantUrl, Signature>,
    PersistenceError
  > {
    return this.merchantConnectorRepository.getAuthorizedMerchants();
  }

  public getAuthorizedMerchantsConnectorsStatus(): ResultAsync<
    Map<MerchantUrl, boolean>,
    PersistenceError
  > {
    return this.merchantConnectorRepository.getAuthorizedMerchantsConnectorsStatus();
  }

  public activateAuthorizedMerchants(): ResultAsync<
    void,
    | MerchantConnectorError
    | MerchantValidationError
    | BlockchainUnavailableError
    | LogicalError
    | ProxyError
  > {
    return this.accountsRepository.getBalances().andThen((balances) => {
      return this.merchantConnectorRepository.activateAuthorizedMerchants(
        balances,
      );
    });
  }

  public closeMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.closeMerchantIFrame(merchantUrl);
  }

  public displayMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.displayMerchantIFrame(merchantUrl);
  }

  /* Destroy merchant connector if deauthorizeMerchant lasted more than deauthorizationTimeout */
  private _getDeauthorizationTimeoutResult(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, Error> {
    const deauthorizationTimeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        this.merchantConnectorRepository.destroyProxy(merchantUrl);
        resolve(undefined);
      }, this.deauthorizationTimeout);
    });
    return ResultAsync.fromPromise(
      deauthorizationTimeoutPromise,
      (e) => e as Error,
    );
  }
}
