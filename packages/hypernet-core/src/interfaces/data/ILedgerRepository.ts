import { HypernetLedger } from "@interfaces/objects";


/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface ILedgerRepository {

    /**
     * Get all Hypernet Links for this client
     */
    getHypernetLedgers(): Promise<HypernetLedger[]>;

    /**
     * Given a linkId, return the associated Hypernet Link.
     * @param linkId The ID of the link to retrieve
     */
    getHypernetLedger(linkId: string): Promise<HypernetLedger>
}