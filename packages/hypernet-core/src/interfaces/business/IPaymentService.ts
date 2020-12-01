import { BigNumber, Payment, EthereumAddress, PublicKey, PublicIdentifier } from "@interfaces/objects";
import { Result } from "@connext/vector-types";

/**
 *
 */
export interface IPaymentService {
  /**
   * Send funds to another person.
   * @param counterPartyAccount the account we wish to send funds to
   * @param amount the amount of funds to send
   * @param expirationDate the date at which, if not accepted, this payment will expire/cancel
   * @param requiredStake the amount of stake (in Hypertoken) required for the recipient to put up
   * @param paymentToken the address of the payment token we are sending
   * @param disputeMediator the address of the mediator for the staked Hypertoken
   */
  sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment>;

  /**
   * Called by the person on the receiving end of a push payment,
   * to accept the terms of the payment and put up the stake.
   */
  acceptFunds(paymentIds: string[]): Promise<Result<Payment, Error>[]>;

  /**
   *
   * @param channelId
   * @param amount
   */
  requestPayment(channelId: string, amount: BigNumber): Promise<Payment>;

  /**
   * Notify the service that a payment has been posted.
   * @param paymentId
   */
  paymentPosted(paymentId: string): Promise<void>;

  /**
   * Notify the service that a pull payment has been posted.
   * @param paymentId
   */
  pullRecorded(paymentId: string): Promise<void>;

  /**
   * Notify the service that a stake has been created/posted.
   * @param paymentId
   */
  stakePosted(paymentId: string): Promise<void>;

  /**
   * Notify the service that an offer has been made.
   * @param paymentId
   * @param transferId
   */
  offerReceived(paymentId: string): Promise<void>;
}
