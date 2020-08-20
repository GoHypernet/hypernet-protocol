import {ChannelClient} from '@statechannels/channel-client';
import { IChannelClientProvider } from '@interfaces/utilities/IChannelClientProvider';

export class ChannelClientProvider implements IChannelClientProvider {
    protected channelClient: ChannelClient | null;

    constructor() {
        this.channelClient = null;
    }

    public getChannelClient(): ChannelClient {
        if (this.channelClient != null) {
            return this.channelClient;
        }

        this.channelClient = new ChannelClient(window.channelProvider);

        return this.channelClient;

    } 
}