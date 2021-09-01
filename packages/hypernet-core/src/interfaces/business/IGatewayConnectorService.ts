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
  EthereumAddress,
  RouterUnauthorizedError,
  GatewayTokenInfo,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGatewayConnectorService {
  initialize(): ResultAsync<void, GatewayConnectorError>;
  authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayValidationError>;
  deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
  >;
  getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  >;
  getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
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
  ): ResultAsync<EthereumAddress, PersistenceError | RouterUnauthorizedError>;

  getGatewayTokenInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayTokenInfo[]>,
    ProxyError | PersistenceError | GatewayAuthorizationDeniedError
  >;

  closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError>;
  displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError>;
}
