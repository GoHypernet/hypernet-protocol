import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { RegistryModule } from "@objects/RegistryModule";

export class RegistryModuleCapability {
  constructor(
    public registryAddress: EthereumContractAddress,
    public batchMintEnabled: boolean,
    public lazyMintEnabled: boolean,
  ) {}
}
