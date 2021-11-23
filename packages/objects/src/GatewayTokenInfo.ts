import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export class GatewayTokenInfo {
  constructor(
    public tokenAddress: EthereumContractAddress,
    public chainId: ChainId,
    public routerPublicIdentifiers: PublicIdentifier[],
  ) {}
}
