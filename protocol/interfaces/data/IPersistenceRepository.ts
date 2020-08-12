import {Channel} from "@interfaces/objects";
export interface IPersistenceRepository {
    getActiveChannels(walletAddress: string): Channel[];
}