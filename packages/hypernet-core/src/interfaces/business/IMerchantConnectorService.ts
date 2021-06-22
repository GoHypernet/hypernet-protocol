import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
  PersistenceError,
  MerchantAuthorizationDeniedError,
} from "@hypernetlabs/objects";
import { MerchantUrl, Signature } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorService {
  initialize(): ResultAsync<void, LogicalError | MerchantConnectorError>;
  authorizeMerchant(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantValidationError>;
  deauthorizeMerchant(
    merchantUrl: MerchantUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
  >;
  getAuthorizedMerchants(): ResultAsync<
    Map<MerchantUrl, Signature>,
    PersistenceError
  >;
  getAuthorizedMerchantsConnectorsStatus(): ResultAsync<
    Map<MerchantUrl, boolean>,
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
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError>;
}
