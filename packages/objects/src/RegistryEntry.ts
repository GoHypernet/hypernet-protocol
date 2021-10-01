import { EthereumAddress } from "./EthereumAddress";

export class RegistryEntry {
  constructor(
    public label: string,
    public tokenId: number,
    public owner: EthereumAddress,
    public tokenURI: string | null,
    public canUpdateURI: boolean,
    public canUpdateLabel: boolean,
  ) {}
}
