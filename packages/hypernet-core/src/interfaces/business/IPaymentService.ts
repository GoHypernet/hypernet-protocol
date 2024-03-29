import {
  Payment,
  PublicIdentifier,
  GatewayUrl,
  PaymentId,
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
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
  InvalidPaymentIdError,
  EthereumContractAddress,
  PushPayment,
  PullPayment,
  EPaymentType,
  NonFungibleRegistryContractError,
  PersistenceError,
  RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { PaymentInitiationResponse } from "@interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IPaymentService {
  initiateAuthorizeFunds(
    gatewayUrl: GatewayUrl,
    requestIdentifier: string,
    channelAddress: EthereumContractAddress,
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumberString,
    expirationDate: UnixTimestamp,
    deltaAmount: BigNumberString,
    deltaTime: number,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    metadata: string | null,
  ): ResultAsync<
    PaymentInitiationResponse,
    | PaymentCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
  >;

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
    requestIdentifier: string,
    paymentId: PaymentId,
    channelAddress: EthereumContractAddress,
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumberString,
    expirationDate: UnixTimestamp,
    deltaAmount: BigNumberString,
    deltaTime: number,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    gatewayUrl: GatewayUrl,
    gatewaySignature: Signature,
    metadata: string | null,
  ): ResultAsync<
    Payment,
    | PaymentCreationError
    | TransferCreationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidParametersError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
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
    | InvalidPaymentIdError
  >;

  initiateSendFunds(
    gatewayUrl: GatewayUrl,
    requestIdentifier: string,
    channelAddress: EthereumContractAddress,
    toIdentifier: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    metadata: string | null,
  ): ResultAsync<
    PaymentInitiationResponse,
    | PaymentCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
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
    requestIdentifier: string,
    paymentId: PaymentId,
    channelAddress: EthereumContractAddress,
    counterPartyAccount: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    gatewayUrl: GatewayUrl,
    gatewaySignature: Signature,
    metadata: string | null,
  ): ResultAsync<
    Payment,
    | PaymentCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
    | InvalidParametersError
    | NonFungibleRegistryContractError
    | TransferCreationError
    | RegistryFactoryContractError
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
    | InvalidPaymentIdError
    | PaymentCreationError
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
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
    | InvalidPaymentIdError
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
    | InvalidPaymentIdError
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
    | InvalidPaymentIdError
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
    | InvalidPaymentIdError
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
    | InvalidPaymentIdError
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
    | InvalidPaymentIdError
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
    | InvalidPaymentIdError
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
    | InvalidPaymentIdError
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
    | InvalidPaymentIdError
  >;

  /**
   * repairPayments() will attempt to "repair" any payments that are in the Borked state.
   * Borked simply means that something has gone wrong in the payment process, such as out
   * of order resolutions, or most commonly double transfers being created. Recovery is
   * automatically attempted by advancePayments(), but in the off chance that we want to try
   * to do it explicitly, this function exists.
   * Repair basically amounts to canceling bad or excess transfers, but
   * the gateway will also be notified and may be able to help
   * @param paymentIds Payment IDs to attempt repair on
   */
  repairPayments(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Payment[],
    | BlockchainUnavailableError
    | ProxyError
    | VectorError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
    | InvalidPaymentIdError
  >;

  /**
   * getPayment() will return information about the requested payment ID, but only if it's a payment for the gateway
   */
  getPayment(
    paymentId: PaymentId,
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    GetPaymentResponse,
    | BlockchainUnavailableError
    | VectorError
    | InvalidPaymentError
    | InvalidParametersError
    | InvalidPaymentIdError
  >;
}

export class GetPaymentResponse {
  public constructor(
    public payment: PushPayment | PullPayment | null,
    public paymentType: EPaymentType,
  ) {}
}

export const IPaymentServiceType = Symbol.for("IPaymentService");
