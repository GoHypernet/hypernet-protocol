import {
  HypernetLink,
  Payment,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILinkUtils {
  paymentsToHypernetLinks(
    payments: Payment[],
  ): ResultAsync<HypernetLink[], InvalidParametersError>;
}
