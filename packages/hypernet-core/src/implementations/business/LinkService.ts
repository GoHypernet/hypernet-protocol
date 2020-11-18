import { ILinkService } from "@interfaces/business/ILinkService";
import {
  HypernetLedger,
  BigNumber,
  PullSettings,
  Payment,
  Deposit,
  Stake,
  EstablishLinkRequest,
  EthereumAddress,
  PublicKey,
  PublicIdentifier,
  EPaymentState
} from "@interfaces/objects";
import { ELinkRole, ELinkStatus } from "@interfaces/types";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";
import { ILinkRepository } from "@interfaces/data/ILinkRepository";
import { ELinkOperation } from "@interfaces/types/ELinkOperation";

// tslint:disable: no-console
export class LinkService implements ILinkService {
  constructor(
    protected linkRepository: ILinkRepository,
    protected contextProvider: IContextProvider,
    protected linkUtils: ILinkUtils,
  ) { }

  processEstablishLinkRequests(establishLinkRequest: EstablishLinkRequest[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  processChannelProposed(channelId: string, participant1Address: string, participant2Address: string, role: ELinkRole): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async openLink(
    consumerAccount: PublicIdentifier,
    allowedPaymentTokens: EthereumAddress[],
    stakeAmount: BigNumber, 
    stakeExpiration: number,
    disputeMediator: PublicKey): Promise<HypernetLedger> {
    const context = await this.contextProvider.getInitializedContext();

    const link = await this.linkRepository.createHypernetLedger(
      consumerAccount, 
      allowedPaymentTokens, 
      stakeAmount,
      stakeExpiration,
      disputeMediator);

    return link;
  }

  public async stakeIntoLink(linkId: string, amount: BigNumber): Promise<Stake> {
    throw new Error("Method not implemented.");
  }

  public async depositIntoLink(linkId: string, amount: BigNumber): Promise<Deposit> {
    throw new Error("Method not implemented.");
  }

  /**
   * Sends funds on the link provided; calls into the VectorLinkRepository to do so.
   * @param linkId the link on which to send the funds
   * @param amount the amount of funds to send
   */
  public async sendFunds(linkId: string, amount: BigNumber): Promise<Payment> {
    let updatedLink = await this.linkRepository.modifyHypernetLedger(ELinkOperation.SEND_FUNDS, amount)
    
    let payment: Payment = {
      channelId: linkId, // should this be channel id or link id?
      amount: amount,
      createdTimestamp: null, // do we need to refactor Payment? not quite sure how this works or should work.
      updatedTimestamp: null,
      state: EPaymentState.Sent
    }

    return payment
  }

  public async pullFunds(linkId: string, amount: BigNumber): Promise<Payment> {
    throw new Error("Method not implemented.");
  }
  
  public async withdrawFunds(linkId: string, amount: BigNumber, destinationAddress: string | null): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async closeLink(linkId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async withdrawStake(linkId: string, destinationAddress: string | null): Promise<Stake> {
    throw new Error("Method not implemented.");
  }

  public async getActiveLinks(): Promise<HypernetLedger[]> {
    return this.linkRepository.getHypernetLedgers();
  }

  public async clearLinks(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}