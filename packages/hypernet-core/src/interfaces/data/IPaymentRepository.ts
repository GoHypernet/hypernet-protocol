import moment from "moment";
import { EthereumAddress, PublicKey } from "@interfaces/objects";
import { BigNumber, Payment, PublicIdentifier } from "@interfaces/objects";

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
    amount: string,
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment>;

  /**
   * Provides assets for a given list of payment ids.
   * Internally, this is what actually creates the ParameterizedPayment with Vector.
   * @param paymentId
   */
  provideAsset(paymentId: string): Promise<Payment>;

  /**
   * Provides stake for a given payment id
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentId
   */
  provideStake(paymentId: string): Promise<Payment>;

  /**
   * Finalizes/confirms a payment
   * Internally, this is what actually calls resolve() on the Vector transfer -
   * be it a insurancePayments or parameterizedPayments.
   * @param paymentId
   */
  finalizePayment(paymentId: string, amount: string): Promise<Payment>;
}
