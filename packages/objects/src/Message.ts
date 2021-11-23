import { EthereumAddress } from "@objects/EthereumAddress";

export class Message {
  constructor(
    public author: EthereumAddress,
    public timestamp: number,
    public data: any,
  ) {}
}
