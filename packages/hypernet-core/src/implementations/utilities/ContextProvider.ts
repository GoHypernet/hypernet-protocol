import {
  HypernetContext,
  HypernetLink,
  EstablishLinkRequest,
  EstablishLinkRequestWithApproval,
  ControlClaim,
} from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { Subject } from "rxjs";

export class ContextProvider implements IContextProvider {
  protected context: HypernetContext;
  constructor(
    onLinkUpdated: Subject<HypernetLink>,
    onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>,
    onLinkRejected: Subject<EstablishLinkRequest>,
    onControlClaimed: Subject<ControlClaim>,
    onControlYielded: Subject<ControlClaim>,
  ) {
    this.context = new HypernetContext(
      null,
      false,
      onLinkUpdated,
      onLinkRequestReceived,
      onLinkRejected,
      onControlClaimed,
      onControlYielded,
    );
  }
  public async getContext(): Promise<HypernetContext> {
    return this.context;
  }

  public setContext(context: HypernetContext): void {
    this.context = context;
  }
}
