import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";

export class RegistryEntry {
  constructor(
    public label: string,
    public tokenId: number,
    public owner: EthereumAccountAddress,
    public tokenURI: string | null,
    public index: number | null,
  ) {}
}
