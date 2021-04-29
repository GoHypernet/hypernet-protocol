import { EthereumAddress } from "@objects/EthereumAddress";
import { Message } from "@objects/Message";

export class MessageThread {
  constructor(
    public threadAddress: string,
    public userA: EthereumAddress,
    public userB: EthereumAddress,
    public messages: Message[],
  ) {}
}
