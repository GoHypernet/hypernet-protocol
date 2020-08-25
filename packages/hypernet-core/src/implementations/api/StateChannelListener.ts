import { IStateChannelListener } from "@interfaces/api/IStateChannelListener";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { Message } from "@interfaces/objects";
import { Message as NitroMessage } from "@statechannels/client-api-schema";
import { IMessageService } from "@interfaces/business/IMessageService";

export class StateChannelListener implements IStateChannelListener {
  constructor(protected channelClientProvider: IChannelClientProvider, protected messageService: IMessageService) {}

  public async initialize(): Promise<void> {
    const channelClient = this.channelClientProvider.getChannelClient();

    channelClient.onMessageQueued((message: NitroMessage) => {
      // The message needs to go to the 3 box thread
      // We need to package up the nitro message into a normal message for processing
      const internalMessage = new Message(message.recipient, message.sender, message.data);

      this.messageService.sendMessage(internalMessage);
    });
  }
}
