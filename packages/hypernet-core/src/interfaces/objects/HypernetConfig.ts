import {
  ChainId,
  ChainInformation,
  GovernanceChainInformation,
} from "@hypernetlabs/objects";
import { ModelData } from "@glazed/types";

export class HypernetConfig {
  constructor(
    public iframeSource: string,
    public defaultGovernanceChainId: ChainId,
    public chainInformation: Map<ChainId, ChainInformation>,
    public defaultGovernanceChainInformation: GovernanceChainInformation,
    public hypernetProtocolDomain: string,
    public defaultPaymentExpiryLength: number,
    public natsUrl: string,
    public authUrl: string,
    public gatewayIframeUrl: string,
    public ceramicNodeUrl: string,
    public ceramicDataModel: ModelData<string>,
    public gatewayDeauthorizationTimeout: number,
    public controlClaimSubject: string,
    public requireOnline: boolean,
    public ipfsApiUrl: string,
    public ipfsGatewayUrl: string,
    public debug: boolean,
  ) {}
}
