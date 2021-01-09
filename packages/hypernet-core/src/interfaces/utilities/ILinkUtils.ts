import { HypernetLink, InitializedHypernetContext, Payment, ResultAsync } from "@interfaces/objects";
import { LogicalError } from "@interfaces/objects/errors";

export interface ILinkUtils {
  paymentsToHypernetLinks(payments: Payment[], context: InitializedHypernetContext): ResultAsync<HypernetLink[], LogicalError>;
}
