import { Message, Address, HypernetChannel } from "@interfaces/objects";

export interface IStateChannelRepository {
  push_message(message: Message): void;
  create_channel(consumerAddress: Address, providerAddress: Address): Promise<HypernetChannel>;
}
