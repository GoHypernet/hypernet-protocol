import {
  HypernetLink,
  BigNumber,
  EthereumAddress,
  PublicKey,
  ControlClaim,
  PublicIdentifier,
  Balances,
  Payment,
  PushPayment,
  PullPayment,
  ResultAsync,
} from "@interfaces/objects";
import { Subject } from "rxjs";
import * as moment from "moment";
import { EBlockchainNetwork } from "./types";
import { CoreUninitializedError } from "./objects/errors";

/**
 * HypernetCore is a single instance of the Hypernet Protocol, representing a single
 * user account. The user can be /both/ a consumer and a provider.
 */
export interface IHypernetCore {
  initialized(): Promise<void>;

  /**
   * Probably can be removed, but leaving as a reminder in case we need to solve
   * the multiple-instance-of-Hypernet-core issue
   */
  inControl(): boolean;

  /**
   * This returns the linked Ethereum accounts via your installed wallet (ie: Metamask)
   */
  getEthereumAccounts(): Promise<EthereumAddress[]>;

  /**
   * This must be called before most other calls; it is used to specify what account addres
   * hypernet core will be representing.
   * @param account A public identifier that says who this instance of HypernetCore is representing.
   */
  initialize(account: PublicIdentifier): Promise<void>;

  /**
   * Gets the public id of the Hypernet Core user account. If the core is not initialized,
   * it will throw an error
   * @dev currently this matches the Vector pubId
   */
  getPublicIdentifier(): ResultAsync<PublicIdentifier, CoreUninitializedError>;

  /**
   * This function will load HypernetCore with funds. It should be called for each type of asset you want to use.
   * Can be called by either party (provider or consumer); internally, deposits into the router channel.
   * @param assetAddress The Ethereum address of the token you want to deposit. These can be ETH, HyperToken, Dai, or any othe supported payment token.
   * @param amount The amount of funds (in wei) that you are depositing
   * @dev this creates a transaction on the blockchain!
   */
  depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<Balances>;

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
  ): Promise<Balances>;

  /**
   * Returns the balance account, including funds within
   * the general channel, and funds locked inside transfers within the channel.
   */
  getBalances(): Promise<Balances>;

  /**
   * Returns all Hypernet Ledger for the user
   */
  getLinks(): Promise<HypernetLink[]>;

  /**
   * Returns all active Hypernet Ledgers for the user
   * An active link contains an incomplete/non-finalized transfer.
   */
  getActiveLinks(): Promise<HypernetLink[]>;

  /**
   * Returns the Hypernet Ledger for the user with the specified counterparty
   */
  getLinkByCounterparty(counterPartyAccount: PublicIdentifier): Promise<HypernetLink>;

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
   */
  sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment>;

  /**
   * authorizeFunds() sets up a pull payment.
   * @param
   */
  authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment>;

  /**
   * For a specified payment, puts up stake to accept the payment
   * @param paymentId the payment ID to accept funds
   */
  acceptFunds(paymentIds: string[]): ResultAsync<Payment, Error>;

  /**
   * Sends the parameterized payment internally for payments in state "Staked".
   * Internally, calls paymentService.stakePosted()
   * @param paymentIds the list of payment ids for which to complete the payments for
   */
  completePayments(paymentIds: string[]): Promise<void>;

  /**
   * Pulls an incremental amount from an authorized payment
   * @param paymentId: The authorized payment ID to pull from.
   * @param amount: The amount to pull. The token type has already been baked in.
   */
  pullFunds(paymentId: string, amount: BigNumber): Promise<Payment>;

  /**
   * Finalized an authorized payment with the final payment amount.
   * @param paymentId the payment ID to finalize
   * @param finalAmount the total payment amount to pull
   */
  finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink>;

  /**
   * Finalize a push-payment; internally, resolves the ParameterizedPayment transfer
   * @param paymentId the payment to finalize
   */
  finalizePushPayment(paymentId: string): Promise<void>;

  /**
   * Called by the consumer to attempt to claim some or all of the stake within a particular insurance payment.
   * @param paymentId the payment ID to dispute
   * @metadata the mediator-specific metadata to provide
   */
  initiateDispute(paymentId: string, metadata: string): Promise<HypernetLink>;

  /**
   * Only used for development purposes!
   * @param amount
   */
  mintTestToken(amount: BigNumber): Promise<void>;

  /**
   * Observables for seeing what's going on
   */
  onControlClaimed: Subject<ControlClaim>;
  onControlYielded: Subject<ControlClaim>;
  onPushPaymentProposed: Subject<PushPayment>;
  onPullPaymentProposed: Subject<PullPayment>;
  onPushPaymentUpdated: Subject<PushPayment>;
  onPullPaymentUpdated: Subject<PullPayment>;
  onPushPaymentReceived: Subject<PushPayment>;
  onPullPaymentApproved: Subject<PullPayment>;
  onBalancesChanged: Subject<Balances>;
}
