import { ResultAsync } from "neverthrow";
import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
} from "@hypernetlabs/objects";
import { MerchantUrl, AuthorizedMerchantSignature } from "@hypernetlabs/objects";

export interface IMerchantService {
  initialize(): ResultAsync<void, LogicalError | MerchantConnectorError>;
  authorizeMerchant(merchantUrl: MerchantUrl): ResultAsync<void, MerchantValidationError>;
  getAuthorizedMerchants(): ResultAsync<Map<MerchantUrl, AuthorizedMerchantSignature>, never>;
  activateAuthorizedMerchants(): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | BlockchainUnavailableError | LogicalError | ProxyError
  >;
  closeMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError>;
}
