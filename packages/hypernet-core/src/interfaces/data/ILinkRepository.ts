import { HypernetLink, Payment} from "@interfaces/objects";

/**
 * 
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
    getHypernetLink(linkId: string): Promise<HypernetLink>;

    /**
     * 
     * @param paymentIds 
     */
    provideAssets(paymentIds: string[]): Promise<Map<string, Payment>> 

    /**
     * 
     * @param paymentIds 
     */
    provideStakes(paymentIds: string[]): Promise<Map<string, Payment>>

    /**
     * 
     * @param paymentIds 
     */
    finalizePayments(paymentIds: string[]): Promise<Map<string, Payment>>
}