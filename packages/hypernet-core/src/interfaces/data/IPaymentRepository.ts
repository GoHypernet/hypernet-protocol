import moment from "moment";
import { EthereumAddress, PublicKey } from "@interfaces/objects";
import { BigNumber, Payment, PublicIdentifier} from "@interfaces/objects";

export interface IPaymentRepository {
    /**
     * 
     * @param paymentIds 
     */
    getPaymentsByIds(paymentIds: string[]): Promise<Map<string, Payment>>;

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