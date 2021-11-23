import { ChainId } from "@objects/ChainId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { UUID } from "@objects/UUID";
export interface IStateChannelRequest {
  id: UUID;
  chainId: ChainId;
  routerPublicIdentifiers: PublicIdentifier[];
}
