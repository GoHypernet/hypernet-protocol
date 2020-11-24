import { HypernetLink, InitializedHypernetContext, Payment } from "@interfaces/objects";

export interface ILinkUtils {
  paymentsToHypernetLinks(payments: Payment[], context: InitializedHypernetContext): Promise<HypernetLink[]>;
}
