import {
  Payment,
  EthereumAddress,
  PublicKey,
  PublicIdentifier,
  ResultAsync,
  Result,
  BigNumber,
} from "@interfaces/objects";
import { NodeError, VectorError } from "@connext/vector-types";
import {
  AcceptPaymentError,
  CoreUninitializedError,
  InsufficientBalanceError,
  InvalidParametersError,
  InvalidPaymentError,
  LogicalError,
  OfferMismatchError,
  RouterChannelUnknownError,
} from "@interfaces/objects/errors";

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
   * @param disputeMediator the (Ethereum) address of the dispute mediator
   */
  authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: number,
    deltaAmount: string,
    deltaTime: number,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;

  /**
   * Record a pull against a Pull Payment's authorized funds. Doesn't actually
   * move any money.
   */
  pullFunds(
    paymentId: string,
    amount: BigNumber,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;

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
    amount: string,
    expirationDate: number,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error>;

  /**
   * Called by the person on the receiving end of a push payment,
   * to accept the terms of the payment and put up the stake.
   */
  acceptOffers(
    paymentIds: string[],
  ): ResultAsync<Result<Payment, AcceptPaymentError>[], InsufficientBalanceError | AcceptPaymentError>;

  /**
   *
   * @param channelId
   * @param amount
   */
  requestPayment(channelId: string, amount: string): Promise<Payment>;

  /**
   * Notify the service that a payment has been posted.
   * @param paymentId
   */
  paymentPosted(paymentId: string): ResultAsync<void, InvalidParametersError>;

  /**
   * Notify the service that a payment has been completed.
   * @param paymentId
   */
  paymentCompleted(paymentId: string): ResultAsync<void, InvalidParametersError>;

  /**
   * Notify the service that a pull payment has been posted.
   * @param paymentId
   */
  pullRecorded(paymentId: string): ResultAsync<void, InvalidParametersError>;

  /**
   * Notify the service that a stake has been created/posted.
   * @param paymentId
   */
  stakePosted(
    paymentId: string,
  ): ResultAsync<void, CoreUninitializedError | OfferMismatchError | InvalidParametersError>;

  /**
   * Notify the service that an offer has been made.
   * @param paymentId
   * @param transferId
   */
  offerReceived(
    paymentId: string,
  ): ResultAsync<void, LogicalError | RouterChannelUnknownError | CoreUninitializedError | NodeError | Error>;
}
