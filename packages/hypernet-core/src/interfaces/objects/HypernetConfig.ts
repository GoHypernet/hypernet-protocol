import {
  ChainId,
  DefinitionName,
  ChainInformation,
  SchemaUrl,
  GovernanceChainInformation,
} from "@hypernetlabs/objects";
import { DataModel } from "@glazed/datamodel";
import type { ModelData } from "@glazed/types";

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
    public ceramicDataModel: ModelData<string>,
    public gatewayDeauthorizationTimeout: number,
    public controlClaimSubject: string,
    public requireOnline: boolean,
    public governanceRequired: boolean,
    public paymentsRequired: boolean,
    public debug: boolean,
  ) {}
}
