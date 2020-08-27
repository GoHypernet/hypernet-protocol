import { ILinkService } from "@interfaces/business/ILinkService";
import { IStateChannelRepository, IPersistenceRepository, IMessagingRepository } from "@interfaces/data";
import { HypernetLink, BigNumber, PullSettings, Payment, Deposit, Stake } from "@interfaces/objects";
import { v4 as uuidv4 } from "uuid";
import { ELinkStatus } from "@interfaces/types";

export class LinkService implements ILinkService {
  constructor(
    protected stateChannelRepository: IStateChannelRepository,
    protected persistenceRepository: IPersistenceRepository,
    protected messagingRepository: IMessagingRepository,
  ) {}
  public async openLink(
    consumerWallet: string,
    providerWallet: string,
    paymentToken: string,
    disputeMediator: string,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink> {
    // Check if the link already exists
    const links = await this.persistenceRepository.getActiveLinks();

    let link: HypernetLink | null = null;
    if (links.length > 0) {
      // We may need to recover initiating the link.
      link = links[0];

      // Links in INTENDED and MESSAGING_ESTABLISHED states need their
      // open process restarted. Other statuses are post openLink.
      if (link.status === ELinkStatus.INTENDED) {
        link = await this.establishMessaging(link);
        link = await this.openChannel(link);
      } else if (link.status === ELinkStatus.MESSAGING_ESTABLISHED) {
        link = await this.openChannel(link);
      } else {
        return link;
      }
    } else {
      // No link open, first we need to create an empty link and then store it.
      // The persistence repo will handle the details
      link = await this.persistenceRepository.createLink(
        new HypernetLink(
          uuidv4(),
          consumerWallet,
          providerWallet,
          paymentToken,
          disputeMediator,
          pullSettings,
          new BigNumber(0),
          new BigNumber(0),
          new BigNumber(0),
          new BigNumber(0),
          ELinkStatus.INTENDED,
          null,
          null,
        ),
      );

      link = await this.establishMessaging(link);
      link = await this.openChannel(link);
    }

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
  public async withdrawStake(
    linkId: string,
    destinationAddress: string | null,
  ): Promise<Stake> {
    throw new Error("Method not implemented.");
  }
  public async getLinksById(channelIds: string[]): Promise<HypernetLink[]> {
    throw new Error("Method not implemented.");
  }
  public async getActiveLinks(): Promise<HypernetLink[]> {
    return this.persistenceRepository.getActiveLinks();
  }

  /**
   * This function moves a link from INTENDED to MESSAGING_ESTABLISHED.
   *
   * It will open a message thread and associate it with the link.
   */
  protected async establishMessaging(link: HypernetLink): Promise<HypernetLink> {
    const thread = this.messagingRepository.createMessageThread();
    throw new Error("Method not implemented.");
  }

  protected async openChannel(link: HypernetLink): Promise<HypernetLink> {
    throw new Error("Method not implemented.");
  }
}
