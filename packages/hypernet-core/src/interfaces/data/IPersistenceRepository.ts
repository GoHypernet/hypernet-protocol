import { HypernetLink, EthereumAddress } from "@interfaces/objects";
export interface IPersistenceRepository {
  getActiveLinks(): Promise<HypernetLink[]>;
  getAllChannels(address: EthereumAddress): Promise<HypernetLink[]>;
  getChannelsById(channelIds: string[]): Promise<HypernetLink[]>;
  createLink(link: HypernetLink): Promise<HypernetLink>;
}
