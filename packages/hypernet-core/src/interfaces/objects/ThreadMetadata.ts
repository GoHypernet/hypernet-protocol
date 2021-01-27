import { EthereumAddress } from "./EthereumAddress";

export class ThreadMetadata {
  constructor(public address: string, public userAddress: EthereumAddress) {}
}
