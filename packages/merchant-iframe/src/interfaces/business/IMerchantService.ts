import { ResultAsync } from "neverthrow";
import { MerchantConnectorError, MerchantValidationError } from "@merchant-iframe/interfaces/objects/errors";
import { IMerchantConnector } from "@hypernetlabs/merchant-connector";

export interface IMerchantService {
  validateMerchantConnector(): ResultAsync<string, MerchantValidationError>;
  activateMerchantConnector(): ResultAsync<IMerchantConnector, MerchantConnectorError | MerchantValidationError>;
}
