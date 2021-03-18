import { ResultAsync } from "neverthrow";
import {
  CoreUninitializedError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
} from "@hypernetlabs/objects/errors";

export interface IMerchantService {
  authorizeMerchant(merchantUrl: string): ResultAsync<void, CoreUninitializedError | MerchantValidationError>;
  getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError>;
  activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError | PersistenceError>;
  merchantIFrameClosed(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
  merchantIFrameDisplayed(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
}
