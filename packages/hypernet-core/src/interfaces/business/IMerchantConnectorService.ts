import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  MerchantAuthorizationDeniedError,
} from "@hypernetlabs/objects";
import { GatewayUrl, Signature } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorService {
  initialize(): ResultAsync<void, LogicalError | MerchantConnectorError>;
  authorizeMerchant(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, MerchantValidationError>;
  deauthorizeMerchant(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
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
    | MerchantConnectorError
    | MerchantValidationError
    | BlockchainUnavailableError
    | LogicalError
    | ProxyError
  >;
  closeMerchantIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError>;
}
