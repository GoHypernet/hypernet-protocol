import {
  PersistenceError,
  ProxyError,
  GatewayUrl,
  Signature,
  GatewayAuthorizationDeniedError,
  GatewayRegistrationInfo,
  VectorError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IGatewayConnectorProxy } from "@interfaces/utilities";

export interface IGatewayConnectorRepository {
  /**
   * Adds the gateway url as authorized with a particular signature
   * @param gatewayRegistrationInfo
   */
  addAuthorizedGateway(
    gatewayUrl: GatewayUrl,
    authorizationSignature: Signature,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;

  /**
   * Returns the activated proxy for the requested gateway URL.
   * The connector may not be activated; call proxy.getGatewayConnectorStatus() to check.
   * You can call proxy.activateConnector() to attempt activation
   * @param gatewayUrl
   */
  getGatewayProxy(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<IGatewayConnectorProxy, ProxyError>;

  /**
   * Creates a proxy for a gateway connector. This does not activate the connector, just assures that the proxy exists.
   * Any requests to getGatewayProxy that are waiting for this proxy will be resolved.
   */
  createGatewayProxy(
    gatewayRegistrationInfo: GatewayRegistrationInfo,
  ): ResultAsync<IGatewayConnectorProxy, ProxyError>;

  /**
   * Deauthorizes a gateway, which will also destroy their proxy.
   * @param gatewayUrl
   */
  deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;

  /**
   * Returns a list of authorized gateways and the user's authorization signature for that
   * gateway.
   */
  getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;

  destroyProxy(gatewayUrl: GatewayUrl): void;
}

export interface IAuthorizedGatewayEntry {
  gatewayUrl: GatewayUrl;
  authorizationSignature: string;
}

export const IGatewayConnectorRepositoryType = Symbol.for(
  "IGatewayConnectorRepository",
);
