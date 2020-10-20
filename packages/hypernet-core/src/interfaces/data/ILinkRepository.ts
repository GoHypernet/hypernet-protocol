import { HypernetLink } from "@interfaces/objects";

export interface ILinkRepository {
    getHypernetLinks(): Promise<HypernetLink[]>;
}