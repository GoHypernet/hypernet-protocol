import { ResultAsync } from "neverthrow";
import {
  CoreUninitializedError,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
} from "@hypernetlabs/objects/errors";
import { PullPayment, PushPayment } from "@hypernetlabs/objects";

export interface IMerchantConnectorRepository {
  /**
   * Returns a map of merchant URLs to their address
   */
  getMerchantAddresses(merchantUrl: string[]): ResultAsync<Map<string, string>, Error>;

  /**
   * Adds the merchant url as authorized with a particular signature
   * @param merchantUrl
   * @param signature
   */
  addAuthorizedMerchant(merchantUrl: string): ResultAsync<void, PersistenceError>;

  /**
   * Destroy merchant connector proxy
   * @param merchantUrl
   */
  removeAuthorizedMerchant(merchantUrl: string): void;

  getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError>;

  activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError>;

  resolveChallenge(
    merchantUrl: string,
    paymentId: string,
    transferId: string,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | CoreUninitializedError>;

  closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;

  notifyPushPaymentSent(merchantUrl: string, payment: PushPayment): ResultAsync<void, LogicalError>;
  notifyPushPaymentUpdated(merchantUrl: string, payment: PushPayment): ResultAsync<void, LogicalError>;
  notifyPushPaymentReceived(merchantUrl: string, payment: PushPayment): ResultAsync<void, LogicalError>;
  notifyPullPaymentSent(merchantUrl: string, payment: PullPayment): ResultAsync<void, LogicalError>;
  notifyPullPaymentUpdated(merchantUrl: string, payment: PullPayment): ResultAsync<void, LogicalError>;
  notifyPullPaymentReceived(merchantUrl: string, payment: PullPayment): ResultAsync<void, LogicalError>;
}
