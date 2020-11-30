import {
  HypernetContext,
  ControlClaim,
  InitializedHypernetContext,
  PushPayment,
  PullPayment,
  Balances,
} from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { Subject } from "rxjs";

export class ContextProvider implements IContextProvider {
  protected context: HypernetContext;
  constructor(
    onControlClaimed: Subject<ControlClaim>,
    onControlYielded: Subject<ControlClaim>,
    onPushPaymentProposed: Subject<PushPayment>,
    onPullPaymentProposed: Subject<PullPayment>,
    onPushPaymentReceived: Subject<PushPayment>,
    onPullPaymentApproved: Subject<PullPayment>,
    onBalancesChanged: Subject<Balances>,
  ) {
    this.context = new HypernetContext(
      null,
      null,
      false,
      onControlClaimed,
      onControlYielded,
      onPushPaymentProposed,
      onPullPaymentProposed,
      onPushPaymentReceived,
      onPullPaymentApproved,
      onBalancesChanged,
    );
  }
  public async getContext(): Promise<HypernetContext> {
    return this.context;
  }

  public async getInitializedContext(): Promise<InitializedHypernetContext> {
    if (this.context.account == null || this.context.publicIdentifier == null) {
      throw new Error("Can not open a link until you have set your working account. Call HypernetCore.initialize()!");
    }

    return new InitializedHypernetContext(
      this.context.account,
      this.context.publicIdentifier,
      this.context.inControl,
      this.context.onControlClaimed,
      this.context.onControlYielded,
      this.context.onPushPaymentProposed,
      this.context.onPullPaymentProposed,
      this.context.onPushPaymentReceived,
      this.context.onPullPaymentApproved,
      this.context.onBalancesChanged,
    );
  }

  public setContext(context: HypernetContext): void {
    this.context = context;
  }
}
