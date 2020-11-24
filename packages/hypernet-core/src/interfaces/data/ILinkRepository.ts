import { BrowserNode } from "@connext/vector-browser-node";
import { FullTransferState } from "@connext/vector-types";
import { BigNumber, EthereumAddress, HypernetConfig, HypernetLink, InitializedHypernetContext, Payment, PublicIdentifier, PublicKey } from "@interfaces/objects";


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
    getHypernetLink(linkId: string): Promise<HypernetLink>;

    getHypernetLinksByPayments(
        payments: Payment[],
        context: InitializedHypernetContext,
    ): Promise<HypernetLink[]>;

    provideAssets(paymentIds: string[]): Promise<Map<string, Payment>> 
    provideStakes(paymentIds: string[]): Promise<Map<string, Payment>>
    finalizePayments(paymentIds: string[]): Promise<Map<string, Payment>>
}