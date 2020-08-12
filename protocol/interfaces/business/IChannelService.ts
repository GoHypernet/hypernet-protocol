export interface IChannelService {
    openChannel(consumerWallet: string, providerWallet: string): Promise<Channel>;
    closeChannel(channelId: int): Promise<void>;
}