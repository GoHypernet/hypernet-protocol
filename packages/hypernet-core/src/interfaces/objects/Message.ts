import { EthereumAddress } from ".";

export class Message {
  constructor(public recipient: EthereumAddress, public sender: EthereumAddress, public data: any) {}
}
