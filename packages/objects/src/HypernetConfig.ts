import { ChainAddresses, ChainProviders } from "@connext/vector-types";

import { DefinitionName } from "@objects/DefinitionName";
import { EthereumAddress } from "@objects/EthereumAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { SchemaUrl } from "@objects/SchemaUrl";

export class HypernetConfig {
  constructor(
    public iframeSource: string,
    public routerPublicIdentifier: PublicIdentifier,
    public chainId: number,
    public hypertokenAddress: EthereumAddress,
    public messageTransferAddress: EthereumAddress,
    public insuranceTransferAddress: EthereumAddress,
    public parameterizedTransferAddress: EthereumAddress,
    public hypernetProtocolDomain: string,
    public defaultPaymentExpiryLength: number,
    public chainProviders: ChainProviders,
    public chainAddresses: ChainAddresses,
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
