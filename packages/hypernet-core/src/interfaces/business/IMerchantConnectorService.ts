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
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantValidationError>;
  deauthorizeMerchant(
    merchantUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
  >;
  getAuthorizedMerchants(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  >;
  getAuthorizedMerchantsConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
  >;
  activateAuthorizedMerchants(): ResultAsync<
    void,
    | MerchantConnectorError
    | MerchantValidationError
    | BlockchainUnavailableError
    | LogicalError
    | ProxyError
  >;
  closeMerchantIFrame(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError>;
}
