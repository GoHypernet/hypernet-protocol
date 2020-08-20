import { Message, Address, HypernetChannel } from "@interfaces/objects";

export interface IStateChannelRepository {
  pushMessage(message: Message): Promise<void>;
  createChannel(consumerAddress: Address, providerAddress: Address): Promise<HypernetChannel>;
}
