import { IConfigProvider, IPaymentUtils, IVectorUtils } from "@interfaces/utilities";
import { v4 as uuidv4 } from "uuid";
import { BigNumber, HypernetConfig, IHypernetTransferMetadata, InitializedHypernetContext, Payment, PublicIdentifier, PullAmount, PullPayment, PushPayment } from "@interfaces/objects";
import { FullTransferState} from "@connext/vector-types";
import { BrowserNode } from "@connext/vector-browser-node";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import moment from "moment";
import { ISortedTransfers } from "@interfaces/utilities";

export class PaymentUtils implements IPaymentUtils {
    constructor(
        protected configProvider: IConfigProvider,
    ) {}
    
    /**
     * 
     * @param paymentId 
     */
    public async isHypernetDomain(paymentId: string): Promise<boolean> {
        const config = await this.configProvider.getConfig();

        const paymentComponents = paymentId.split(":");

        return paymentComponents[0] == config.hypernetProtocolDomain;
    }
    
    /**
     * 
     * @param paymentType 
     */
    public async createPaymentId(paymentType: EPaymentType): Promise<string> {
        const config = await this.configProvider.getConfig();

        return `${config.hypernetProtocolDomain}:${paymentType}:${uuidv4()}`;
    }

    /**
     * 
     * @param id 
     * @param to 
     * @param from 
     * @param state 
     * @param sortedTransfers 
     * @param metadata 
     */
    public transfersToPushPayment(id: string,
        to: PublicIdentifier,
        from: PublicIdentifier,
        state: EPaymentState,
        sortedTransfers: SortedTransfers,
        metadata: IHypernetTransferMetadata): PushPayment {

        /**
         * Push payments consist of 3 transfers, a null transfer for 0 value that represents the 
         * offer, an insurance payment, and a parameterized payment. 
         */

        if (sortedTransfers.pullRecordTransfers.length > 0) {
            throw new Error("Push payment has pull transfers!");
        }

        const amountStaked = sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.balance.amount[0] : 0;

        return new PushPayment(
            id,
            to,
            from,
            state,
            sortedTransfers.offerTransfer.assetId,
            BigNumber.from(metadata.requiredStake),
            BigNumber.from(amountStaked),
            102,
            false,
            moment(),
            moment(),
            BigNumber.from(0),
            metadata.disputeMediator,
            BigNumber.from(metadata.paymentAmount),
        );
    }

    /**
     * 
     * @param id 
     * @param to 
     * @param from 
     * @param state 
     * @param sortedTransfers 
     * @param metadata 
     */
    public transfersToPullPayment(
        id: string,
        to: PublicIdentifier,
        from: PublicIdentifier,
        state: EPaymentState,
        sortedTransfers: SortedTransfers,
        metadata: IHypernetTransferMetadata): PullPayment {
            
        /**
         * Push payments consist of 3 transfers, a null transfer for 0 value that represents the 
         * offer, an insurance payment, and a parameterized payment. 
         */

        if (sortedTransfers.pullRecordTransfers.length > 0) {
            throw new Error("Push payment has pull transfers!");
        }

        const amountStaked = sortedTransfers.insuranceTransfer != null ? sortedTransfers.insuranceTransfer.balance.amount[0] : 0;

        return new PullPayment(id,
            to,
            from,
            state,
            sortedTransfers.offerTransfer.assetId,
            BigNumber.from(metadata.requiredStake),
            BigNumber.from(amountStaked),
            102,
            false,
            moment.unix(metadata.creationDate),
            moment(),
            BigNumber.from(0),
            metadata.disputeMediator,
            BigNumber.from(metadata.paymentAmount),
            BigNumber.from(0),
            new Array<PullAmount>()
        );
    }

    /**
     *
     * @param fullPaymentId 
     * @param transfers 
     * @param config 
     * @param browserNode 
     */
    public async transfersToPayment(
        fullPaymentId: string,
        transfers: FullTransferState[],
        config: HypernetConfig,
        browserNode: BrowserNode): Promise<Payment> {

        // const signerAddress = getSignerAddressFromPublicIdentifier(context.publicIdentifier);

        let [domain, paymentType, id] = fullPaymentId.split(":");
        if (domain != config.hypernetProtocolDomain) {
            throw new Error(`Invalid payment domain: ${domain}`);
        }

        if (id == "" || id == null) {
            throw new Error(`Missing id component of paymentId`);
        }

        const sortedTransfers = await this.sortTransfers(fullPaymentId, transfers, browserNode);

        // Determine the state of the payment. All transfers we've been given are
        // "Active", therefore, not resolved. So we don't need to figure out if
        // the transfer is resolved, we know it's not.
        // Given that info, the payment state is never going to be Finalized,
        // because those transfers disappear.

        let paymentState = EPaymentState.Proposed;
        if (sortedTransfers.insuranceTransfer != null &&
            sortedTransfers.parameterizedTransfer == null) {
            paymentState = EPaymentState.Staked;
        }
        else if (sortedTransfers.insuranceTransfer != null &&
            sortedTransfers.parameterizedTransfer != null) {
            paymentState = EPaymentState.Approved;
        }

        // TODO: Figure out how to determine if the payment is Disputed

        if (paymentType == EPaymentType.Pull) {
            return this.transfersToPullPayment(
                id,
                sortedTransfers.metadata.to,
                sortedTransfers.metadata.from,
                paymentState,
                sortedTransfers,
                sortedTransfers.offerTransfer.meta);
        } else if (paymentType == EPaymentType.Push) {
            return this.transfersToPushPayment(
                id,
                sortedTransfers.metadata.to,
                sortedTransfers.metadata.from,
                paymentState,
                sortedTransfers,
                sortedTransfers.offerTransfer.meta);
        } else {
            throw new Error(`Unknown`)
        }
    }

    /**
     * Given an array of Vector transfers, return the corresponding Hypernet Payments
     * @param transfers 
     * @param config 
     * @param context 
     * @param browserNode 
     */
    public async transfersToPayments(
        transfers: FullTransferState[], 
        config: HypernetConfig,
        context: InitializedHypernetContext,
        browserNode: BrowserNode): Promise<Payment[]> {

        // First, we are going to sort the transfers into buckets based on their payment_id
        let transfersByPaymentId = new Map<string, FullTransferState[]>();
        for (let transfer of transfers) {
            const paymentId = transfer.meta.paymentId;

            // Get the existing array of payments. Initialize it if it's not there.
            let transferArray = transfersByPaymentId.get(paymentId);
            if (transferArray == undefined) {
                transferArray = [];
                transfersByPaymentId.set(paymentId, transferArray);
            }

            transferArray.push(transfer);
        }

        // Now we have the transfers sorted by their payment ID.
        // Loop over them and convert them to proper payments.
        // This is all async, so we can do the whole thing in parallel.
        const paymentPromises = new Array<Promise<Payment>>();
        transfersByPaymentId.forEach(async (transferArray, paymentId) => {
            const payment = this.transfersToPayment(
                paymentId,
                transferArray,
                config,
                browserNode);

            paymentPromises.push(payment);
        });
        
        // Convert all the transfers to payments
        const payments = await Promise.all(paymentPromises);

        return payments;
    }

    /**
     * 
     * @param transfer 
     */
    public getTransferType(transfer: FullTransferState): ETransferType {
        // Have to jump through some hoops here
        // TODO: Fix this.
        return ETransferType.Offer;
    }

    /**
     * 
     * @param paymentId 
     * @param transfers 
     * @param browserNode 
     */
    public async sortTransfers(
        paymentId: string,
        transfers: FullTransferState[],
        browserNode: BrowserNode): Promise<SortedTransfers> {

        // We need to do a lookup for non-active transfers for the payment ID.
        // TODO
        // let inactiveTransfers = await browserNode.getTransfers((transfer) => {return transfer.meta.paymentId == fullPaymentId;});
        // transfers.concat(inactiveTransfers);

        const offerTransfers = transfers.filter((val) => {
            return this.getTransferType(val) == ETransferType.Offer;
        });
        
        const insuranceTransfers = transfers.filter((val) => {
            return this.getTransferType(val) == ETransferType.Insurance;
        });
        
        const parameterizedTransfers = transfers.filter((val) => {
            return this.getTransferType(val) == ETransferType.Parameterized;
        });

        const pullTransfers = transfers.filter((val) => {
            return this.getTransferType(val) == ETransferType.PullRecord;
        });

        const unrecognizedTransfers = transfers.filter((val) => {
            return this.getTransferType(val) == ETransferType.Unrecognized;
        });

        if (unrecognizedTransfers.length > 0) {
            throw new Error("Payment includes unrecognized transfer types!")
        }

        if (offerTransfers.length != 1) {
            // TODO: this could be handled more elegantly; if there's other payments
            // but no offer, it's still a valid payment
            throw new Error("Invalid payment, no offer transfer!")
        }
        const offerTransfer = offerTransfers[0];

        let insuranceTransfer: FullTransferState | null = null;
        if (insuranceTransfers.length == 1) {
            insuranceTransfer = insuranceTransfers[0];
        } else if (insuranceTransfers.length > 1) {
            throw new Error("Invalid payment, too many insurance transfers!");
        }

        let parameterizedTransfer: FullTransferState | null = null;
        if (parameterizedTransfers.length == 1) {
            parameterizedTransfer = parameterizedTransfers[0];
        } else if (parameterizedTransfers.length > 1) {
            throw new Error("Invalid payment, too many parameterized transfers!");
        }

        return new SortedTransfers(offerTransfer,
            insuranceTransfer,
            parameterizedTransfer,
            pullTransfers,
            offerTransfer.meta);
    }
}

export class SortedTransfers implements ISortedTransfers {
    constructor(public offerTransfer: FullTransferState,
        public insuranceTransfer: FullTransferState | null,
        public parameterizedTransfer: FullTransferState | null,
        public pullRecordTransfers: FullTransferState[],
        public metadata: IHypernetTransferMetadata) { }
}