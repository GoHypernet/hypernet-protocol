import {
  ChainId,
  DefinitionName,
  ChainInformation,
  SchemaUrl,
  GovernanceChainInformation,
} from "@hypernetlabs/objects";

export class HypernetConfig {
  constructor(
    public iframeSource: string,
    public governanceChainId: ChainId,
    public chainInformation: Map<ChainId, ChainInformation>,
    public governanceChainInformation: GovernanceChainInformation,
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
    public governanceRequired: boolean,
    public paymentsRequired: boolean,
    public debug: boolean,
  ) {}
}
