import { HypernetLink } from "@interfaces/objects";

export interface ILinkService {
    getLedgers(): Promise<HypernetLink[]>;
}