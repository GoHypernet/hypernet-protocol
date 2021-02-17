import { ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, MerchantValidationError, PersistenceError } from "@interfaces/objects/errors";

export interface IMerchantService {
  authorizeMerchant(merchantUrl: URL): ResultAsync<void, CoreUninitializedError | MerchantValidationError>;
  getAuthorizedMerchants(): ResultAsync<URL[], PersistenceError>;
}
