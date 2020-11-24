import {
  BigNumber,
  Payment,
  EthereumAddress,
  PublicKey,
  PublicIdentifier,
} from "@interfaces/objects";

/**
 *
 */
export interface IPaymentService {
  
  /**
   * 
   * @param counterPartyAccount 
   * @param amount 
   * @param expirationDate 
   * @param requiredStake 
   * @param paymentToken 
   * @param disputeMediator 
   */
  sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey): Promise<Payment>

  /**
   * 
   * @param channelId 
   * @param amount 
   */
  requestPayment(channelId: string, amount: BigNumber): Promise<Payment>;

  /**
   * 
   * @param paymentId 
   */
  paymentPosted(paymentId: string): Promise<void>;

  /**
   * 
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

  /** 
   * Called by the person on the receiving end of a push payment,
   * to accept the terms of the payment and put up the stake.
   */
  acceptFunds(paymentIds: string[]): Promise<Payment[]>;
}