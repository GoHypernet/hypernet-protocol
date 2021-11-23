import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { RegistryTokenId } from "@objects/RegistryTokenId";

export class RegistryEntry {
  constructor(
    public label: string,
    public tokenId: RegistryTokenId,
    public owner: EthereumAccountAddress,
    public tokenURI: string | null,
    public index: number | null,
  ) {}
}
