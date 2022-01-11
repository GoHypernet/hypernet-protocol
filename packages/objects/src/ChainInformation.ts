import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { ProviderUrl } from "@objects/ProviderUrl";
import { IPFSApiUrl } from "@objects/IPFSApiUrl";
import { IPFSGatewayUrl } from "@objects/IPFSGatewayUrl";

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
    public hypernetProfileRegistryAddress: EthereumContractAddress | null,
    public batchModuleAddress: EthereumContractAddress | null,
    public providerUrls: ProviderUrl[],
    public ipfsApiUrl: IPFSApiUrl,
    public ipfsGatewayUrl: IPFSGatewayUrl,
  ) {}
}

export class GovernanceChainInformation extends ChainInformation {
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
    public hypernetGovernorAddress: EthereumContractAddress,
    public registryFactoryAddress: EthereumContractAddress,
    public gatewayRegistryAddress: EthereumContractAddress,
    public liquidityRegistryAddress: EthereumContractAddress,
    public tokenRegistryAddress: EthereumContractAddress,
    public chainRegistryAddress: EthereumContractAddress,
    public hypernetProfileRegistryAddress: EthereumContractAddress,
    public batchModuleAddress: EthereumContractAddress,
    public providerUrls: ProviderUrl[],
    public ipfsApiUrl: IPFSApiUrl,
    public ipfsGatewayUrl: IPFSGatewayUrl,
  ) {
    super(
      name,
      chainId,
      hasGovernance,
      channelFactoryAddress,
      transferRegistryAddress,
      hypertokenAddress,
      messageTransferAddress,
      insuranceTransferAddress,
      parameterizedTransferAddress,
      hypernetGovernorAddress,
      registryFactoryAddress,
      gatewayRegistryAddress,
      liquidityRegistryAddress,
      tokenRegistryAddress,
      chainRegistryAddress,
      hypernetProfileRegistryAddress,
      batchModuleAddress,
      providerUrls,
      ipfsApiUrl,
      ipfsGatewayUrl,
    );
  }
}
