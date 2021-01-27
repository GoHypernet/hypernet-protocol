import { Payment, EthereumAddress, PublicKey, PublicIdentifier, ResultAsync, Result } from "@interfaces/objects";
import { NodeError } from "@connext/vector-types";
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
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error>;

  /**
   * Called by the person on the receiving end of a push payment,
   * to accept the terms of the payment and put up the stake.
   */
  acceptFunds(
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
