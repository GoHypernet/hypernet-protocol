import { ChainId } from "@objects/ChainId";
import { EthereumAddress } from "@objects/EthereumAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export class GatewayTokenInfo {
  constructor(
    public tokenAddress: EthereumAddress,
    public chainId: ChainId,
    public routerPublicIdentifiers: PublicIdentifier[],
  ) {}
}
