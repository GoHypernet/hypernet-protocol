import { Message } from "@objects/Message";
import { EthereumAddress } from "@objects/EthereumAddress";

export class MessageThread {
  constructor(
    public threadAddress: string,
    public userA: EthereumAddress,
    public userB: EthereumAddress,
    public messages: Message[],
  ) {}
}
