import { IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository } from "@interfaces/data";
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
import { IConfigProvider, IContextProvider } from "@interfaces/utilities";

/**
 * PaymentService uses Vector internally to send payments on the requested channel.
 */
export class PaymentService implements IPaymentService {
    constructor(protected linkRepository: ILinkRepository,
        protected accountRepository: IAccountsRepository,
        protected contextProvider: IContextProvider,
        protected configProvider: IConfigProvider) {

    }

    /**
     * 
     * @param paymentId 
     */
    public async acceptFunds(paymentIds: string[]): Promise<Payment[]> {
        // Get the payments from the repo, to make sure it can be accepted.
        const config = await this.configProvider.getConfig();
        const payments = await this.linkRepository.getPaymentsById(paymentIds);
        const hypertokenBalance = await this.accountRepository.getBalanceByAsset(config.hypertokenAddress)

        // Loop over the payments and do a sanity check
        // We will also calculate the total required stake
        let totalStakeRequired = BigNumber.from(0);
        
        // Verification & sanity checking
        payments.forEach((payment) => {
            if (payment.state != EPaymentState.Proposed) {
                throw new Error(`Cannot accept payment ${payment.id}, it is not in the Proposed state`);
            }

            totalStakeRequired = totalStakeRequired.add(
                BigNumber.from(payment.requiredStake));
        });

        // Check the balance and make sure you have enough HyperToken to cover it
        if (hypertokenBalance.freeAmount < totalStakeRequired) {
            throw new Error('Not enough Hypertoken to cover provided payments.')
        }
        
        // Create insurance payments
        const updatedPayments = await this.linkRepository.provideStakes(paymentIds);
     
        return Array.from(updatedPayments.values());
    }

    /**
     * Called by the reciever of a parameterized transfer
     */
    public async paymentPosted(paymentId: string): Promise<void> {
        const payments = await this.linkRepository.getPaymentsById([paymentId]);
        const payment = payments.get(paymentId);

        if (payment == null || payment.state != EPaymentState.Approved) {
            throw new Error(`Cannot accept payment ${paymentId}`)
        }

        // If the payment state is approved, we know that it matches our insurance payment
        if (payment instanceof PushPayment) {
            // Resolve the parameterized payment immediately
            await this.linkRepository.finalizePayments([paymentId]);
            
        } else if (payment instanceof PullPayment) {
            // Notify the user that the funds have been approved.
            const context = await this.contextProvider.getContext();
            context.onPullPaymentApproved.next(payment);
        }
    }

    public async pullRecorded(paymentId: string): Promise<void> {
        const payments = await this.linkRepository.getPaymentsById([paymentId]);
        const payment = payments.get(paymentId);
        
        throw new Error('Method not yet implemented')
    }

    public async stakePosted(paymentId: string): Promise<void> {
        const payments = await this.linkRepository.getPaymentsById([paymentId]);
        const payment = payments.get(paymentId);
    
        if (payment == null || payment.state != EPaymentState.Staked) {
            throw new Error(`Invalid payment ${paymentId}, cannot provide payment!`);
        }

        // If the payment state is staked, we know that the proper
        // insurance has been posted.
        await this.linkRepository.provideAssets([paymentId]);
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