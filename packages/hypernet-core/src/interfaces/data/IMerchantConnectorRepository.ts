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
  GatewayUrl,
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
    merchantUrl: GatewayUrl[],
  ): ResultAsync<Map<GatewayUrl, EthereumAddress>, LogicalError>;

  /**
   * Adds the merchant url as authorized with a particular signature
   * @param merchantUrl
   * @param signature
   */
  addAuthorizedMerchant(
    merchantUrl: GatewayUrl,
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
    merchantUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
  >;

  /**
   * Returns the status of all the authorized merchant's connectors.
   * @returns A map of merchant URL and a boolean indicating whether or not the connector is active.
   */
  getAuthorizedMerchantsConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
  >;

  /**
   * Returns a list of authorized merchants and the user's authorization signature for that
   * merchant.
   */
  getAuthorizedMerchants(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  >;

  activateAuthorizedMerchants(balances: Balances): ResultAsync<void, never>;

  resolveChallenge(
    merchantUrl: GatewayUrl,
    paymentId: PaymentId,
    transferId: TransferId,
  ): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | TransferResolutionError
  >;

  closeMerchantIFrame(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError>;

  destroyProxy(merchantUrl: GatewayUrl): void;

  notifyPushPaymentSent(
    merchantUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentUpdated(
    merchantUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentReceived(
    merchantUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentSent(
    merchantUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentUpdated(
    merchantUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentReceived(
    merchantUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError>;
}

export interface IAuthorizedMerchantEntry {
  merchantUrl: GatewayUrl;
  authorizationSignature: string;
}

export const IMerchantConnectorRepositoryType = Symbol.for(
  "IMerchantConnectorRepository",
);
