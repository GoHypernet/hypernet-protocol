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
   * Returns a map of gateway URLs to their address
   */
  getMerchantAddresses(
    gatewayUrl: GatewayUrl[],
  ): ResultAsync<Map<GatewayUrl, EthereumAddress>, LogicalError>;

  /**
   * Adds the gateway url as authorized with a particular signature
   * @param gatewayUrl
   * @param signature
   */
  addAuthorizedMerchant(
    gatewayUrl: GatewayUrl,
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
   * Deauthorizes a gateway, which will also destroy their proxy.
   * @param gatewayUrl
   */
  deauthorizeMerchant(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
  >;

  /**
   * Returns the status of all the authorized gateway's connectors.
   * @returns A map of gateway URL and a boolean indicating whether or not the connector is active.
   */
  getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
  >;

  /**
   * Returns a list of authorized merchants and the user's authorization signature for that
   * gateway.
   */
  getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  >;

  activateAuthorizedGateways(balances: Balances): ResultAsync<void, never>;

  resolveChallenge(
    gatewayUrl: GatewayUrl,
    paymentId: PaymentId,
    transferId: TransferId,
  ): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | TransferResolutionError
  >;

  closeMerchantIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError>;

  destroyProxy(gatewayUrl: GatewayUrl): void;

  notifyPushPaymentSent(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentUpdated(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentReceived(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentSent(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentUpdated(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentReceived(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError>;
  notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError>;
}

export interface IAuthorizedMerchantEntry {
  gatewayUrl: GatewayUrl;
  authorizationSignature: string;
}

export const IMerchantConnectorRepositoryType = Symbol.for(
  "IMerchantConnectorRepository",
);
