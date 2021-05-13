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
  Signature,
  MerchantAuthorizationDeniedError,
  PullPayment,
  PushPayment,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorRepository {
  /**
   * Returns a map of merchant URLs to their address
   */
  getMerchantAddresses(
    merchantUrl: MerchantUrl[],
  ): ResultAsync<Map<MerchantUrl, EthereumAddress>, LogicalError>;

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
    | MerchantValidationError
    | ProxyError
    | BlockchainUnavailableError
    | MerchantConnectorError
    | MerchantAuthorizationDeniedError
  >;

  /**
   * Deauthorizes a merchant, which will also destroy their proxy.
   * @param merchantUrl
   */
  deauthorizeMerchant(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, PersistenceError>;

  /**
   * Returns the status of all the authorized merchant's connectors.
   * @returns A map of merchant URL and a boolean indicating whether or not the connector is active.
   */
  getAuthorizedMerchantConnectorStatus(): ResultAsync<
    Map<MerchantUrl, boolean>,
    PersistenceError
  >;

  /**
   * Returns a list of authorized merchants and the user's authorization signature for that
   * merchant.
   */
  getAuthorizedMerchants(): ResultAsync<
    Map<MerchantUrl, Signature>,
    PersistenceError
  >;

  activateAuthorizedMerchants(
    balances: Balances,
  ): ResultAsync<void, PersistenceError>;

  resolveChallenge(
    merchantUrl: MerchantUrl,
    paymentId: PaymentId,
    transferId: TransferId,
  ): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | TransferResolutionError
  >;

  closeMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError>;

  notifyPushPaymentSent(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentUpdated(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentReceived(
    merchantUrl: MerchantUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentSent(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentUpdated(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentReceived(
    merchantUrl: MerchantUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError>;
}

export interface IAuthorizedMerchantEntry {
  merchantUrl: MerchantUrl;
  authorizationSignature: string;
}

export const IMerchantConnectorRepositoryType = Symbol.for(
  "IMerchantConnectorRepository",
);
