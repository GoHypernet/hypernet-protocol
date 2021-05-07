import { BigNumber } from "ethers";
import { ResultAsync, Result } from "neverthrow";
import { Subject } from "rxjs";

import { Balances } from "@objects/Balances";
import { ControlClaim } from "@objects/ControlClaim";
import {
  AcceptPaymentError,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  InsufficientBalanceError,
  LogicalError,
  PersistenceError,
  RouterChannelUnknownError,
  VectorError,
  MerchantValidationError,
  MerchantConnectorError,
  InvalidPaymentError,
  InvalidParametersError,
  TransferResolutionError,
  ProxyError,
} from "@objects/errors";
import { EthereumAddress } from "@objects/EthereumAddress";
import { HypernetLink } from "@objects/HypernetLink";
import { MerchantUrl } from "@objects/MerchantUrl";
import { Payment } from "@objects/Payment";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { PullPayment } from "@objects/PullPayment";
import { PushPayment } from "@objects/PushPayment";
import { Signature } from "@objects/Signature";

/**
 * HypernetCore is a single instance of the Hypernet Protocol, representing a single
 * user account. The user can be /both/ a consumer and a provider.
 */
export interface IHypernetCore {
  initialized(): Result<boolean, LogicalError>;

  waitInitialized(): ResultAsync<void, LogicalError>;

  /**
   * Probably can be removed, but leaving as a reminder in case we need to solve
   * the multiple-instance-of-Hypernet-core issue
   */
  inControl(): Result<boolean, LogicalError>;

  /**
   * This returns the linked Ethereum accounts via your installed wallet (ie: Metamask)
   */
  getEthereumAccounts(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError
  >;

  /**
   * This must be called before most other calls; it is used to specify what account addres
   * hypernet core will be representing.
   * @param account The address that says who this instance of HypernetCore is representing.
   */
  initialize(account: EthereumAddress): ResultAsync<void, LogicalError>;

  /**
   * Gets the public id of the Hypernet Core user account. If the core is not initialized,
   * it will throw an error
   * @dev currently this matches the Vector pubId
   */
  getPublicIdentifier(): ResultAsync<PublicIdentifier, never | ProxyError>;

  /**
   * This function will load HypernetCore with funds. It should be called for each type of asset you want to use.
   * Can be called by either party (provider or consumer); internally, deposits into the router channel.
   * @param assetAddress The Ethereum address of the token you want to deposit. These can be ETH, HyperToken, Dai, or any othe supported payment token.
   * @param amount The amount of funds (in wei) that you are depositing
   * @dev this creates a transaction on the blockchain!
   */
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  >;

  /**
   * This function will withdraw funds from Hypernet core into a specified Ethereum address.
   * @param assetAddress
   * @param amount
   * @param destinationAddress
   */
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  >;

  /**
   * Returns the balance account, including funds within
   * the general channel, and funds locked inside transfers within the channel.
   */
  getBalances(): ResultAsync<Balances, BalancesUnavailableError>;

  /**
   * Returns all Hypernet Ledger for the user
   */
  getLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | VectorError | Error
  >;

  /**
   * Returns all active Hypernet Ledgers for the user
   * An active link contains an incomplete/non-finalized transfer.
   */
  getActiveLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | VectorError | Error
  >;

  /**
   * Returns the Hypernet Ledger for the user with the specified counterparty
   */
  getLinkByCounterparty(
    counterPartyAccount: PublicIdentifier,
  ): Promise<HypernetLink>;

  /**
   * sendFunds can only be called by the Consumer. It sends a one-time payment to the provider.
   * Internally, this is a three-step process. First, the consumer will notify the provider of the
   * proposed terms of the payment (amount, required stake, and payment token). If the provider
   * accepts these terms, they will create an insurance payment for the stake, and then the consumer
   * finishes by creating a parameterized payment for the amount. The provider can immediately finalize
   * the payment.
   * @param linkId
   * @param amount
   * @param requiredStake the amount of stake that the provider must put up as part of the insurancepayment
   * @param paymentToken
   * @param merchantUrl the registered URL for the merchant that will resolve any disputes.
   */
  sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: number,
    requiredStake: string,
    paymentToken: EthereumAddress,
    merchantUrl: MerchantUrl,
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error>;

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
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error>;

  /**
   * For a specified payment, puts up stake to accept the payment
   * @param paymentId the payment ID to accept funds
   */
  acceptOffers(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Result<Payment, AcceptPaymentError>[],
    InsufficientBalanceError | AcceptPaymentError
  >;

  /**
   * Pulls an incremental amount from an authorized payment
   * @param paymentId: The authorized payment ID to pull from.
   * @param amount: The amount to pull. The token type has already been baked in.
   */
  pullFunds(
    paymentId: PaymentId,
    amount: BigNumber,
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error>;

  /**
   * Finalized an authorized payment with the final payment amount.
   * @param paymentId the payment ID to finalize
   * @param finalAmount the total payment amount to pull
   */
  finalizePullPayment(
    paymentId: PaymentId,
    finalAmount: BigNumber,
  ): Promise<HypernetLink>;

  /**
   * Called by the consumer to attempt to claim some or all of the stake within a particular insurance payment.
   * @param paymentId the payment ID to dispute
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
   * Only used for development purposes!
   * @param amount
   */
  mintTestToken(
    amount: BigNumber,
  ): ResultAsync<void, BlockchainUnavailableError>;

  authorizeMerchant(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantValidationError>;

  getAuthorizedMerchants(): ResultAsync<
    Map<MerchantUrl, Signature>,
    PersistenceError
  >;

  closeMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError>;

  providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError>;

  /**
   * Observables for seeing what's going on
   */
  onControlClaimed: Subject<ControlClaim>;
  onControlYielded: Subject<ControlClaim>;
  onPushPaymentSent: Subject<PushPayment>;
  onPullPaymentSent: Subject<PullPayment>;
  onPushPaymentUpdated: Subject<PushPayment>;
  onPullPaymentUpdated: Subject<PullPayment>;
  onPushPaymentReceived: Subject<PushPayment>;
  onPullPaymentReceived: Subject<PullPayment>;
  onPushPaymentDelayed: Subject<PushPayment>;
  onPullPaymentDelayed: Subject<PullPayment>;
  onBalancesChanged: Subject<Balances>;
  onMerchantAuthorized: Subject<MerchantUrl>;
  onAuthorizedMerchantUpdated: Subject<MerchantUrl>;
  onAuthorizedMerchantActivationFailed: Subject<MerchantUrl>;
  onMerchantIFrameDisplayRequested: Subject<MerchantUrl>;
  onMerchantIFrameCloseRequested: Subject<MerchantUrl>;
  onInitializationRequired: Subject<void>;
  onPrivateCredentialsRequested: Subject<void>;
}
