import {
  HypernetLink,
  BigNumber,
  EthereumAddress,
  PublicKey,
  ControlClaim,
  PublicIdentifier,
  Balances
} from "@interfaces/objects";
import { Subject } from "rxjs";
import * as moment from "moment";
/**
 * HypernetCore is a single instance of the Hypernet Protocol, representing a single
 * user account. The user can be /both/ a consumer and a provider.
 */
export interface IHypernetCore {
  initialized(): boolean;

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
   * @param privateKey An Ethereum private key associated with an Ethereum address
   */
  initialize(account: PublicIdentifier, privateKey: string): Promise<void>;
  
  /**
   * Gets the public id of the Hypernet Core user account. If the core is not initialized,
   * it will throw an error
   * @dev currently this matches the Vector pubId
   */
  getPublicIdentifier(): Promise<PublicIdentifier>

  /**
   * This function will load HypernetCore with funds. It should be called for each type of asset you want to use.
   * Can be called by either party (provider or consumer); internally, deposits into the router channel.
   * @param assetAddress The Ethereum address of the token you want to deposit. These can be ETH, HyperToken, Dai, or any othe supported payment token.
   * @param amount The amount of funds (in wei) that you are depositing
   * @dev this creates a transaction on the blockchain!
   */
  depositFunds(assetAddress: EthereumAddress, 
    amount: BigNumber): Promise<void>;

  /**
   * This function will withdraw funds from Hypernet core into a specified Ethereum address.
   * @param assetAddress
   * @param amount
   * @param destinationAddress
   */
  withdrawFunds(assetAddress: EthereumAddress, 
    amount: BigNumber, 
    destinationAddress: EthereumAddress): Promise<void>;

  /**
   * Returns the balance account, including funds within
   * the general channel, and funds locked inside transfers within the channel.
   */
  getBalances(): Promise<Balances>;

  /**
   * Returns all Hypernet Ledger for the user
   */
  getLedgers(): Promise<HypernetLink[]>;

  /**
   * Returns all active Hypernet Ledgers for the user
   * An active link contains an incomplete/non-finalized transfer.
   */
  getActiveLedgers(): Promise<HypernetLink[]>;

  /**
   * Returns the Hypernet Ledger for the user with the specified counterparty
   */
  getLedgerByCounterparty(counterPartyAccount: PublicIdentifier): Promise<HypernetLink>
  
  /**
   * sendFunds can only be called by the Consumer. It sends a one-time payment to the provider.
   * Internally, this is a three-step process. First, the consumer will notify the provider of the
   * proposed terms of the payment (amount, required stake, and payment token). If the provider
   * accepts these terms, they will create an insurance payment for the stake, and then the consumer
   * finishes by creating a parameterized payment for the amount. The provider can immediately finalize
   * the payment.
   * @param linkId
   * @param amount
   * @param requiredStake the amount of stake that the provider mus
   * @param paymentToken
   */
  sendFunds(counterPartyAccount: PublicIdentifier, 
    amount: BigNumber,
    expirationDate: moment.Moment, 
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey): Promise<HypernetLink>;

  /** 
   * authorizeFunds() sets up a pull payment.
   * @param
  */
  authorizeFunds(counterPartyAccount: PublicIdentifier, 
    totalAuthorized: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey): Promise<HypernetLink>
    
  /**
   * For a specified payment, puts up stake to accept the payment
   * @param paymentId the payment ID to accept funds
   */
  acceptFunds(paymentId: string): Promise<HypernetLink>;

  /**
   * Pulls an incremental amount from an authorized payment
   * @param paymentId: The authorized payment ID to pull from.
   * @param amount: The amount to pull. The token type has already been baked in.
   */
  pullFunds(paymentId: string,
    amount: BigNumber): Promise<HypernetLink>;

  /**
   * Finalized an authorized payment with the final payment amount.
   * @param paymentId the payment ID to finalize
   * @param finalAmount the total payment amount to pull
   */
  finalizePullPayment(paymentId: string,
    finalAmount: BigNumber): Promise<HypernetLink>;

  /**
   * Called by the consumer to attempt to claim some or all of the stake within a particular insurance payment.
   * @param paymentId the payment ID to dispute
   * @metadata the mediator-specific metadata to provide
   */
  initiateDispute(paymentId: string,
    metadata: string): Promise<HypernetLink>;

  /**
   * Observables for seeing what's going on
   */
  onControlClaimed: Subject<ControlClaim>;
  onControlYielded: Subject<ControlClaim>;
}