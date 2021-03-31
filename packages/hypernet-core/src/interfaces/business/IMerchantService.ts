import { ResultAsync } from "neverthrow";
import {
  CoreUninitializedError,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
} from "@hypernetlabs/objects";

export interface IMerchantService {
  initialize(): ResultAsync<void, LogicalError | MerchantConnectorError>;
  authorizeMerchant(merchantUrl: string): ResultAsync<void, CoreUninitializedError | MerchantValidationError>;
  getAuthorizedMerchants(): ResultAsync<Map<string, string>, never>;
  activateAuthorizedMerchants(): ResultAsync<
    void,
    | MerchantConnectorError
    | MerchantValidationError
    | CoreUninitializedError
    | BlockchainUnavailableError
    | LogicalError
    | ProxyError
  >;
  closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
}
