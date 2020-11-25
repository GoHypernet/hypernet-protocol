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
    amount: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment>;

  /**
   * Provides assets for a given list of payment ids.
   * Internally, this is what actually creates the ParameterizedPayments with Vector.
   * @param paymentIds
   */
  provideAssets(paymentIds: string[]): Promise<Map<string, Payment>>;
  provideAsset(paymentId: string): Promise<Payment>;

  /**
   * Provides stakes for a given list of payment ids.
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentIds
   */
  provideStakes(paymentIds: string[]): Promise<Map<string, Payment>>;

  /**
   * Finalizes/confirms a list of payments.
   * Internally, this is what actually calls resolve() on Vector transfers -
   * be they insurancePayments or parameterizedPayments.
   * @param paymentIds
   */
  finalizePayments(paymentIds: string[]): Promise<Map<string, Payment>>;
}