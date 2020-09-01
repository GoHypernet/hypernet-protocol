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
} from "@interfaces/objects";

export interface IHypernetCore {
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

  // DEBUG ONLY
  clearLinks(): Promise<void>;
}
