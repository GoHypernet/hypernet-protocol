import { FullTransferState } from "@connext/vector-types";
import { IHypernetTransferMetadata, PublicIdentifier } from "@interfaces/objects";

/**
 * 
 */
export interface IVectorUtils {

    /**
     * 
     */
    getRouterChannelAddress(): Promise<string>;

    /**
     * 
     * @param counterParty 
     * @param metadata 
     */
    createNullTransfer(counterParty: PublicIdentifier, metadata: IHypernetTransferMetadata): Promise<FullTransferState>; 
}