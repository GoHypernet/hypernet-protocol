import {
  HypernetLink,
  Deposit,
  BigNumber,
  Payment,
  EthereumAddress,
  PublicKey,
  PullSettings,
  Stake,
  LinkFinalResult,
  Withdrawal,
  EstablishLinkRequestWithApproval,
  EstablishLinkRequest,
  ControlClaim,
  PublicIdentifier,
  Balances
} from "@interfaces/objects";
import { Subject } from "rxjs";

export interface IHypernetCore {
  initialized(): boolean;
  inControl(): boolean;

  getAccounts(): Promise<string[]>;
  getPublicIdentifier(): Promise<PublicIdentifier>

  /**
   * This must be called before most other calls; it is used to specify what account addres
   * hypernet core will be representing.
   * @param account 
   * @param privateKey 
   */
  initialize(account: string, privateKey: string): Promise<void>;

  /**
   * This function will load HypernetCore with funds. It should be called for each type of asset you want to use.
   * Can be called by either party (provider or consumer); internally, deposits into the router channel.
   * @param assetAddress The Ethereum address of the funds you want to deposit. These can be ETH, HyperToken, Dai, or any othe supported payment token.
   * @param amount 
   */
  depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<void>;

  /**
   * Returns balances of the router channel, including
   * unfinalized and finalizable funds.
   */
  getBalances(): Promise<Balances>

  getLinks(): Promise<HypernetLink[]>;

  /**
   * openLink() is always called by the provider of a link, with an amount they
   * wish to stake. This will return a HypernetLink in the STAKED status.
   * @param consumerWallet 
   * @param paymentToken 
   * @param amount 
   * @param disputeMediator 
   * @param pullSettings 
   */
  openLink(
    consumerWallet: EthereumAddress,
    paymentToken: EthereumAddress,
    amount: BigNumber, 
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink>;
  depositIntoLink(linkId: string, amount: BigNumber): Promise<Deposit>;

  sendFunds(linkId: string, amount: BigNumber): Promise<Payment>;
  pullFunds(linkId: string, amount: BigNumber): Promise<Payment>;
  withdrawFunds(linkId: string, amount: BigNumber, destinationAddress: EthereumAddress | null): Promise<Withdrawal>;
  withdrawStake(linkId: string, destinationAddress: EthereumAddress | null): Promise<Stake>;

  /***
   * Called by the consumer
   */
  initiateDispute(linkId: string): Promise<LinkFinalResult>;
  closeLink(linkId: string): Promise<LinkFinalResult>;

  /**
   * Observables for seeing what's going on
   */
  onLinkUpdated: Subject<HypernetLink>;
  onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>;
  onLinkRejected: Subject<EstablishLinkRequest>;
  onControlClaimed: Subject<ControlClaim>;
  onControlYielded: Subject<ControlClaim>;

  // DEBUG ONLY
  clearLinks(): Promise<void>;
}