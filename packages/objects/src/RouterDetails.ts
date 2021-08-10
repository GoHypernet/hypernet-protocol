import { ChainId } from "@objects/ChainId";
import { EthereumAddress } from "@objects/EthereumAddress";
import { GatewayUrl } from "@objects/GatewayUrl";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export class RouterDetails {
  constructor(
    public publicIdentifier: PublicIdentifier,
    public supportedTokens: SupportedToken[],
    public allowedGateways: GatewayUrl[],
  ) {}
}

export class SupportedToken {
  constructor(public chainId: ChainId, public tokenAddress: EthereumAddress) {}
}
