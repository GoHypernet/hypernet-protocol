import { BrowserNode } from "@connext/vector-browser-node";
import { FullTransferState } from "@connext/vector-types";
import { IHypernetTransferMetadata, PublicIdentifier } from "@interfaces/objects";
import { ETransferType } from "@interfaces/types";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IVectorUtils {

    /**
     * 
     */
    getRouterChannelAddress(): Promise<string>;

    getTransferType(transfer: FullTransferState): ETransferType;

    
    createNullTransfer(counterParty: PublicIdentifier, metadata: IHypernetTransferMetadata): Promise<FullTransferState>;
    sortTransfers(paymentId: string, transfers: FullTransferState[], browserNode: BrowserNode): Promise<ISortedTransfers>;
}

export interface ISortedTransfers {
    offerTransfer: FullTransferState,
    insuranceTransfer: FullTransferState | null,
    parameterizedTransfer: FullTransferState | null,
    pullRecordTransfers: FullTransferState[],
    metadata: IHypernetTransferMetadata
}