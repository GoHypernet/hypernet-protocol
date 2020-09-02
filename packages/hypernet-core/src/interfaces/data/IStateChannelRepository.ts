import { Message, EthereumAddress, HypernetLink } from "@interfaces/objects";

export interface IStateChannelRepository {
  initialize(): Promise<void>;
  pushMessage(message: string): Promise<void>;
  createChannel(consumerAddress: EthereumAddress, providerAddress: EthereumAddress): Promise<HypernetLink>;
}
