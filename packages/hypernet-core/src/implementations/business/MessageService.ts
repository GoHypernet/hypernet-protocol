import { IMessageService } from "@interfaces/business/IMessageService";
import { Message, EthereumAddress } from "@interfaces/objects";
import { IPersistenceRepository, IStateChannelRepository, IMessagingRepository } from "@interfaces/data";

export class MessageService implements IMessageService {
  constructor(
    protected persistenceRepository: IPersistenceRepository,
    protected messagingRepository: IMessagingRepository,
    protected stateChannelRepository: IStateChannelRepository,
  ) {}

  public async messageRecieved(message: Message): Promise<void> {
    return await this.stateChannelRepository.pushMessage(message);
  }

  public async sendMessage(destination: EthereumAddress, data: any): Promise<Message> {
    // We always know the sender, it's us. That's easy. We don't know what link
    // this message is for, so we need to figure that out.
    // This is pretty difficult, as any two people may have two active links,
    // one where they are the consumer and one where they are the provider
    // We do not know which one this message is for
    // const messageThread = this.messagingRepository.sendMessage()
    return new Message("", 123, "afasdf");
  }
}
