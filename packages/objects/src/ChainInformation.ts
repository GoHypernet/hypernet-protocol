import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { RegistryModulesNames } from "@objects/RegistryModulesNames";
import { ProviderUrl } from "@objects/ProviderUrl";
import { RegistryNames } from "@objects/RegistryNames";

export class ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public hasGovernance: boolean,
    public isDev: boolean,
    public channelFactoryAddress: EthereumContractAddress,
    public transferRegistryAddress: EthereumContractAddress,
    public hypertokenAddress: EthereumContractAddress,
    public messageTransferAddress: EthereumContractAddress,
    public insuranceTransferAddress: EthereumContractAddress,
    public parameterizedTransferAddress: EthereumContractAddress,
    public hypernetGovernorAddress: EthereumContractAddress | null,
    public registryFactoryAddress: EthereumContractAddress | null,
    public registryNames: RegistryNames,
    public registryModulesNames: RegistryModulesNames,
    public providerUrls: ProviderUrl[],
  ) {}
}

export class GovernanceChainInformation extends ChainInformation {
  constructor(
    public name: string,
    public chainId: ChainId,
    public hasGovernance: boolean,
    public isDev: boolean,
    public channelFactoryAddress: EthereumContractAddress,
    public transferRegistryAddress: EthereumContractAddress,
    public hypertokenAddress: EthereumContractAddress,
    public messageTransferAddress: EthereumContractAddress,
    public insuranceTransferAddress: EthereumContractAddress,
    public parameterizedTransferAddress: EthereumContractAddress,
    public hypernetGovernorAddress: EthereumContractAddress,
    public registryFactoryAddress: EthereumContractAddress,
    public registryNames: RegistryNames,
    public registryModulesNames: RegistryModulesNames,
    public providerUrls: ProviderUrl[],
  ) {
    super(
      name,
      chainId,
      hasGovernance,
      isDev,
      channelFactoryAddress,
      transferRegistryAddress,
      hypertokenAddress,
      messageTransferAddress,
      insuranceTransferAddress,
      parameterizedTransferAddress,
      hypernetGovernorAddress,
      registryFactoryAddress,
      registryNames,
      registryModulesNames,
      providerUrls,
    );
  }
}
