import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { ProviderUrl } from "@objects/ProviderUrl";

export class ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public hasGovernance: boolean,
    public channelFactoryAddress: EthereumContractAddress,
    public transferRegistryAddress: EthereumContractAddress,
    public hypertokenAddress: EthereumContractAddress,
    public messageTransferAddress: EthereumContractAddress,
    public insuranceTransferAddress: EthereumContractAddress,
    public parameterizedTransferAddress: EthereumContractAddress,
    public hypernetGovernorAddress: EthereumContractAddress | null,
    public registryFactoryAddress: EthereumContractAddress | null,
    public gatewayRegistryAddress: EthereumContractAddress | null,
    public liquidityRegistryAddress: EthereumContractAddress | null,
    public tokenRegistryAddress: EthereumContractAddress | null,
    public chainRegistryAddress: EthereumContractAddress | null,
    public providerUrls: ProviderUrl[],
  ) {}
}
