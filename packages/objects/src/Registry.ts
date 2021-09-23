import { EthereumAddress } from "./EthereumAddress";

export class Registry {
  constructor(
    public address: EthereumAddress,
    public name: string,
    public symbol: string,
    public numberOfEntries: number,
  ) {}
}

export class RegistryEntry {
  constructor(
    public label: string,
    public tokenId: number,
    public owner: EthereumAddress,
    public tokenURI: string | null,
  ) {}
}
