import { EthereumContractAddress } from "@objects/EthereumContractAddress";

export class RegistryModulesNames {
  constructor(
    public batchMintingModule: string | null,
    public lazyMintingModule: string | null,
    public merkleDropModule: string | null,
  ) {}
}
