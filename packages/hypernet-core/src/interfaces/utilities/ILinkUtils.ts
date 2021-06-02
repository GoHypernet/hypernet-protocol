import { HypernetLink, Payment } from "@hypernetlabs/objects";
import { InvalidParametersError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILinkUtils {
  paymentsToHypernetLinks(
    payments: Payment[],
  ): ResultAsync<HypernetLink[], InvalidParametersError>;
}
