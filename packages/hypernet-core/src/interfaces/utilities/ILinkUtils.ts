import { HypernetLink, Payment } from "@hypernetlabs/objects";
import { CoreUninitializedError, InvalidParametersError } from "@hypernetlabs/objects/errors";
import { ResultAsync } from "neverthrow";

export interface ILinkUtils {
  paymentsToHypernetLinks(
    payments: Payment[],
  ): ResultAsync<HypernetLink[], CoreUninitializedError | InvalidParametersError>;
}
