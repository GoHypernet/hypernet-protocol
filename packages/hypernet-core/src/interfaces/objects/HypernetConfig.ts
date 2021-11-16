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
    public chainRegistryAddress: EthereumContractAddress,
    public hypernetProtocolDomain: string,
    public defaultPaymentExpiryLength: number,
    public natsUrl: string,
    public authUrl: string,
    public gatewayIframeUrl: string,
    public ceramicNodeUrl: string,
    public storageAliases: Map<DefinitionName, SchemaUrl>,
    public gatewayDeauthorizationTimeout: number,
    public controlClaimSubject: string,
    public requireOnline: boolean,
    public debug: boolean,
  ) {}
}
