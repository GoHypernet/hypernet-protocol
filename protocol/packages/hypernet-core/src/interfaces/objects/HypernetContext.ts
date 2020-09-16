import { HypernetLink } from "./HypernetLink";
import { Subject } from "rxjs";
import { EstablishLinkRequestWithApproval, EstablishLinkRequest } from "./EstablishLinkRequest";
import { ControlClaim } from "./ControlClaim";

export class HypernetContext {
  constructor(
    public account: string | null,
    public inControl: boolean,
    public onLinkUpdated: Subject<HypernetLink>,
    public onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>,
    public onLinkRejected: Subject<EstablishLinkRequest>,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
  ) {}
}
