import { IPaymentService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import {
    HypernetLink,
    BigNumber,
    Payment,
    EthereumAddress,
    PublicKey,
    ControlClaim,
    HypernetConfig,
    PublicIdentifier,
    Balances,
    PushPayment,
    PullPayment
  } from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import { IContextProvider } from "@interfaces/utilities";

/**
 * PaymentService uses Vector internally to send payments on the requested channel.
 */
export class PaymentService implements IPaymentService {
    constructor(protected linkRepository: ILinkRepository,
        protected contextProvider: IContextProvider) {

    }

    /**
     * Lookup the transfer, and convert it to a payment. Then, publish an RXJS
     * event to the user.
     * @param paymentId 
     * @param transferId 
     */
    public async offerReceived(paymentId: string): Promise<void> {
        
        const paymentsPromise =  this.linkRepository.getPaymentsById([paymentId]);
        const contextPromise = this.contextProvider.getInitializedContext();
        const [payments, context] = await Promise.all([paymentsPromise, contextPromise])
        
        const payment = payments.get(paymentId);

        if (payment == null) {
            throw new Error('Could not get payment!')
        }

        if (payment.state != EPaymentState.Proposed) {
            // The payment has already moved forward, somehow.
            // We don't need to do anything, we probably got called
            // by another instance of the core.
            return;
        }
        
        // Payment state is 'Proposed', continue to handle

        if (payment instanceof PushPayment) {
            // Someone wants to send us a pushPayment, emit up to the api
            context.onPushPaymentProposed.next(payment);
        } else if (payment instanceof PullPayment) {
            // Someone wants to send us a pullPayment, emit up to the api
            context.onPullPaymentProposed.next(payment);
        } else {
            throw new Error("Unknown payment type!");
        }
    }

    /**
     * Sends a payment on the specified channel.
     * @param channelId 
     * @param amount 
     */
    public async sendFunds(
        counterPartyAccount: PublicIdentifier,
        amount: BigNumber,
        expirationDate: moment.Moment,
        requiredStake: BigNumber,
        paymentToken: EthereumAddress,
        disputeMediator: PublicKey): Promise<Payment> {
        
        // new Payment(etc etc)
        // call into vector repository, create null payment
        const payment = this.linkRepository.createPushPayment(counterPartyAccount,
            amount,
            expirationDate,
            requiredStake,
            paymentToken,
            disputeMediator);

        return payment;
    }

    /**
     * Requests a payment on the specified channel.
     * @param channelId 
     * @param amount 
     */
    requestPayment(channelId: string, amount: BigNumber): Promise<Payment> {
        throw new Error("Method not implemented.");
    }
}