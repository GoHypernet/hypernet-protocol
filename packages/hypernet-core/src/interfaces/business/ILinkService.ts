import { HypernetLink } from "@interfaces/objects";

export interface ILinkService {
    getLinks(): Promise<HypernetLink[]>;
}