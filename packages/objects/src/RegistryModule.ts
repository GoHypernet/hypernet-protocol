import { EthereumContractAddress } from "@objects/EthereumContractAddress";

export class RegistryModule {
  constructor(public name: string, public address: EthereumContractAddress) {}
}
