import { IStateChannelListener } from "@interfaces/api/IStateChannelListener";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { Message as NitroMessage } from "@statechannels/client-api-schema";
import { IMessageService } from "@interfaces/business/IMessageService";
import { MessagePayload } from "@interfaces/objects";
import { EMessageType } from "@interfaces/types";
import { serialize } from "class-transformer";

export class StateChannelListener implements IStateChannelListener {
  constructor(protected channelClientProvider: IChannelClientProvider, protected messageService: IMessageService) {}

  public async initialize(): Promise<void> {
    const channelClient = this.channelClientProvider.getChannelClient();

    const unregister = channelClient.onMessageQueued((message: NitroMessage) => {
      // The message needs to go to the 3 box thread
      // We need to package up the nitro message into a normal message for processing
      const payload = new MessagePayload(EMessageType.CHANNEL, serialize(message));
      this.messageService.sendMessage(message.recipient, payload);
    });
  }
}
