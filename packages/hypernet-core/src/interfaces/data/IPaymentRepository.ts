import { ILinkRepository } from "@interfaces/data";
import { BigNumber, HypernetConfig, HypernetContext, HypernetLink, IHypernetTransferMetadata, InitializedHypernetContext, Payment, PublicIdentifier, PullAmount, PullPayment, PushPayment } from "@interfaces/objects";
import { IBrowserNodeProvider, IConfigProvider, IContextProvider, IPaymentUtils, IVectorUtils } from "@interfaces/utilities";
import { FullTransferState, NodeResponses } from "@connext/vector-types";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import moment from "moment";
import { BrowserNode } from "@connext/vector-browser-node";
import { EthereumAddress, PublicKey } from "@interfaces/objects";
import { SortedTransfers } from "@implementations/utilities";

export interface IPaymentRepository {
    getPaymentsById(paymentIds: string[]): Promise<Map<string, Payment>>;
    getPaymentsByTransfers(transfers: FullTransferState[], config: HypernetConfig, context: InitializedHypernetContext, browserNode: BrowserNode): Promise<Payment[]>;
    getPaymentByTransfers(fullPaymentId: string, transfers: FullTransferState[], config: HypernetConfig, browserNode: BrowserNode): Promise<Payment>;

    getPullPaymentByTransfers(id: string,
        to: PublicIdentifier,
        from: PublicIdentifier,
        state: EPaymentState,
        sortedTransfers: SortedTransfers,
        metadata: IHypernetTransferMetadata): PullPayment;

    getPushPaymentByTransfers(id: string,
        to: PublicIdentifier,
        from: PublicIdentifier,
        state: EPaymentState,
        sortedTransfers: SortedTransfers,
        metadata: IHypernetTransferMetadata): PushPayment;
    
    /**
     * Creates a push payment and returns it. Nothing moves until
     * the payment is accepted; the payment will return with the
     * "PROPOSED" status. This function just creates an OfferTransfer.
     */
    createPushPayment(
        counterPartyAccount: PublicIdentifier,
        amount: BigNumber,
        expirationDate: moment.Moment,
        requiredStake: BigNumber,
        paymentToken: EthereumAddress,
        disputeMediator: PublicKey): Promise<Payment>;
}