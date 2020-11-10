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

  /**
   * Creates a Hypernet Link, internally represented by a set of 
   * one-to-one insurancePayment<-->parameterizedPayment. Should only be
   * called by the provider.
   * @param consumerId the public identifier of the consumer (payer)
   * @param paymentToken the address of the ERC20 payment token that will be used
   * @param amount the amount of Hypertoken that is put up as stake
   * @param disputeMediator the address of the dispute mediator as an Ethereum address
   * @param pullSettings pull payment settings, if applicable
   */
  openLink(
    consumerId: PublicIdentifier,
    paymentToken: EthereumAddress,
    amount: BigNumber, 
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink>;
  
  /**
   * 
   * @param linkId 
   * @param amount 
   */
  sendFunds(linkId: string, amount: BigNumber): Promise<Payment>;

  /**
   * As a provider, update pulled-funds balance (internally)
   * @param linkId 
   * @param amount 
   */
  pullFunds(linkId: string, amount: BigNumber): Promise<Payment>;

  withdrawFunds(linkId: string, amount: BigNumber, destinationAddress: EthereumAddress | null): Promise<Withdrawal>;
  withdrawStake(linkId: string, destinationAddress: EthereumAddress | null): Promise<Stake>;

  closeLink(linkId: string): Promise<void>;
  
  getActiveLinks(): Promise<HypernetLink[]>;

  processEstablishLinkRequests(establishLinkRequest: EstablishLinkRequest[]): Promise<void>;
  processChannelProposed(channelId: string,
    participant1Address: string, 
    participant2Address: string,
    role: ELinkRole): Promise<void>;

  // Debug ONLY
  clearLinks(): Promise<void>;
}
