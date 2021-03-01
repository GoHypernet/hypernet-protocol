import { EthereumAddress } from "@hypernetlabs/utils/src/objects/EthereumAddress";

export class Message {
  constructor(public author: EthereumAddress, public timestamp: number, public data: any) {}
}
