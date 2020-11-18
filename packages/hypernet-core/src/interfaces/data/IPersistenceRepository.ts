import { HypernetLedger, EthereumAddress } from "@interfaces/objects";
import { ELinkRole } from "@interfaces/types";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IPersistenceRepository {

  /**
   * 
   */
  getActiveLinks(): Promise<HypernetLedger[]>;

  /**
   * 
   */
  getLinksById(linkIds: string[]): Promise<{ [linkId: string]: HypernetLedger }>;

  /**
   * 
   */
  getLinksByParticipant(consumerOrProviderIds: string[]): Promise<HypernetLedger[]>;

  /**
   * Returns a link where the counterparty has the provided address, and WE have the requested role
   */
  getLinkByAddressAndRole(consumerOrProviderId: string, ourRole: ELinkRole): Promise<HypernetLedger | null>;

  /**
   * 
   */
  createLink(link: HypernetLedger): Promise<HypernetLedger>;

  /**
   * 
   */
  updateLink(link: HypernetLedger): Promise<void>;

  // Debug only
  clearLinks(): Promise<void>;
}
