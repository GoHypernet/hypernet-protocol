import { ResultAsync } from "@interfaces/objects";
import {
  CoreUninitializedError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
} from "@interfaces/objects/errors";

export interface IMerchantService {
  authorizeMerchant(merchantUrl: string): ResultAsync<void, CoreUninitializedError | MerchantValidationError>;
  getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError>;
  activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError | PersistenceError>;
}
