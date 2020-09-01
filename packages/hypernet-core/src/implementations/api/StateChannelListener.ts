import { IStateChannelListener } from "@interfaces/api/IStateChannelListener";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { Message } from "@interfaces/objects";
import { Message as NitroMessage } from "@statechannels/client-api-schema";
import { IMessageService } from "@interfaces/business/IMessageService";

export class StateChannelListener implements IStateChannelListener {
  constructor(protected channelClientProvider: IChannelClientProvider, protected messageService: IMessageService) {}

  public async initialize(): Promise<void> {
    const channelClient = this.channelClientProvider.getChannelClient();

    const unregister = channelClient.onMessageQueued((message: NitroMessage) => {
      // The message needs to go to the 3 box thread
      // We need to package up the nitro message into a normal message for processing
      this.messageService.sendMessage(message.recipient, message.data);
    });
  }

  public filler(): void {
    return;
  }
}
