import { Message, EthereumAddress, HypernetLink } from "@interfaces/objects";

export interface IStateChannelRepository {
  pushMessage(message: Message): Promise<void>;
  createChannel(consumerAddress: EthereumAddress, providerAddress: EthereumAddress): Promise<HypernetLink>;
}
