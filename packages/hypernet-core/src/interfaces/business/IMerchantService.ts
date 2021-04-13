import { ResultAsync } from "neverthrow";
import {
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  BlockchainUnavailableError,
  ProxyError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { MerchantUrl, Signature } from "@hypernetlabs/objects";

export interface IMerchantService {
  initialize(): ResultAsync<void, LogicalError | MerchantConnectorError>;
  authorizeMerchant(merchantUrl: MerchantUrl): ResultAsync<void, MerchantValidationError | InvalidParametersError>;
  getAuthorizedMerchants(): ResultAsync<Map<MerchantUrl, Signature>, never>;
  activateAuthorizedMerchants(): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError | BlockchainUnavailableError | LogicalError | ProxyError
  >;
  closeMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
  displayMerchantIFrame(merchantUrl: MerchantUrl): ResultAsync<void, MerchantConnectorError | InvalidParametersError>;
}
