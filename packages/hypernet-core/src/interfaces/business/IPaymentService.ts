import {
  Payment,
  EthereumAddress,
  PublicIdentifier,
  GatewayUrl,
  PaymentId,
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
  GatewayValidationError,
  PaymentFinalizeError,
  VectorError,
  BlockchainUnavailableError,
  PaymentCreationError,
  BalancesUnavailableError,
  InvalidPaymentError,
  PaymentStakeError,
  TransferCreationError,
  TransferResolutionError,
  UnixTimestamp,
  BigNumberString,
  Signature,
  ProxyError,
} from "@hypernetlabs/objects";
import { ResultAsync, Result } from "neverthrow";

export interface IPaymentService {
  /**
   * Authorizes funds to a specified counterparty, with an amount, rate, & expiration date.
   * @param counterPartyAccount the public identifier of the counterparty to authorize funds to
   * @param totalAuthorized the total amount the counterparty is allowed to "pull"
   * @param expirationDate the latest time in which the counterparty can pull funds. This must be after the full maturation date of totalAuthorized, as calculated via deltaAmount and deltaTime.
   * @param deltaAmount The amount per deltaTime to authorize
   * @param deltaTime the number of seconds after which deltaAmount will be authorized, up to the limit of totalAuthorized.
   * @param requiredStake the amount of stake the counterparyt must put up as insurance
   * @param paymentToken the (Ethereum) address of the payment token
   * @param gatewayUrl the registered URL for the gateway that will resolve any disputes.
   */
  authorizeFunds(
    channelAddress: EthereumAddress,
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumberString,
    expirationDate: UnixTimestamp,
    deltaAmount: BigNumberString,
    deltaTime: number,
    requiredStake: BigNumberString,
    paymentToken: EthereumAddress,
    gatewayUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<
    Payment,
    | PaymentCreationError
    | TransferCreationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;

  /**
   * Record a pull against a Pull Payment's authorized funds. Doesn't actually
   * move any money.
   */
  pullFunds(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<
    Payment,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | BalancesUnavailableError
    | PaymentCreationError
  >;

  /**
   * Send funds to another person.
   * @param counterPartyAccount the account we wish to send funds to
   * @param amount the amount of funds to send
   * @param expirationDate the date at which, if not accepted, this payment will expire/cancel
   * @param requiredStake the amount of stake (in Hypertoken) required for the recipient to put up
   * @param paymentToken the address of the payment token we are sending
   * @param gatewayUrl the registered URL for the gateway that will resolve any disputes.
   */
  sendFunds(
    channelAddress: EthereumAddress,
    counterPartyAccount: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumAddress,
    gatewayUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<
    Payment,
    | PaymentCreationError
    | TransferCreationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;

  /**
   * Called by the person on the receiving end of a push payment,
   * to accept the terms of the payment and put up the stake.
   */
  acceptOffer(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | TransferCreationError
    | VectorError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | PaymentStakeError
    | TransferResolutionError
    | AcceptPaymentError
    | InsufficientBalanceError
  >;

  /**
   * Notify the service that a payment has been posted.
   * @param paymentId
   */
  paymentPosted(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
  >;

  /**
   * Notify the service that an offer transfer has resolved.
   */
  offerResolved(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
  >;

  /** Notify the service that an insurance payment has resolved
   * @param paymentId
   */
  insuranceResolved(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
  >;

  /**
   * Notify the service that a payment has been completed.
   * @param paymentId
   */
  paymentCompleted(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
  >;

  /**
   * Notify the service that a pull payment has been posted.
   * @param paymentId
   */
  pullRecorded(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | BalancesUnavailableError
  >;

  /**
   * Notify the service that a stake has been created/posted.
   * @param paymentId
   */
  stakePosted(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
  >;

  /**
   * Notify the service that an offer has been made.
   * @param paymentId
   * @param transferId
   */
  offerReceived(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | BalancesUnavailableError
  >;

  /**
   * After a payment is accepted, the next step is to resolve the insurance.
   * There are two options for that; it can be resolved for 0 by the user's key,
   * or it can be resolved for more than 0 by the gateway using the gateway's
   * key. In the current system, insurance is resolved by the Gateway, and
   * the whole process is controlled and timed by the gateway, without user
   * input.
   */
  resolveInsurance(
    paymentId: PaymentId,
    amount: BigNumberString,
    gatewaySignature: Signature | null,
  ): ResultAsync<
    Payment,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
  >;

  /**
   * This function will advance the state of the payments if they can or should be.
   * It will provide funds for a staked payment, accept the funds for a paid push payment,
   * and resolve an offer once the insurance has been released.
   * This is used to catch up payments in case an error occurred, or more likely if
   * something happened while you were offline.
   * @param paymentIds
   */
  advancePayments(
    paymentIds: PaymentId[],
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
  >;

  /**
   * recoverPayments() will attempt to "recover" any payments that are in the Borked state.
   * Borked simply means that something has gone wrong in the payment process, such as out
   * of order resolutions, or most commonly double transfers being created. Recovery is
   * automatically attempted by advancePayments(), but in the off chance that we want to try
   * to do it explicitly, this function exists.
   * Recovery basically amounts to canceling bad or excess transfers.
   * @param paymentIds Payment IDs to attempt recovery on
   */
  recoverPayments(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Payment[],
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
  >;
}

export const IPaymentServiceType = Symbol.for("IPaymentService");
