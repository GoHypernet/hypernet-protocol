import { HypernetChannel, Address } from "@interfaces/objects";
export interface IPersistenceRepository {
  getActiveChannels(address: Address): Promise<HypernetChannel[]>;
  getAllChannels(address: Address): Promise<HypernetChannel[]>;
  getChannelsById(channelIds: string[]): Promise<HypernetChannel[]>;
}
