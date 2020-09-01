import {
  HypernetContext,
  HypernetLink,
  EstablishLinkRequest,
  EstablishLinkRequestWithApproval,
} from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { Subject } from "rxjs";

export class ContextProvider implements IContextProvider {
  protected context: HypernetContext;
  constructor(
    onLinkUpdated: Subject<HypernetLink>,
    onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>,
    onLinkRejected: Subject<EstablishLinkRequest>,
  ) {
    this.context = new HypernetContext(null, onLinkUpdated, onLinkRequestReceived, onLinkRejected);
  }
  public async getContext(): Promise<HypernetContext> {
    return this.context;
  }

  public setContext(context: HypernetContext): void {
    this.context = context;
  }
}
