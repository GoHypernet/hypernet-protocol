import { ILinkRepository } from "@interfaces/data";
import { BigNumber, HypernetConfig, HypernetContext, HypernetLink, IHypernetTransferMetadata, InitializedHypernetContext, Payment, PublicIdentifier, PullAmount, PullPayment, PushPayment } from "@interfaces/objects";
import { IBrowserNodeProvider, IConfigProvider, IContextProvider, IVectorUtils } from "@interfaces/utilities";
import { v4 as uuidv4 } from "uuid";
import { createlockHash, getRandomBytes32, getSignerAddressFromPublicIdentifier } from "@connext/vector-utils";
import { FullTransferState, NodeResponses } from "@connext/vector-types";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import moment from "moment";
import { BrowserNode } from "@connext/vector-browser-node";

export class VectorLinkRepository implements ILinkRepository {
    constructor(protected browserNodeProvider: IBrowserNodeProvider,
        protected configProvider: IConfigProvider,
        protected contextProvider: IContextProvider,
        protected vectorUtils: IVectorUtils) { }

    public async getHypernetLinks(): Promise<HypernetLink[]> {
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

        const activeTransfers = activeTransfersRes.getValue();

        return await this.transfersToHypernetLinks(activeTransfers, config, context, browserNode);
    }

    /**
     * Given the ID of the link, return it.
     * @param linkId The ID of the link to retrieve
     */
    public async getHypernetLink(counterpartyId: PublicIdentifier): Promise<HypernetLink> {
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
            return val.meta.to == counterpartyId || val.meta.from == counterpartyId;
        });

        // Because of the filter above, this should only produce a single link
        const links = await this.transfersToHypernetLinks(activeTransfers, config, context, browserNode);

        if (links.length == 0) {
            return new HypernetLink(counterpartyId, [], [], [], [], []);
        }

        return links[0];
    }

    // public async createHypernetLink(
    //     consumerAccount: PublicIdentifier,
    //     allowedPaymentTokens: EthereumAddress[],
    //     stakeAmount: BigNumber,
    //     stakeExpiration: number,
    //     disputeMediator: PublicKey): Promise<HypernetLink> {
    //     // Basic setup
    //     const configPromise = this.configProvider.getConfig();
    //     const contextPromise = this.contextProvider.getInitializedContext();
    //     const browserNodePromise = this.browserNodeProvider.getBrowserNode();
    //     const routerChannelAddressPromise = this.vectorUtils.getRouterChannelAddress();

    //     const [config, context, browserNode, routerChannelAddress] =
    //         await Promise.all([configPromise, contextPromise, browserNodePromise,
    //             routerChannelAddressPromise]);

    //     // const blah = await browserNode.requestCollateral({channelAddress: routerChannelAddress,
    //     // assetId: config.hypertokenAddress});
    //     // console.log(blah);

    //     // Now we can create a transaction! When creating a link, the first thing
    //     // to do is create an InsurancePayment on behalf of the provider
    //     const HypernetLinkId = uuidv4();
    //     const insurancePaymentResult = await browserNode.conditionalTransfer({
    //         type: "HashlockTransfer",
    //         channelAddress: routerChannelAddress,
    //         amount: stakeAmount.toString(),
    //         assetId: config.hypertokenAddress,
    //         details: {
    //             lockHash: createlockHash(getRandomBytes32()),
    //             expiry: "0"
    //         },
    //         recipient: consumerAccount,
    //         meta: {
    //             HypernetLinkId: HypernetLinkId,
    //             allowedPaymentTokens: allowedPaymentTokens
    //         }
    //     });

    //     if (insurancePaymentResult.isError) {
    //         console.log(insurancePaymentResult.getError());
    //         throw new Error("Cannot post an insurance payment!");
    //     }

    //     const insurancePayment = insurancePaymentResult.getValue();

    //     const link = new HypernetLink(
    //         HypernetLinkId,
    //         consumerAccount,
    //         context.publicIdentifier,
    //         allowedPaymentTokens,
    //         disputeMediator,
    //         pullSettings,
    //         BigNumber.from(0),
    //         BigNumber.from(0),
    //         BigNumber.from(0),
    //         stakeAmount,
    //         ELinkStatus.STAKED,
    //         routerChannelAddress
    //     );

    //     return link;
    // }

    protected async transfersToHypernetLinks(activeTransfers: FullTransferState[],
        config: HypernetConfig,
        context: InitializedHypernetContext,
        browserNode: BrowserNode): Promise<HypernetLink[]> {
        // First, we are going to sort the transfers into buckets based on their payment_id
        let transfersByPaymentId = new Map<string, FullTransferState[]>();
        for (let transfer of activeTransfers) {
            const paymentId = transfer.meta.paymentId;

            // Get the existing array of payments. Initialize it if it's not there.
            let transferArray = transfersByPaymentId.get(paymentId);
            if (transferArray == undefined) {
                transferArray = [];
                transfersByPaymentId.set(paymentId, transferArray);
            }

            transferArray.push(transfer);
        }
        let linksByCounterpartyId = new Map<PublicIdentifier, HypernetLink>();

        // Now we have the transfers sorted by their payment ID.
        // Loop over them and convert them to proper payments.
        // This is all async, so we can do the whole thing in parallel.
        const paymentPromises = new Array<Promise<Payment>>();
        transfersByPaymentId.forEach(async (transferArray, paymentId) => {
            const payment = this.transfersToPayment(paymentId,
                transferArray,
                config,
                context,
                browserNode);

            paymentPromises.push(payment);
        });
        const payments = await Promise.all(paymentPromises);

        for (const payment of payments) {
            // Now that it's converted, we can stick it in the hypernet link
            let counterpartyId = payment.to == context.publicIdentifier ? payment.from : payment.to;
            let link = linksByCounterpartyId.get(counterpartyId);
            if (link == null) {
                link = new HypernetLink(counterpartyId, [], [], [], [], []);
                linksByCounterpartyId.set(counterpartyId, link);
            }

            link.payments.push(payment);
            if (payment instanceof PullPayment) {
                link.pullPayments.push(payment);
                link.activePullPayments.push(payment);
            }
            else if (payment instanceof PushPayment) {
                link.pushPayments.push(payment);
                link.activePushPayments.push(payment);
            }
            else {
                throw new Error("Unknown payment type!");
            }
        }

        // Convert to an array for return
        return Array.from(linksByCounterpartyId.values());
    }

    protected async transfersToPayment(fullPaymentId: string,
        transfers: FullTransferState[],
        config: HypernetConfig,
        context: InitializedHypernetContext,
        browserNode: BrowserNode): Promise<Payment> {

        //const signerAddress = getSignerAddressFromPublicIdentifier(context.publicIdentifier);

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
            return this.transfersToPullPayment(id,
                sortedTransfers.metadata.to,
                sortedTransfers.metadata.from,
                paymentState,
                sortedTransfers,
                sortedTransfers.offerTransfer.meta);
        }
        else if (paymentType == EPaymentType.Push) {
            return this.transfersToPushPayment(id,
                sortedTransfers.metadata.to,
                sortedTransfers.metadata.from,
                paymentState,
                sortedTransfers,
                sortedTransfers.offerTransfer.meta);
        } else {
            throw new Error(`Unknown`)
        }
    }

    protected transfersToPushPayment(id: string,
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
            BigNumber.from(metadata.paymentAmount)
        );
    }

    protected transfersToPullPayment(id: string,
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
            BigNumber.from(metadata.paymentAmount),
            BigNumber.from(0),
            new Array<PullAmount>()
        );
    }

    protected async createPaymentId(paymentType: EPaymentType): Promise<string> {
        const config = await this.configProvider.getConfig();

        return `${config.hypernetProtocolDomain}:${paymentType}:${uuidv4()}`;
    }

    protected async sortTransfers(paymentId: string,
        transfers: FullTransferState[],
        browserNode: BrowserNode): Promise<SortedTransfers> {

        // We need to do a lookup for non-active transfers for the payment ID.
        // TODO
        // let inactiveTransfers = await browserNode.getTransfers((transfer) => {return transfer.meta.paymentId == fullPaymentId;});
        // transfers.concat(inactiveTransfers);


        const offerTransfers = transfers.filter((val) => {
            return this.vectorUtils.getTransferType(val) == ETransferType.Offer;
        });
        const insuranceTransfers = transfers.filter((val) => {
            return this.vectorUtils.getTransferType(val) == ETransferType.Insurance;
        });
        const parameterizedTransfers = transfers.filter((val) => {
            return this.vectorUtils.getTransferType(val) == ETransferType.Parameterized;
        });
        const pullTransfers = transfers.filter((val) => {
            return this.vectorUtils.getTransferType(val) == ETransferType.PullRecord;
        });
        const unrecognizedTransfers = transfers.filter((val) => {
            return this.vectorUtils.getTransferType(val) == ETransferType.Unrecognized;
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

class SortedTransfers {
    constructor(public offerTransfer: FullTransferState,
        public insuranceTransfer: FullTransferState | null,
        public parameterizedTransfer: FullTransferState | null,
        public pullRecordTransfers: FullTransferState[],
        public metadata: IHypernetTransferMetadata) { }
}