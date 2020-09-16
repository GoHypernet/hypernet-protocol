import { HypernetLink, EthereumAddress } from "@interfaces/objects";
export interface IPersistenceRepository {
  getActiveLinks(): Promise<HypernetLink[]>;
  getLinksById(linkIds: string[]): Promise<{ [linkId: string]: HypernetLink }>;
  getLinksByParticipant(consumerOrProviderIds: string[]): Promise<HypernetLink[]>;
  createLink(link: HypernetLink): Promise<HypernetLink>;
  updateLink(link: HypernetLink): Promise<void>;

  // Debug only
  clearLinks(): Promise<void>;
}
