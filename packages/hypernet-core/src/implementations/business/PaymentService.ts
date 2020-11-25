import { IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository } from "@interfaces/data";
import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import {
  BigNumber,
  Payment,
  EthereumAddress,
  PublicKey,
  PublicIdentifier,
  PushPayment,
  PullPayment,
} from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import { IConfigProvider, IContextProvider } from "@interfaces/utilities";

/**
 * PaymentService uses Vector internally to send payments on the requested channel.
 */
export class PaymentService implements IPaymentService {
  constructor(
    protected linkRepository: ILinkRepository,
    protected accountRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
    protected paymentRepository: IPaymentRepository,
  ) {}

  /**
   * Called by the person on the receiving end of a push payment,
   * to accept the terms of the payment and put up the stake.
   * @param paymentIds the payment ids to accept funds for
   */
  public async acceptFunds(paymentIds: string[]): Promise<Payment[]> {
    // Get the payments from the repo, to make sure they can be accepted.
    const config = await this.configProvider.getConfig();
    const payments = await this.paymentRepository.getPaymentsByIds(paymentIds);
    const hypertokenBalance = await this.accountRepository.getBalanceByAsset(config.hypertokenAddress);

    // Loop over the payments and do a sanity check
    // We will also calculate the total required stake
    let totalStakeRequired = BigNumber.from(0);

    // Verification & sanity checking
    payments.forEach((payment) => {
      if (payment.state !== EPaymentState.Proposed) {
        throw new Error(`Cannot accept payment ${payment.id}, it is not in the Proposed state`);
      }

      totalStakeRequired = totalStakeRequired.add(BigNumber.from(payment.requiredStake));
    });

    // Check the balance and make sure you have enough HyperToken to cover it
    if (hypertokenBalance.freeAmount < totalStakeRequired) {
      throw new Error("Not enough Hypertoken to cover provided payments.");
    }

    // Create insurance payments
    const updatedPayments = await this.paymentRepository.provideStakes(paymentIds);

    return Array.from(updatedPayments.values());
  }

  /**
   * Called by the reciever of a parameterized transfer, AFTER they 
   * have put up stake
   * @param paymentId the payment ID to accept/resolve
   */
  public async paymentPosted(paymentId: string): Promise<void> {
    const payments = await this.paymentRepository.getPaymentsByIds([paymentId]);
    const payment = payments.get(paymentId);

    // Payment state must be in "approved" to finalize
    if (payment == null || payment.state !== EPaymentState.Approved) {
      throw new Error(`Cannot accept payment ${paymentId}`);
    }

    // If the payment state is approved, we know that it matches our insurance payment
    if (payment instanceof PushPayment) {
      // Resolve the parameterized payment immediately
      await this.paymentRepository.finalizePayments([paymentId]);
    } else if (payment instanceof PullPayment) {
      // Notify the user that the funds have been approved.
      const context = await this.contextProvider.getContext();
      context.onPullPaymentApproved.next(payment);
    }
  }

  /**
   *
   * @param paymentId
   */
  public async pullRecorded(paymentId: string): Promise<void> {
    const payments = await this.paymentRepository.getPaymentsByIds([paymentId]);
    const payment = payments.get(paymentId);

    throw new Error("Method not yet implemented");
  }

  /**
   * Notifies the service that a stake has been posted; if verified,
   * then provides assets to the counterparty (ie a parameterizedPayment)
   * @param paymentId
   */
  public async stakePosted(paymentId: string): Promise<void> {
    const payments = await this.paymentRepository.getPaymentsByIds([paymentId]);
    const payment = payments.get(paymentId);

    // Payment state must be in "staked" in order to progress
    if (payment == null || payment.state !== EPaymentState.Staked) {
      throw new Error(`Invalid payment ${paymentId}, cannot provide payment!`);
    }

    // If the payment state is staked, we know that the proper
    // insurance has been posted.
    await this.paymentRepository.provideAssets([paymentId]);
  }

  /**
   * Called when someone has sent us a payment offer.
   * Lookup the transfer, and convert it to a payment. Then, publish an RXJS
   * event to the user.
   * @param paymentId
   * @param transferId
   */
  public async offerReceived(paymentId: string): Promise<void> {
    const paymentsPromise = this.paymentRepository.getPaymentsByIds([paymentId]);
    const contextPromise = this.contextProvider.getInitializedContext();
    const [payments, context] = await Promise.all([paymentsPromise, contextPromise]);

    const payment = payments.get(paymentId);

    if (payment == null) {
      throw new Error("Could not get payment!");
    }

    if (payment.state !== EPaymentState.Proposed) {
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
   * Internally, creates a null/message/offer transfer to communicate
   * with the counterparty and signal a request for a stake.
   * @param channelId
   * @param amount
   */
  public async sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment> {
    const payment = this.paymentRepository.createPushPayment(
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      disputeMediator,
    );

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
