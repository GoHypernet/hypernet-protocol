import {
  Balances,
  GatewayConnectorError,
  GatewayValidationError,
  PersistenceError,
  ProxyError,
  BlockchainUnavailableError,
  GatewayUrl,
  Signature,
  GatewayAuthorizationDeniedError,
  PullPayment,
  PushPayment,
  GatewayRegistrationInfo,
  ChainId,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGatewayConnectorRepository {
  /**
   * Returns a map of gateway URLs to their address
   * @param gatewayUrls
   */
  getGatewayRegistrationInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    BlockchainUnavailableError
  >;

  /**
   * Adds the gateway url as authorized with a particular signature
   * @param gatewayRegistrationInfo
   * @param initialBalances
   */
  addAuthorizedGateway(
    gatewayRegistrationInfo: GatewayRegistrationInfo,
    initialBalances: Balances,
  ): ResultAsync<
    void,
    | PersistenceError
    | GatewayValidationError
    | ProxyError
    | BlockchainUnavailableError
    | GatewayConnectorError
    | GatewayAuthorizationDeniedError
  >;

  /**
   * Deauthorizes a gateway, which will also destroy their proxy.
   * @param gatewayUrl
   */
  deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
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
   * Returns a list of authorized gateways and the user's authorization signature for that
   * gateway.
   */
  getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  >;

  activateAuthorizedGateways(balances: Balances): ResultAsync<void, never>;

  closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError>;
  displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError>;

  destroyProxy(gatewayUrl: GatewayUrl): void;

  notifyPushPaymentSent(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError>;
  notifyPushPaymentUpdated(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError>;
  notifyPushPaymentReceived(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError>;
  notifyPushPaymentDelayed(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError>;
  notifyPushPaymentCanceled(
    gatewayUrl: GatewayUrl,
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError>;

  notifyPullPaymentSent(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError>;
  notifyPullPaymentUpdated(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError>;
  notifyPullPaymentReceived(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError>;
  notifyPullPaymentDelayed(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError>;
  notifyPullPaymentCanceled(
    gatewayUrl: GatewayUrl,
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError>;

  notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, GatewayConnectorError>;
}

export interface IAuthorizedGatewayEntry {
  gatewayUrl: GatewayUrl;
  authorizationSignature: string;
}

export const IGatewayConnectorRepositoryType = Symbol.for(
  "IGatewayConnectorRepository",
);
