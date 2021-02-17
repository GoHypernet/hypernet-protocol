import { ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, MediatorValidationError } from "@interfaces/objects/errors";

export interface IMerchantService {
  authorizeMerchant(merchantUrl: URL): ResultAsync<void, CoreUninitializedError | MediatorValidationError>;
}
