import { ChainProviders } from "@connext/vector-types";
import {
  ChainId,
  DefinitionName,
  EthereumContractAddress,
  ProviderUrl,
  SchemaUrl,
} from "@hypernetlabs/objects";

export class HypernetConfig {
  constructor(
    public iframeSource: string,
    public infuraId: string,
    public governanceChainId: ChainId,
    public governanceEthProviderUrls: ProviderUrl[],
    public hypernetProtocolDomain: string,
    public defaultPaymentExpiryLength: number,
    public chainProviders: ChainProviders,
    public chainAddresses: HypernetChainAddresses,
    public natsUrl: string,
    public authUrl: string,
    public gatewayIframeUrl: string,
    public ceramicNodeUrl: string,
    public storageAliases: Map<DefinitionName, SchemaUrl>,
    public gatewayDeauthorizationTimeout: number,
    public controlClaimSubject: string,
    public debug: boolean,
  ) {}
}

export class HypernetChainAddresses {
  [chainId: number]: HypernetContractAddresses | null;
}

export class HypernetContractAddresses {
  constructor(
    public channelFactoryAddress: EthereumContractAddress,
    public transferRegistryAddress: EthereumContractAddress,
    public hypertokenAddress: EthereumContractAddress,
    public messageTransferAddress: EthereumContractAddress,
    public insuranceTransferAddress: EthereumContractAddress,
    public parameterizedTransferAddress: EthereumContractAddress,
    public gatewayRegistryAddress: EthereumContractAddress,
    public liquidityRegistryAddress: EthereumContractAddress,
    public hypernetGovernorAddress: EthereumContractAddress,
    public registryFactoryAddress: EthereumContractAddress,
  ) {}
}
