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
} from "@interfaces/objects";
import { Subject } from "rxjs";

export interface IHypernetCore {
  initialized(): boolean;
  inControl(): boolean;

  getAccounts(): Promise<string[]>;

  initialize(account: string): Promise<void>;
  getLinks(): Promise<HypernetLink[]>;
  openLink(
    consumer: EthereumAddress,
    provider: EthereumAddress,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink>;
  stakeIntoLink(linkId: string, amount: BigNumber): Promise<Stake>;
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
