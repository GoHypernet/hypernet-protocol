import { ChainId } from "@objects/ChainId";
import { EthereumAddress } from "@objects/EthereumAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export class ActiveStateChannel {
  constructor(
    public chainId: ChainId,
    public routerPublicIdentifier: PublicIdentifier,
    public channelAddress: EthereumAddress,
  ) {}
}
