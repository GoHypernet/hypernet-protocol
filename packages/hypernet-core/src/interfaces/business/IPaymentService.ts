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
} from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 * @todo delete this entirely?
 */
export interface IPaymentService {
  
  sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey): Promise<Payment>

  requestPayment(channelId: string, amount: BigNumber): Promise<Payment>;

  paymentPosted(paymentId: string): Promise<void>;

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