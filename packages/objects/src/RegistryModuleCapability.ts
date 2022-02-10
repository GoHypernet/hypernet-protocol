import { EthereumContractAddress } from "@objects/EthereumContractAddress";

export class RegistryModuleCapability {
  constructor(
    public registryAddress: EthereumContractAddress,
    public batchMintEnabled: boolean,
    public lazyMintEnabled: boolean,
  ) {}
}
