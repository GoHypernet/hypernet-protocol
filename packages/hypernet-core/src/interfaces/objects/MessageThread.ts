import { Message } from "./Message";
import { EthereumAddress } from "@hypernetlabs/utils/src/objects/EthereumAddress";

export class MessageThread {
  constructor(
    public threadAddress: string,
    public userA: EthereumAddress,
    public userB: EthereumAddress,
    public messages: Message[],
  ) {}
}
