import { EthereumAddress } from "@objects/EthereumAddress";

export class ThreadMetadata {
  constructor(public address: string, public userAddress: EthereumAddress) {}
}
