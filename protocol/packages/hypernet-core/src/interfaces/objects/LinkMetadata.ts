import { EthereumAddress } from "./EthereumAddress";

export class LinkMetadata {
  constructor(public linkId: string, public consumer: EthereumAddress, public provider: EthereumAddress) {}
}
