import { ResultAsync } from "neverthrow";
import {
  CoreUninitializedError,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
} from "@hypernetlabs/objects/errors";

export interface IMerchantService {
  initialize(): ResultAsync<void, LogicalError>;
  authorizeMerchant(merchantUrl: string): ResultAsync<void, CoreUninitializedError | MerchantValidationError>;
  getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError>;
  activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError | PersistenceError>;
  closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
}
