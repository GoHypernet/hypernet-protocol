import { EthereumAddress, PublicKey, ResultAsync } from "@interfaces/objects";
import { Payment, PublicIdentifier } from "@interfaces/objects";
import {
  CoreUninitializedError,
  PaymentFinalizeError,
  RouterChannelUnknownError,
  VectorError,
} from "@interfaces/objects/errors";

export interface IPaymentRepository {
  /**
   *
   * @param paymentIds
   */
  getPaymentsByIds(
    paymentIds: string[],
  ): ResultAsync<Map<string, Payment>, RouterChannelUnknownError | CoreUninitializedError | VectorError>;

  /**
   * Creates a push payment and returns it. Nothing moves until
   * the payment is accepted; the payment will return with the
   * "PROPOSED" status. This function just creates an OfferTransfer.
   */
  createPushPayment(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: number,
    requiredStake: string,
    paymentToken: EthereumAddress,
    merchantUrl: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;

  createPullPayment(
    counterPartyAccount: PublicIdentifier,
    maximumAmount: string, // TODO: amounts should be consistently use BigNumber
    deltaTime: number,
    deltaAmount: string, // TODO: amounts should be consistently use BigNumber
    expirationDate: number,
    requiredStake: string, // TODO: amounts should be consistently use BigNumber
    paymentToken: EthereumAddress,
    merchantUrl: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;

  createPullRecord(
    paymentId: string,
    amount: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;

  /**
   * Provides assets for a given list of payment ids.
   * Internally, this is what actually creates the ParameterizedPayment with Vector.
   * @param paymentId
   */
  provideAsset(
    paymentId: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;

  /**
   * Provides stake for a given payment id
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentId
   */
  provideStake(
    paymentId: string,
    merchantPublicKey: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;

  /**
   * Finalizes/confirms a payment
   * Internally, this is what actually calls resolve() on the Vector transfer -
   * be it a insurancePayments or parameterizedPayments.
   * @param paymentId
   */
  finalizePayment(
    paymentId: string,
    amount: string,
  ): ResultAsync<
    Payment,
    PaymentFinalizeError | RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  >;
}
