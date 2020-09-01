import { ILinkService } from "@interfaces/business/ILinkService";
import { IStateChannelRepository, IPersistenceRepository, IMessagingRepository } from "@interfaces/data";
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
} from "@interfaces/objects";
import { v4 as uuidv4 } from "uuid";
import { ELinkStatus } from "@interfaces/types";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";

// tslint:disable: no-console
export class LinkService implements ILinkService {
  constructor(
    protected stateChannelRepository: IStateChannelRepository,
    protected persistenceRepository: IPersistenceRepository,
    protected messagingRepository: IMessagingRepository,
    protected contextProvider: IContextProvider,
    protected linkUtils: ILinkUtils,
  ) {}

  public async openLink(
    consumer: EthereumAddress,
    provider: EthereumAddress,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink> {
    // Check if the link already exists
    const links = await this.persistenceRepository.getActiveLinks();

    const existingLink = this.linkUtils.checkExistingLink(consumer, provider, paymentToken, disputeMediator, links);

    if (existingLink != null) {
      console.log("Existing link", existingLink);
      await this.advanceLink(existingLink);

      return existingLink;
    } else {
      // No link open, first we need to create an empty link and then store it.
      // The persistence repo will handle the details
      const link = await this.persistenceRepository.createLink(
        new HypernetLink(
          uuidv4(),
          consumer,
          provider,
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

      return this.advanceLink(link);
    }
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
  public async getLinksById(channelIds: string[]): Promise<HypernetLink[]> {
    throw new Error("Method not implemented.");
  }
  public async getActiveLinks(): Promise<HypernetLink[]> {
    return this.persistenceRepository.getActiveLinks();
  }

  protected async advanceLink(link: HypernetLink): Promise<HypernetLink> {
    // Links in INTENDED and MESSAGING_ESTABLISHED states need their
    // open process restarted. Other statuses are post openLink.
    if (link.status === ELinkStatus.INTENDED) {
      link = await this.establishMessaging(link);
      link = await this.openChannel(link);
    } else if (link.status === ELinkStatus.MESSAGING_ESTABLISHED) {
      link = await this.openChannel(link);
    }

    return link;
  }
  /**
   * This function moves a link from INTENDED to MESSAGING_ESTABLISHED.
   *
   * It will open a message thread and associate it with the link.
   */
  protected async establishMessaging(link: HypernetLink): Promise<HypernetLink> {
    // First, create a message thread between the two users.
    const threadName = uuidv4();
    const thread = await this.messagingRepository.createMessageThread(threadName, link.consumer, link.provider);

    // Now, we'll update the link's status
    link.threadAddress = thread.threadAddress;
    link.status = ELinkStatus.MESSAGING_ESTABLISHED;

    // And persist the update
    this.persistenceRepository.updateLink(link);

    // Now we need to broadcast to the other party
    this.messagingRepository.sendEstablishLinkRequest(
      new EstablishLinkRequest(
        link.consumer,
        link.provider,
        link.paymentToken,
        link.disputeMediator,
        link.pullSettings,
        link.threadAddress,
      ),
    );

    return link;
  }

  protected async openChannel(link: HypernetLink): Promise<HypernetLink> {
    console.log("Open channel", link);
    return link;
  }

  /**
   * When someone wants to establish a link with us, we need to subscribe to the
   * thread and record the link
   * @param establishLinkRequest
   */
  public async processEstablishLinkRequests(establishLinkRequests: EstablishLinkRequest[]): Promise<void> {
    // We only have to do something if the recipient is us!
    const context = await this.contextProvider.getContext();

    const requestsToProcess = new Array<EstablishLinkRequest>();

    // We only need to worry about links that include us
    for (const linkRequest of establishLinkRequests) {
      // If the link doesn't concern us, toss it
      if (context.account === linkRequest.consumer || context.account === linkRequest.provider) {
        requestsToProcess.push(linkRequest);
      }
    }

    // The remaining link requests include one half that is us, and the other half that is not
    const consumerOrProviderIds = requestsToProcess.map((request) => {
      if (request.consumer === context.account) return request.provider;
      else return request.consumer;
    });

    // Pull all the relevant links to see if they exist
    const existingLinks = await this.persistenceRepository.getLinksByParticipant(consumerOrProviderIds);

    // Now we can process the actual link request
    for (const linkRequest of requestsToProcess) {
      // Check if there is an existing link
      const existingLink = this.linkUtils.checkExistingLink(
        linkRequest.consumer,
        linkRequest.provider,
        linkRequest.paymentToken,
        linkRequest.disputeMediator,
        existingLinks,
      );

      if (existingLink != null) {
        // We already have this link, so this must be an old request.
        continue;
      }

      // No existing link, this is a new request.
      const link = await this.persistenceRepository.createLink(
        new HypernetLink(
          uuidv4(),
          linkRequest.consumer,
          linkRequest.provider,
          linkRequest.paymentToken,
          linkRequest.disputeMediator,
          linkRequest.pullSettings,
          new BigNumber(0),
          new BigNumber(0),
          new BigNumber(0),
          new BigNumber(0),
          ELinkStatus.MESSAGING_ESTABLISHED,
          null,
          linkRequest.threadAddress,
        ),
      );
    }
  }

  public async clearLinks(): Promise<void> {
    this.persistenceRepository.clearLinks();
  }
}
