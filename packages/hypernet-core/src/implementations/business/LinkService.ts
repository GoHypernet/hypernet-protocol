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
  EstablishLinkRequestWithApproval,
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

    const existingLink = this.linkUtils.checkExistingLink(
      null,
      consumer,
      provider,
      paymentToken,
      disputeMediator,
      links,
    );

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

      // Notify the world
      const context = await this.contextProvider.getContext();
      context.onLinkUpdated.next(link);

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

  public async getActiveLinks(): Promise<HypernetLink[]> {
    return this.persistenceRepository.getActiveLinks();
  }

  protected async advanceLink(link: HypernetLink): Promise<HypernetLink> {
    // Links in INTENDED and MESSAGING_ESTABLISHED states need their
    // open process restarted. Other statuses are post openLink.
    if (link.status === ELinkStatus.INTENDED) {
      link = await this.establishMessaging(link);
    } else if (link.status === ELinkStatus.LINK_REQUEST_SENT) {
      // LINK_REQUEST_SENT all we can do is resend the link,
      // so we might as well.
      await this.sendEstablishLinkRequest(link);
    } else if (link.status === ELinkStatus.MESSAGING_ESTABLISHED) {
      link = await this.openChannel(link);
    } else if (link.status === ELinkStatus.DENIED) {
      // Must be trying to reopen the link
    }

    return link;
  }
  /**
   * This function moves a link from INTENDED to LINK_REQUEST_SENT.
   *
   * It will open a message thread and associate it with the link.
   */
  protected async establishMessaging(link: HypernetLink): Promise<HypernetLink> {
    // First, create a message thread between the two users.
    const threadName = uuidv4();
    const thread = await this.messagingRepository.createMessageThread(threadName, link.consumer, link.provider);

    // Now, we'll update the link's status
    link.threadAddress = thread.threadAddress;
    link.status = ELinkStatus.LINK_REQUEST_SENT;

    // Send the establish request
    await this.sendEstablishLinkRequest(link);

    // And persist the update
    this.persistenceRepository.updateLink(link);

    // Notify the world
    const context = await this.contextProvider.getContext();
    context.onLinkUpdated.next(link);

    return link;
  }

  protected async openChannel(link: HypernetLink): Promise<HypernetLink> {
    console.log("Open channel", link);

    // Notify the world
    const context = await this.contextProvider.getContext();
    context.onLinkUpdated.next(link);
    return link;
  }

  protected async sendEstablishLinkRequest(link: HypernetLink) {
    if (link.threadAddress == null) {
      throw new Error("Can not send an EstablishLinkRequest if the link address has not been set!");
    }
    // Now we need to broadcast to the other party
    this.messagingRepository.sendEstablishLinkRequest(
      new EstablishLinkRequest(
        link.id,
        link.consumer,
        link.provider,
        link.paymentToken,
        link.disputeMediator,
        link.pullSettings,
        link.threadAddress,
      ),
    );
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
        linkRequest.linkId,
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

      // Allow the agent to reject the incoming request
      context.onLinkRequestReceived.next(
        new EstablishLinkRequestWithApproval(linkRequest, async (approved: boolean) => {
          // If the agent approves of accepting this link request, we'll proceed
          if (!approved) {
            // Let the other side know that we did not accept their terms
            const newContext = await this.contextProvider.getContext();
            newContext.onLinkRejected.next(linkRequest);
            await this.messagingRepository.sendDenyLinkResponse(linkRequest);
            return;
          }

          // No existing link, this is a new request.
          const link = await this.persistenceRepository.createLink(
            new HypernetLink(
              linkRequest.linkId,
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

          // Notify the world
          context.onLinkUpdated.next(link);

          // At this point, the initiator will be in LINK_REQUEST_SENT, and the
          // reciever (us) is in MESSAGING_ESTABLISHED. The reciever will now open
          // the channel, which serves as an ACK to the initiator.a2
          await this.openChannel(link);
        }),
      );
    }
  }

  public async clearLinks(): Promise<void> {
    this.persistenceRepository.clearLinks();
  }
}
