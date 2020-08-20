import { IStateChannelListener } from "@interfaces/api/IStateChannelListener";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { Message } from "@interfaces/objects";

export class StateChannelListener implements IStateChannelListener {

    constructor(protected channelClientProvider: IChannelClientProvider) {
        
    }

    public async initialize(): Promise<void> {
        const channelClient = this.channelClientProvider.getChannelClient()

        channelClient.onMessageQueued((message: Message) => {
            // The message needs to go to the 3 box thread

            if (message.recipient === hubAddress) {
            }
        }
    }
}