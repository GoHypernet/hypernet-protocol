import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export class ActiveStateChannel {
  constructor(
    public chainId: ChainId,
    public routerPublicIdentifier: PublicIdentifier,
    public channelAddress: EthereumContractAddress,
  ) {}
}
