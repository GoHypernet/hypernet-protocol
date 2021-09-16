import { ChainProviders } from "@connext/vector-types";
import {
  ChainId,
  DefinitionName,
  EthereumAddress,
  SchemaUrl,
} from "@hypernetlabs/objects";

export class HypernetConfig {
  constructor(
    public iframeSource: string,
    public infuraId: string,
    public governanceChainId: ChainId,
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
    public channelFactoryAddress: EthereumAddress,
    public transferRegistryAddress: EthereumAddress,
    public hypertokenAddress: EthereumAddress,
    public messageTransferAddress: EthereumAddress,
    public insuranceTransferAddress: EthereumAddress,
    public parameterizedTransferAddress: EthereumAddress,
    public gatewayRegistryAddress: EthereumAddress,
    public liquidityRegistryAddress: EthereumAddress,
    public hypernetGovernorAddress: EthereumAddress,
    public registryFactoryAddress: EthereumAddress,
  ) {}
}
