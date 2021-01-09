import { HypernetLink, InitializedHypernetContext, Payment, ResultAsync } from "@interfaces/objects";

export interface ILinkUtils {
  paymentsToHypernetLinks(payments: Payment[], context: InitializedHypernetContext): ResultAsync<HypernetLink[], Error>;
}
