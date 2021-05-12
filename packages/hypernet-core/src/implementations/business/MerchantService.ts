import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
  CeramicError,
} from "@hypernetlabs/objects";
import { MerchantUrl, Signature } from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

import { IMerchantService } from "@interfaces/business";
import {
  IAccountsRepository,
  IMerchantConnectorRepository,
} from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";

export class MerchantService implements IMerchantService {
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

  public getAuthorizedMerchants(): ResultAsync<
    Map<MerchantUrl, Signature>,
    CeramicError
  > {
    return this.merchantConnectorRepository.getAuthorizedMerchants();
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
}
