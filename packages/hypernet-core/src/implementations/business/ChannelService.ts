import { IChannelService } from "@interfaces/business/IChannelService";
import { IStateChannelRepository, IPersistenceRepository } from "@interfaces/data";
import { HypernetChannel, Address, BigNumber, Message } from "@interfaces/objects";
import { ChannelUtils } from "@implementations/utilities/ChannelUtils";

export class ChannelService implements IChannelService {
    constructor(protected stateChannelRepository: IStateChannelRepository,
        protected persistenceRepository: IPersistenceRepository) {

    }

    public async openChannel(consumerWallet: Address, providerWallet: Address, paymentToken: Address): Promise<HypernetChannel> {
        // Check if the channel is actually already 
        const channelId = ChannelUtils.getChannelId(consumerWallet, providerWallet)
        const channels = await this.persistenceRepository.getChannelsById([channelId]);

        if (channels.length > 0) {
            // Already an open channel, just return that.
            return channels[0];
        }

        // No channel open, we will first create a space for the channel and store
        // some details in there.
        const newChannel = new HypernetChannel(consumerWallet, providerWallet, paymentToken,
            new BigNumber(0), new BigNumber(0), new BigNumber(0), new BigNumber(0)
            , EChannelState.intended, null, null)
    }
    public async closeChannel(channelId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async getChannelsById(channelIds: string[]): Promise<HypernetChannel[]> {
        return this.persistenceRepository.getChannelsById(channelIds);
    }
    public async getActiveChannels(): Promise<HypernetChannel[]> {
        return this.persistenceRepository.getActiveChannels();
    }
    public async messageRecieved(channelId: string, message: Message): Promise<void> {
        // Make sure the channel is actually open
        const channels = await this.persistenceRepository.getChannelsById([channelId]);

        if (channels.length === 0) {
            throw new Error("Message recieved from unknown channel. This shouldn't ever happen");
        }

        return await this.stateChannelRepository.pushMessage(message);
    }

}