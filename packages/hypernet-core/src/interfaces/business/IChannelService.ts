import { HypernetChannel, Address, BigNumber, Message } from "@interfaces/objects";

export interface IChannelService {
  openChannel(
    consumerWallet: Address,
    providerWallet: Address,
    paymentToken: Address,
    depositAmount: BigNumber,
  ): Promise<HypernetChannel>;
  closeChannel(channelId: string): Promise<void>;
  getChannelsById(channelIds: string[]): Promise<HypernetChannel[]>;
  getActiveChannels(): Promise<HypernetChannel[]>;
  messageRecieved(channelId: string, message: Message): Promise<void>;
}
