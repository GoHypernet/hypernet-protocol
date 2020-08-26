import { IMessageService } from "@interfaces/business/IMessageService";
import { Message } from "@interfaces/objects";
import { IPersistenceRepository, IStateChannelRepository, IMessagingRepository } from "@interfaces/data";

export class MessageService implements IMessageService {
  constructor(
    protected persistenceRepository: IPersistenceRepository,
    protected messagingRepository: IMessagingRepository,
    protected stateChannelRepository: IStateChannelRepository,
  ) {}

  public async messageRecieved(channelId: string, message: Message): Promise<void> {
    // Make sure the channel is actually open
    const channels = await this.persistenceRepository.getChannelsById([channelId]);

    if (channels.length === 0) {
      throw new Error("Message recieved from unknown channel. This shouldn't ever happen");
    }

    return await this.stateChannelRepository.pushMessage(message);
  }

  public async sendMessage(message: Message): Promise<void> {
    // this.messagingRepository.sendMessage(message);
  }
}
