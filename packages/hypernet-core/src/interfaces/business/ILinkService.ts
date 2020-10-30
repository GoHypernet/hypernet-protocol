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
  PublicIdentifier,
} from "@interfaces/objects";
import { ELinkRole } from "@interfaces/types";

export interface ILinkService {
  openLink(
    consumerId: PublicIdentifier,
    paymentToken: EthereumAddress,
    amount: BigNumber, 
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink>;
  
  depositIntoLink(linkId: string, amount: BigNumber): Promise<Deposit>;

  sendFunds(linkId: string, amount: BigNumber): Promise<Payment>;
  pullFunds(linkId: string, amount: BigNumber): Promise<Payment>;
  withdrawFunds(linkId: string, amount: BigNumber, destinationAddress: EthereumAddress | null): Promise<Withdrawal>;
  closeLink(linkId: string): Promise<void>;
  withdrawStake(linkId: string, destinationAddress: EthereumAddress | null): Promise<Stake>;

  getActiveLinks(): Promise<HypernetLink[]>;

  processEstablishLinkRequests(establishLinkRequest: EstablishLinkRequest[]): Promise<void>;
  processChannelProposed(channelId: string,
    participant1Address: string, 
    participant2Address: string,
    role: ELinkRole): Promise<void>;

  // Debug ONLY
  clearLinks(): Promise<void>;
}
