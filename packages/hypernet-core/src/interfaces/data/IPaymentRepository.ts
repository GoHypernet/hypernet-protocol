import {
  PublicIdentifier,
  PullPayment,
  PushPayment,
  PaymentId,
  TransferId,
  GatewayUrl,
  PaymentFinalizeError,
  VectorError,
  PaymentCreationError,
  BlockchainUnavailableError,
  TransferResolutionError,
  InvalidPaymentError,
  InvalidParametersError,
  PaymentStakeError,
  TransferCreationError,
  BigNumberString,
  UnixTimestamp,
  Signature,
  ChainId,
  InvalidPaymentIdError,
  EthereumContractAddress,
  EthereumAccountAddress,
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
    Map<PaymentId, PushPayment | PullPayment>,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | InvalidPaymentIdError
  >;

  /**
   * Creates a push payment and returns it. Nothing moves until
   * the payment is accepted; the payment will return with the
   * "PROPOSED" status. This function just creates an OfferTransfer.
   */
  createPushPayment(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
    counterPartyAccount: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    gatewayUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<
    PushPayment,
    | PaymentCreationError
    | TransferCreationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;

  createPullPayment(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
    counterPartyAccount: PublicIdentifier,
    maximumAmount: BigNumberString, // TODO: amounts should be consistently use BigNumber
    deltaTime: number,
    deltaAmount: BigNumberString, // TODO: amounts should be consistently use BigNumber
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString, // TODO: amounts should be consistently use BigNumber
    paymentToken: EthereumContractAddress,
    gatewayUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<
    PullPayment,
    | PaymentCreationError
    | TransferCreationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;

  createPullRecord(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<PullPayment, PaymentCreationError>;

  /**
   * Provides assets for a given list of payment ids.
   * Internally, this is what actually creates the ParameterizedPayment with Vector.
   * @param paymentId
   */
  provideAsset(
    paymentId: PaymentId,
  ): ResultAsync<
    PushPayment | PullPayment,
    | BlockchainUnavailableError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | InvalidPaymentIdError
  >;

  /**
   * Provides stake for a given payment id
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentId
   */
  provideStake(
    paymentId: PaymentId,
    gatewayAddress: EthereumAccountAddress,
  ): ResultAsync<
    PushPayment | PullPayment,
    | BlockchainUnavailableError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | InvalidPaymentIdError
    | PaymentCreationError
  >;

  /**
   * Finalizes/confirms a payment
   * Internally, this is what actually calls resolve() on the Vector transfer -
   * be it a insurancePayments or parameterizedPayments.
   * @param paymentId
   */
  acceptPayment(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<
    PushPayment | PullPayment,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
    | PaymentFinalizeError
    | InvalidPaymentIdError
  >;

  resolveInsurance(
    paymentId: PaymentId,
    transferId: TransferId,
    amount: BigNumberString,
    gatewaySignature: Signature | null,
  ): ResultAsync<void, TransferResolutionError>;

  /**
   * This method will resolve the offer transfer for a payment
   * @param payment the payment to finalize
   */
  finalizePayment(
    payment: PushPayment | PullPayment,
  ): ResultAsync<
    void,
    TransferResolutionError | VectorError | BlockchainUnavailableError
  >;

  addReservedPaymentId(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, never>;

  getReservedPaymentIdByRequestId(
    requestId: string,
  ): ResultAsync<PaymentId | null, never>;
}

export const IPaymentRepositoryType = Symbol.for("IPaymentRepository");
