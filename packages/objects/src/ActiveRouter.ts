import { ChainId } from "@objects/ChainId";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export class ActiveRouter {
  constructor(
    public chainId: ChainId,
    public routerPublicIdentifier: PublicIdentifier,
  ) {}
}
