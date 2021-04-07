import { ResultAsync, Result } from "neverthrow";
import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
  ProxyError,
  BlockchainUnavailableError,
  TransferResolutionError,
  EthereumAddress,
  PaymentId,
  Signature,
} from "@hypernetlabs/objects";
import { PullPayment, PushPayment } from "@hypernetlabs/objects";

export interface IMerchantConnectorRepository {
  /**
   * Returns a map of merchant URLs to their address
   */
  getMerchantAddresses(merchantUrl: string[]): ResultAsync<Map<string, EthereumAddress>, LogicalError>;

  /**
   * Adds the merchant url as authorized with a particular signature
   * @param merchantUrl
   * @param signature
   */
  addAuthorizedMerchant(
    merchantUrl: string,
  ): ResultAsync<
    void,
    | PersistenceError
    | LogicalError
    | MerchantValidationError
    | ProxyError
    | BlockchainUnavailableError
    | MerchantConnectorError
  >;

  /**
   * Destroy merchant connector proxy
   * @param merchantUrl
   */
  removeAuthorizedMerchant(merchantUrl: string): Result<void, never>;

  getAuthorizedMerchants(): ResultAsync<Map<string, Signature>, never>;

  activateAuthorizedMerchants(): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | BlockchainUnavailableError | LogicalError | ProxyError
  >;

  resolveChallenge(
    merchantUrl: string,
    paymentId: PaymentId,
    transferId: string,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | TransferResolutionError>;

  closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;

  notifyPushPaymentSent(merchantUrl: string, payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentUpdated(merchantUrl: string, payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentReceived(merchantUrl: string, payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentSent(merchantUrl: string, payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentUpdated(merchantUrl: string, payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentReceived(merchantUrl: string, payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
}
