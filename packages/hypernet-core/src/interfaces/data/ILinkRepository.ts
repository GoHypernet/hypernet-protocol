import { HypernetLink } from "@interfaces/objects";


/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface ILinkRepository {

    /**
     * Get all Hypernet Links for this client
     */
    getHypernetLinks(): Promise<HypernetLink[]>;

    /**
     * Given a linkId, return the associated Hypernet Link.
     * @param linkId The ID of the link to retrieve
     */
    getHypernetLink(linkId: string): Promise<HypernetLink>
}