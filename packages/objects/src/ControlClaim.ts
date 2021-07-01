import { PublicIdentifier } from "@objects/PublicIdentifier";
import { UnixTimestamp } from "@objects/UnixTimestamp";

export class ControlClaim {
  constructor(
    public publicIdentifier: PublicIdentifier,
    public timestamp: UnixTimestamp,
  ) {}
}
