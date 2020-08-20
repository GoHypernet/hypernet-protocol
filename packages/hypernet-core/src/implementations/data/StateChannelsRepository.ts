import "@statechannels/iframe-channel-provider";
import { IFrameChannelProviderInterface } from "@statechannels/iframe-channel-provider";
import { } from "@statechannels/channel-client";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { Message } from "@statechannels/client-api-schema";
import { IStateChannelRepository } from "@interfaces/data";
import { HypernetChannel } from "@interfaces/objects";

declare global {
    interface Window {
        channelProvider: IFrameChannelProviderInterface;
    }
}

export class StateChannelsRepository implements IStateChannelRepository {
    protected channelProviderEnabled: boolean = false;

    constructor(protected channelClientProvider: IChannelClientProvider) {

    }


    public async initialize() {
        await window.channelProvider.mountWalletComponent('https://xstate-wallet.statechannels.org/');
    }

    public async pushMessage(message: Message): Promise<void> {
        // This is probably not necessary here, leaving it in for example for later
        await this.assureEnabled();


        const channelClient = this.channelClientProvider.getChannelClient();

        try {
            const result = await channelClient.pushMessage(message);
        }
        // tslint:disable-next-line: no-empty
        catch (e) {

        }
    }

    public async createChannel(consumerAddress: string, providerAddress: string): Promise<HypernetChannel> {
        await this.assureEnabled();
        
        throw new Error("Method not implemented.");
    }

    protected async assureEnabled(): Promise<void> {
        if (!this.channelProviderEnabled) {
            await window.channelProvider.enable();
            this.channelProviderEnabled = true;
        }
    }
}