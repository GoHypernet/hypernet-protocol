import { Payment, EthereumAddress, PublicIdentifier, MerchantUrl, PaymentId } from "@hypernetlabs/objects";
import {
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  PaymentFinalizeError,
  RouterChannelUnknownError,
  VectorError,
  BlockchainUnavailableError,
  PaymentCreationError,
  BalancesUnavailableError,
  InvalidPaymentError,
  PaymentStakeError,
  TransferCreationError,
  TransferResolutionError,
} from "@hypernetlabs/objects";
import { ResultAsync, Result } from "neverthrow";
import { BigNumber } from "ethers";

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
   * @param merchantUrl the registered URL for the merchant that will resolve any disputes.
   */
  authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: number,
    deltaAmount: string,
    deltaTime: number,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    merchantUrl: MerchantUrl,
  ): ResultAsync<Payment, PaymentCreationError | LogicalError | InvalidParametersError>;

  /**
   * Record a pull against a Pull Payment's authorized funds. Doesn't actually
   * move any money.
   */
  pullFunds(
    paymentId: PaymentId,
    amount: BigNumber,
  ): ResultAsync<
    Payment,
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | PaymentCreationError
  >;

  /**
   * Send funds to another person.
   * @param counterPartyAccount the account we wish to send funds to
   * @param amount the amount of funds to send
   * @param expirationDate the date at which, if not accepted, this payment will expire/cancel
   * @param requiredStake the amount of stake (in Hypertoken) required for the recipient to put up
   * @param paymentToken the address of the payment token we are sending
   * @param merchantUrl the registered URL for the merchant that will resolve any disputes.
   */
  sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: number,
    requiredStake: string,
    paymentToken: EthereumAddress,
    merchantUrl: MerchantUrl,
  ): ResultAsync<Payment, PaymentCreationError | LogicalError | InvalidParametersError>;

  /**
   * Called by the person on the receiving end of a push payment,
   * to accept the terms of the payment and put up the stake.
   */
  acceptOffers(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Result<Payment, AcceptPaymentError>[],
    | InsufficientBalanceError
    | AcceptPaymentError
    | BalancesUnavailableError
    | MerchantValidationError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
  >;

  /**
   * Notify the service that a payment has been posted.
   * @param paymentId
   */
  paymentPosted(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  >;

  /** Notify the service that an insurance payment has resolved
   * @param paymentId
   */
  insuranceResolved(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  >;

  /**
   * Notify the service that a payment has been completed.
   * @param paymentId
   */
  paymentCompleted(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  >;

  /**
   * Notify the service that a pull payment has been posted.
   * @param paymentId
   */
  pullRecorded(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
  >;

  /**
   * Notify the service that a stake has been created/posted.
   * @param paymentId
   */
  stakePosted(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
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
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
  >;

  /**
   * A payment that is in the Accepted state may be disputed up to the expiration date.
   * If the payment is disputed, it is sent to the dispute mediator, who will determine
   * if the payment was proper. The dispute mediator can provide a signature to resolve
   * the insurance transfer for an amount from 0 to the full value of Hypertoken.
   * The method by which the mediator makes this determination is entirely up to the
   * merchant.
   * @param paymentId
   */
  initiateDispute(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | MerchantConnectorError
    | MerchantValidationError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
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
    Payment[],
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  >;
}
