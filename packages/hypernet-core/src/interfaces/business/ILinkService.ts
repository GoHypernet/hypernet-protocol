import {
  HypernetLedger,
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

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface ILinkService {

  /**
   * Creates a Hypernet Link, internally represented by a set of 
   * one-to-one insurancePayment<-->parameterizedPayment. Should only be
   * called by the provider.
   * @todo refactor stake entirely - see comment in ILinkRepository
   * @todo rename amount to something more identifying as stake (stakeamount?)
   * @param consumerAccount the public identifier of the consumer (payer)
   * @param allowedPaymentTokens An array of the ERC20 payment tokens that may be used
   * @param stakeAmount the amount of Hypertoken that is put up as stake
   * @param stakeExpiration the unix timestamp of how long the stake is good for.
   * @param disputeMediator the address of the dispute mediator as an Ethereum address
   */
  openLink(
    consumerAccount: PublicIdentifier,
    allowedPaymentTokens: EthereumAddress[],
    stakeAmount: BigNumber, 
    stakeExpiration: number,
    disputeMediator: PublicKey): Promise<HypernetLedger>;
  
  /**
   * Send funds on a link.
   * @param linkId the id of the link to send funds on
   * @param amount the amount of funds to send
   */
  sendFunds(linkId: string, amount: BigNumber): Promise<Payment>;

  /**
   * As a provider, update pulled-funds balance (internally)
   * @param linkId the id of the link to pull funds on
   * @param amount the amount of funds to pull
   */
  pullFunds(linkId: string, amount: BigNumber): Promise<Payment>;

  /**
   * Withdraw funds from the specified link; this will likely incur a blockchain (layer 1) transaction.
   * @param linkId the id of the link to withdraw funds from
   * @param amount the amount of funds to withdraw
   */
  withdrawFunds(linkId: string, amount: BigNumber, destinationAddress: EthereumAddress | null): Promise<Withdrawal>;

  /**
   * Withdraw staked funds from the specified link; /may/ incur a blockchain (layer 1) transaction.
   * @todo rename stake --> insurance
   * @todo refactor this maybe; withdrawing stake doesn't necessarily mean that we have to make a blockchain transaction
   * @todo add amount?
   * @param linkId the id of the link to withdraw stake from
   * @param destinationAddress the Ethereum address to withdraw the stake to
   */
  withdrawStake(linkId: string, destinationAddress: EthereumAddress | null): Promise<Stake>;

  /**
   * @todo reconsider this function - what does it even mean to "close a link"?
   */
  closeLink(linkId: string): Promise<void>;
  
  /**
   * Returns any active links that the client has - both as a provider and as a consumer.
   */
  getActiveLinks(): Promise<HypernetLedger[]>;

  /**
   * 
   * @param establishLinkRequest
   */
  processEstablishLinkRequests(establishLinkRequest: EstablishLinkRequest[]): Promise<void>;

  /**
   * 
   * @param channelId
   * @param participant1Address
   * @param participant2Address
   * @param role
   */
  processChannelProposed(
    channelId: string,
    participant1Address: string, 
    participant2Address: string,
    role: ELinkRole): Promise<void>;

  // Debug ONLY
  clearLinks(): Promise<void>;
}