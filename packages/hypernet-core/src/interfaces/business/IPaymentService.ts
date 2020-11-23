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

  /**
   * Notify the service that an offer has been made.
   * @param paymentId 
   * @param transferId 
   */
  offerReceived(paymentId: string): Promise<void>;
}