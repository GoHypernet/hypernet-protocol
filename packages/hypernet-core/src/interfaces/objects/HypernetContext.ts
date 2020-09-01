import { HypernetLink } from "./HypernetLink";
import { Subject } from "rxjs";
import { EstablishLinkRequestWithApproval, EstablishLinkRequest } from "./EstablishLinkRequest";

export class HypernetContext {
  constructor(
    public account: string | null,
    public onLinkUpdated: Subject<HypernetLink>,
    public onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>,
    public onLinkRejected: Subject<EstablishLinkRequest>,
  ) {}
}
