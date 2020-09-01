import {
  HypernetLink,
  EthereumAddress,
  Deposit,
  PullSettings,
  Payment,
  BigNumber,
  Stake,
  PublicKey,
  Withdrawal,
  EstablishLinkRequest,
} from "@interfaces/objects";

export interface ILinkService {
  openLink(
    consumerWallet: EthereumAddress,
    providerWallet: EthereumAddress,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink>;
  stakeIntoLink(linkId: string, amount: BigNumber): Promise<Stake>;
  depositIntoLink(linkId: string, amount: BigNumber): Promise<Deposit>;

  sendFunds(linkId: string, amount: BigNumber): Promise<Payment>;
  pullFunds(linkId: string, amount: BigNumber): Promise<Payment>;
  withdrawFunds(linkId: string, amount: BigNumber, destinationAddress: EthereumAddress | null): Promise<Withdrawal>;
  closeLink(linkId: string): Promise<void>;
  withdrawStake(linkId: string, destinationAddress: EthereumAddress | null): Promise<Stake>;

  getActiveLinks(): Promise<HypernetLink[]>;

  processEstablishLinkRequests(establishLinkRequest: EstablishLinkRequest[]): Promise<void>;

  // Debug ONLY
  clearLinks(): Promise<void>;
}
