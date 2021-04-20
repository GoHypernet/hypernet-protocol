import { ResultAsync, Result } from "neverthrow";
import {
  Balances,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
  ProxyError,
  BlockchainUnavailableError,
  TransferResolutionError,
  EthereumAddress,
  PaymentId,
  TransferId,
  MerchantUrl,
  AuthorizedMerchantSignature,
} from "@hypernetlabs/objects";
import { PullPayment, PushPayment } from "@hypernetlabs/objects";

export interface IMerchantConnectorRepository {
  /**
   * Returns a map of merchant URLs to their address
   */
  getMerchantAddresses(merchantUrl: MerchantUrl[]): ResultAsync<Map<MerchantUrl, EthereumAddress>, LogicalError>;

  /**
   * Adds the merchant url as authorized with a particular signature
   * @param merchantUrl
   * @param signature
   */
  addAuthorizedMerchant(
    merchantUrl: MerchantUrl,
    initialBalances: Balances,
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
  removeAuthorizedMerchant(merchantUrl: MerchantUrl): Result<void, never>;

  getAuthorizedMerchants(): ResultAsync<Map<MerchantUrl, AuthorizedMerchantSignature>, never>;

  activateAuthorizedMerchants(
    balances: Balances,
  ): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | BlockchainUnavailableError | LogicalError | ProxyError
  >;

  resolveChallenge(
    merchantUrl: MerchantUrl,
    paymentId: PaymentId,
    transferId: TransferId,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | TransferResolutionError>;

  closeMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError>;

  notifyPushPaymentSent(merchantUrl: MerchantUrl, payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentUpdated(merchantUrl: MerchantUrl, payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentReceived(merchantUrl: MerchantUrl, payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentSent(merchantUrl: MerchantUrl, payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentUpdated(merchantUrl: MerchantUrl, payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentReceived(merchantUrl: MerchantUrl, payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
  notifyBalancesReceived(balances: Balances): ResultAsync<void, MerchantConnectorError>;
}
