import { IMerchantService } from "@interfaces/business";
import { ResultAsync } from "neverthrow";
import {
  CoreUninitializedError,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
} from "@hypernetlabs/objects/errors";
import { IMerchantConnectorRepository } from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";
import { ResultUtils } from "@hypernetlabs/utils";

export class MerchantService implements IMerchantService {
  constructor(
    protected merchantConnectorRepository: IMerchantConnectorRepository,
    protected contextProvider: IContextProvider,
  ) {}

  public initialize(): ResultAsync<void, LogicalError> {
    return this.contextProvider.getContext().map((context) => {
      // Subscribe to the various events, and sort them out for the merchant connector
      context.onPushPaymentSent.subscribe((payment) => {
        this.merchantConnectorRepository.notifyPushPaymentSent(payment.merchantUrl, payment).mapErr((e) => {
          console.log(e);
        });
      });

      context.onPushPaymentUpdated.subscribe((payment) => {
        this.merchantConnectorRepository.notifyPushPaymentUpdated(payment.merchantUrl, payment).mapErr((e) => {
          console.log(e);
        });
      });

      context.onPushPaymentReceived.subscribe((payment) => {
        this.merchantConnectorRepository.notifyPushPaymentReceived(payment.merchantUrl, payment).mapErr((e) => {
          console.log(e);
        });
      });

      context.onPullPaymentSent.subscribe((payment) => {
        this.merchantConnectorRepository.notifyPullPaymentSent(payment.merchantUrl, payment).mapErr((e) => {
          console.log(e);
        });
      });

      context.onPullPaymentUpdated.subscribe((payment) => {
        this.merchantConnectorRepository.notifyPullPaymentUpdated(payment.merchantUrl, payment).mapErr((e) => {
          console.log(e);
        });
      });

      context.onPullPaymentReceived.subscribe((payment) => {
        this.merchantConnectorRepository.notifyPullPaymentReceived(payment.merchantUrl, payment).mapErr((e) => {
          console.log(e);
        });
      });
    });
  }

  public authorizeMerchant(
    merchantUrl: string,
  ): ResultAsync<void, CoreUninitializedError | MerchantValidationError | PersistenceError> {
    return ResultUtils.combine([this.contextProvider.getContext(), this.getAuthorizedMerchants()]).map(async (vals) => {
      const [context, authorizedMerchantsMap] = vals;

      // Remove the merchant iframe proxy related to that merchantUrl if there is any activated ones.
      if (authorizedMerchantsMap.get(merchantUrl)) {
        this.merchantConnectorRepository.removeAuthorizedMerchant(merchantUrl);
      }

      this.merchantConnectorRepository.addAuthorizedMerchant(merchantUrl).map(() => {
        context.onMerchantAuthorized.next(merchantUrl);
      });
    });
  }

  public getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError> {
    return this.merchantConnectorRepository.getAuthorizedMerchants();
  }

  public activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError | PersistenceError> {
    return this.merchantConnectorRepository.activateAuthorizedMerchants();
  }

  public closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.closeMerchantIFrame(merchantUrl);
  }

  public displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.displayMerchantIFrame(merchantUrl);
  }
}
