import { IStateChannelListener } from "@interfaces/api/IStateChannelListener";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { Message as NitroMessage } from "@statechannels/client-api-schema";
import { IMessageService } from "@interfaces/business/IMessageService";
import { MessagePayload } from "@interfaces/objects";
import { ELinkRole, EMessageType } from "@interfaces/types";
import { serialize } from "class-transformer";
import { ILinkService } from "@interfaces/business/ILinkService";
import { ChannelResult } from "@statechannels/channel-client";

export class StateChannelListener implements IStateChannelListener {
  constructor(protected channelClientProvider: IChannelClientProvider, 
    protected messageService: IMessageService,
    protected linkService: ILinkService) {}

  public async initialize(): Promise<void> {
    const channelClient = this.channelClientProvider.getChannelClient();

    const unregister = channelClient.onMessageQueued((message: NitroMessage) => {
      // The message needs to go to the 3 box thread
      // We need to package up the nitro message into a normal message for processing
      console.log("Nitro message queued", message);
      const payload = new MessagePayload(EMessageType.CHANNEL, serialize(message));
      this.messageService.sendMessage(message.recipient, payload);
    });

    channelClient.onChannelUpdated((result) => {
      console.log("Channel result recieved", result);
    });

    channelClient.onChannelProposed((result: ChannelResult) => {
      console.log("Channel proposed", result);

      // Sanity checking
      if (result.participants.length !== 2) {
        throw new Error(`Invalid channel propsed, must have 2 participants but instead has ${result.participants.length}`);
      }

      // We need to pull the role out of the appdata
      const appData = result.appData
      const role = ELinkRole.CONSUMER;

      this.linkService.processChannelProposed(result.channelId, 
        result.participants[0].destination, 
        result.participants[1].destination,
        role);
    })
  }
}
