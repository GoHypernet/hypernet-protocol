import { HypernetLink, Payment, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, InvalidParametersError } from "@interfaces/objects/errors";

export interface ILinkUtils {
  paymentsToHypernetLinks(
    payments: Payment[],
  ): ResultAsync<HypernetLink[], CoreUninitializedError | InvalidParametersError>;
}
