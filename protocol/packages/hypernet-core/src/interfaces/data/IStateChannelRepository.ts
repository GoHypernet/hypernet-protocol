import { Message, EthereumAddress, HypernetLink } from "@interfaces/objects";
import { ChannelResult } from "@statechannels/channel-client";

export interface IStateChannelRepository {
  initialize(): Promise<void>;
  pushMessage(message: string): Promise<void>;

  /**
   * 
   * @param consumerAddress 
   * @param providerAddress 
   * @returns The internal channel ID
   */
  createChannel(consumerAddress: EthereumAddress, providerAddress: EthereumAddress): Promise<string>;
  joinChannel(channelId: string): Promise<void>;
}
