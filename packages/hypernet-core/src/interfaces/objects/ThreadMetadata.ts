import { EthereumAddress } from "@hypernetlabs/utils/src/objects/EthereumAddress";

export class ThreadMetadata {
  constructor(public address: string, public userAddress: EthereumAddress) {}
}
