import { IMessageService } from "@interfaces/business/IMessageService";
import { Message, EthereumAddress, MessagePayload, EstablishLinkRequest } from "@interfaces/objects";
import { IPersistenceRepository, IStateChannelRepository, IMessagingRepository } from "@interfaces/data";
import { EMessageType, ELinkStatus } from "@interfaces/types";
import { plainToClass } from "class-transformer";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";

export class MessageService implements IMessageService {
  constructor(
    protected persistenceRepository: IPersistenceRepository,
    protected messagingRepository: IMessagingRepository,
    protected stateChannelRepository: IStateChannelRepository,
    protected contextProvider: IContextProvider
  ) {}

  public async messageRecieved(payload: MessagePayload): Promise<void> {
    // Get the context
    const context = await this.contextProvider.getContext();

    // If we are not in control, we will not process any messages. This 
    // effectively takes us out of the loop
    if (!context.inControl) {
      return;
    }

    // If we are in control, we need to basically act as a router.
    if (payload.type === EMessageType.DENY_LINK) {
      const plain = JSON.parse(payload.data) as object;
      const denyLink = plainToClass(EstablishLinkRequest, plain);

      // Creating a link has been denied
      const links = await this.persistenceRepository.getLinksById([denyLink.linkId]);
      const link = links[denyLink.linkId];

      if (link == null) {
        // No link that we can find
        return;
      }

      link.status = ELinkStatus.DENIED;
      await this.persistenceRepository.updateLink(link);
    } else if (payload.type === EMessageType.CHANNEL) {
      await this.stateChannelRepository.pushMessage(payload.data);
    }
  }

  public async sendMessage(destination: EthereumAddress, payload: MessagePayload): Promise<void> {
    // We always know the sender, it's us. That's easy. We don't know what link
    // this message is for, so we need to figure that out.
    // This is pretty difficult, as any two people may have two active links,
    // one where they are the consumer and one where they are the provider
    // We do not know which one this message is for
    const messageThread = this.messagingRepository.sendMessage(destination, payload);
  }
}
