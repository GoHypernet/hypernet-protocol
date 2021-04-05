import { ResultAsync } from "neverthrow";
import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
} from "@hypernetlabs/objects";

export interface IMerchantService {
  initialize(): ResultAsync<void, LogicalError | MerchantConnectorError>;
  authorizeMerchant(merchantUrl: string): ResultAsync<void, MerchantValidationError>;
  getAuthorizedMerchants(): ResultAsync<Map<string, string>, never>;
  activateAuthorizedMerchants(): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | BlockchainUnavailableError | LogicalError | ProxyError
  >;
  closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
}
