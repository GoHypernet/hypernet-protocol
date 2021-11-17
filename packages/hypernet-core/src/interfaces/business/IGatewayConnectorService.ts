import {
  GatewayConnectorError,
  GatewayValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  GatewayAuthorizationDeniedError,
  GatewayUrl,
  Signature,
  ChainId,
  PublicIdentifier,
  RouterUnauthorizedError,
  GatewayTokenInfo,
  GatewayRegistrationFilter,
  GatewayRegistrationInfo,
  InvalidParametersError,
  BalancesUnavailableError,
  GatewayActivationError,
  ActiveStateChannel,
  VectorError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGatewayConnectorService {
  initialize(): ResultAsync<void, never>;
  authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | PersistenceError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayAuthorizationDeniedError
    | GatewayActivationError
    | VectorError
  >;
  deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | PersistenceError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayActivationError
    | VectorError
    | GatewayValidationError
  >;
  getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  activateAuthorizedGateways(): ResultAsync<
    void,
    | GatewayConnectorError
    | GatewayValidationError
    | BlockchainUnavailableError
    | ProxyError
  >;
  /**
   * This method will guarantee a state channel exists AND that it is useable by the gateway.
   * If the router does not say that the gateway is authorized, even if a state channel exists,
   * this method will return an error.
   * @param gatewayUrl
   * @param chainId The chain to establish the state channel on.
   * @param routerPublicIdentifiers a list of router public identifiers; if a state channel does not exist already one of these will be chosen randomly.
   * @returns the address of the state channel (newly created or not), or an error.
   */
  ensureStateChannel(
    gatewayUrl: GatewayUrl,
    chainId: ChainId,
    routerPublicIdentifiers: PublicIdentifier[],
  ): ResultAsync<
    ActiveStateChannel,
    | PersistenceError
    | RouterUnauthorizedError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
  >;

  getGatewayTokenInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayTokenInfo[]>,
    | ProxyError
    | PersistenceError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayActivationError
    | VectorError
    | GatewayValidationError
  >;

  getGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError>;

  closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | GatewayConnectorError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | GatewayActivationError
    | GatewayValidationError
  >;
  displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | GatewayConnectorError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | GatewayActivationError
    | GatewayValidationError
  >;
}

export const IGatewayConnectorServiceType = Symbol.for(
  "IGatewayConnectorService",
);
