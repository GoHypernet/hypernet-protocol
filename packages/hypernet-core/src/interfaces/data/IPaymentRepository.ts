import {
  EthereumAddress,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  PaymentId,
  MerchantUrl,
} from "@hypernetlabs/objects";
import {
  PaymentFinalizeError,
  RouterChannelUnknownError,
  VectorError,
  PaymentCreationError,
  BlockchainUnavailableError,
  LogicalError,
  TransferResolutionError,
  InvalidPaymentError,
  InvalidParametersError,
  PaymentStakeError,
  TransferCreationError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPaymentRepository {
  /**
   *
   * @param paymentIds
   */
  getPaymentsByIds(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Map<PaymentId, Payment>,
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
  >;

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
    merchantUrl: MerchantUrl,
  ): ResultAsync<PushPayment, PaymentCreationError>;

  createPullPayment(
    counterPartyAccount: PublicIdentifier,
    maximumAmount: string, // TODO: amounts should be consistently use BigNumber
    deltaTime: number,
    deltaAmount: string, // TODO: amounts should be consistently use BigNumber
    expirationDate: number,
    requiredStake: string, // TODO: amounts should be consistently use BigNumber
    paymentToken: EthereumAddress,
    merchantUrl: MerchantUrl,
  ): ResultAsync<PullPayment, PaymentCreationError>;

  createPullRecord(paymentId: PaymentId, amount: string): ResultAsync<Payment, PaymentCreationError>;

  /**
   * Provides assets for a given list of payment ids.
   * Internally, this is what actually creates the ParameterizedPayment with Vector.
   * @param paymentId
   */
  provideAsset(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | BlockchainUnavailableError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | VectorError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  >;

  /**
   * Provides stake for a given payment id
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentId
   */
  provideStake(
    paymentId: PaymentId,
    merchantAddress: EthereumAddress,
  ): ResultAsync<
    Payment,
    | BlockchainUnavailableError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | VectorError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  >;

  /**
   * Finalizes/confirms a payment
   * Internally, this is what actually calls resolve() on the Vector transfer -
   * be it a insurancePayments or parameterizedPayments.
   * @param paymentId
   */
  finalizePayment(
    paymentId: PaymentId,
    amount: string,
  ): ResultAsync<
    Payment,
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | PaymentFinalizeError
    | TransferResolutionError
    | InvalidPaymentError
    | InvalidParametersError
  >;
}
