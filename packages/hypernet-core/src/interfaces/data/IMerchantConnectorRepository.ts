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
  InvalidParametersError,
  EthereumAddress,
  PaymentId,
  TransferId,
  Signature,
  MerchantUrl,
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
    | InvalidParametersError
  >;

  /**
   * Destroy merchant connector proxy
   * @param merchantUrl
   */
  removeAuthorizedMerchant(merchantUrl: MerchantUrl): Result<void, InvalidParametersError>;

  getAuthorizedMerchants(): ResultAsync<Map<MerchantUrl, Signature>, never>;

  activateAuthorizedMerchants(
    balances: Balances,
  ): ResultAsync<
    void,
    | MerchantConnectorError
    | MerchantValidationError
    | BlockchainUnavailableError
    | LogicalError
    | ProxyError
    | InvalidParametersError
  >;

  resolveChallenge(
    merchantUrl: MerchantUrl,
    paymentId: PaymentId,
    transferId: TransferId,
  ): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | TransferResolutionError | InvalidParametersError
  >;

  closeMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
  displayMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;

  notifyPushPaymentSent(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
  notifyPushPaymentUpdated(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
  notifyPushPaymentReceived(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
  notifyPullPaymentSent(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
  notifyPullPaymentUpdated(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
  notifyPullPaymentReceived(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
  notifyBalancesReceived(balances: Balances): ResultAsync<void, MerchantConnectorError>;
}
