import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import { BigNumber, HypernetConfig, HypernetContext, HypernetLink, IHypernetTransferMetadata, InitializedHypernetContext, Payment, PublicIdentifier, PullAmount, PullPayment, PushPayment } from "@interfaces/objects";
import { IBrowserNodeProvider, IConfigProvider, IContextProvider, IPaymentUtils, IVectorUtils } from "@interfaces/utilities";
import { FullTransferState, NodeResponses } from "@connext/vector-types";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import moment from "moment";
import { BrowserNode } from "@connext/vector-browser-node";
import { EthereumAddress, PublicKey } from "@interfaces/objects";
import { SortedTransfers } from "@implementations/utilities";

export class PaymentRepository implements IPaymentRepository {

    constructor(
        protected browserNodeProvider: IBrowserNodeProvider,
        protected vectorUtils: IVectorUtils,
        protected configProvider: IConfigProvider,
        protected contextProvider: IContextProvider,
        protected paymentUtils: IPaymentUtils
    ) { }

    public async createPushPayment(
        counterPartyAccount: PublicIdentifier,
        amount: BigNumber,
        expirationDate: moment.Moment,
        requiredStake: BigNumber,
        paymentToken: EthereumAddress,
        disputeMediator: PublicKey): Promise<Payment> {

        const browserNodePromise = await this.browserNodeProvider.getBrowserNode();
        const configPromise = await this.configProvider.getConfig();
        const contextPromise = await this.contextProvider.getInitializedContext();

        let [browserNode,
            config,
            context] = await Promise.all([browserNodePromise,
                configPromise,
                contextPromise]);

        // Create a null transfer, with the terms of the payment in the metadata.
        const paymentId = await this.paymentUtils.createPaymentId(EPaymentType.Push);    
        const transfer = await this.vectorUtils.createNullTransfer(counterPartyAccount, {
                paymentId: paymentId,
                creationDate: moment().unix(),
                to: counterPartyAccount,
                from: context.account,
                requiredStake: requiredStake.toString(),
                paymentAmount: amount.toString(),
                expirationDate: expirationDate,
                paymentToken: paymentToken,
                disputeMediator: disputeMediator
            } as IHypernetTransferMetadata);

        // Return the payment
        const payment = this.getPaymentByTransfers(paymentId,
            [transfer],
            config,
            browserNode);
        
        return payment;
    }

    public getPushPaymentByTransfers(id: string,
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

        return new PushPayment(id,
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

    public getPullPaymentByTransfers(id: string,
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

    public async getPaymentByTransfers(
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

        const sortedTransfers = await this.vectorUtils.sortTransfers(fullPaymentId, transfers, browserNode);

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
            return this.getPullPaymentByTransfers(id,
                sortedTransfers.metadata.to,
                sortedTransfers.metadata.from,
                paymentState,
                sortedTransfers,
                sortedTransfers.offerTransfer.meta);
        } else if (paymentType == EPaymentType.Push) {
            return this.getPushPaymentByTransfers(id,
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
    public async getPaymentsByTransfers(
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
            const payment = this.getPaymentByTransfers(paymentId,
                transferArray,
                config,
                browserNode);

            paymentPromises.push(payment);
        });
        
        // Convert all the transfers to payments
        const payments = await Promise.all(paymentPromises);

        return payments;
    }

    public async getPaymentsById(paymentIds: string[]): Promise<Map<string, Payment>> {
        const browserNodePromise = await this.browserNodeProvider.getBrowserNode();
        const channelAddressPromise = await this.vectorUtils.getRouterChannelAddress();
        const configPromise = await this.configProvider.getConfig();
        const contextPromise = await this.contextProvider.getInitializedContext();

        let [browserNode,
            channelAddress,
            config,
            context] = await Promise.all([browserNodePromise,
                channelAddressPromise,
                configPromise,
                contextPromise]);

        const activeTransfersRes = await browserNode.getActiveTransfers({ channelAddress: channelAddress });

        if (activeTransfersRes.isError) {
            const error = activeTransfersRes.getError()
            throw error;
        }

        const activeTransfers = activeTransfersRes.getValue().filter((val) => {
            return paymentIds.includes(val.meta.paymentId);
        });

        const payments = await this.getPaymentsByTransfers(activeTransfers, config, context, browserNode)

        return payments.reduce((map, obj) => {
            map.set(obj.id, obj);
            return map;
        }, new Map<string, Payment>());
    }
}