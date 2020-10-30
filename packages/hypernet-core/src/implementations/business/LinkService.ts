import { ILinkService } from "@interfaces/business/ILinkService";
import {
  HypernetLink,
  BigNumber,
  PullSettings,
  Payment,
  Deposit,
  Stake,
  EstablishLinkRequest,
  EthereumAddress,
  PublicKey,
  PublicIdentifier
} from "@interfaces/objects";
import { ELinkRole, ELinkStatus } from "@interfaces/types";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";
import { ILinkRepository } from "@interfaces/data/ILinkRepository";

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
    consumerId: PublicIdentifier,
    paymentToken: EthereumAddress,
    stakeAmount: BigNumber,
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink> {
    const context = await this.contextProvider.getInitializedContext();

    const link = await this.linkRepository.createHypernetLink(consumerId, 
      paymentToken, 
      stakeAmount,
      disputeMediator,
      pullSettings);

    return link;
  }
  public async stakeIntoLink(linkId: string, amount: BigNumber): Promise<Stake> {
    throw new Error("Method not implemented.");
  }
  public async depositIntoLink(linkId: string, amount: BigNumber): Promise<Deposit> {
    throw new Error("Method not implemented.");
  }
  public async sendFunds(linkId: string, amount: BigNumber): Promise<Payment> {
    throw new Error("Method not implemented.");
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

  public async getActiveLinks(): Promise<HypernetLink[]> {
    return this.linkRepository.getHypernetLinks();
  }

  public async clearLinks(): Promise<void> {
    throw new Error("Method not implemented.");
  }


}
