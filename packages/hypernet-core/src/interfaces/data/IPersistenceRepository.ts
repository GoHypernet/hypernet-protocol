import { HypernetLink, EthereumAddress } from "@interfaces/objects";
import { ELinkRole } from "@interfaces/types";
export interface IPersistenceRepository {
  getActiveLinks(): Promise<HypernetLink[]>;
  getLinksById(linkIds: string[]): Promise<{ [linkId: string]: HypernetLink }>;
  getLinksByParticipant(consumerOrProviderIds: string[]): Promise<HypernetLink[]>;
  /** Returns a link where the counterparty has the provided address, and WE have the requested role */
  getLinkByAddressAndRole(consumerOrProviderId: string, ourRole: ELinkRole): Promise<HypernetLink | null>;
  createLink(link: HypernetLink): Promise<HypernetLink>;
  updateLink(link: HypernetLink): Promise<void>;

  // Debug only
  clearLinks(): Promise<void>;
}
