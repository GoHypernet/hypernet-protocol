import {
  HypernetContext,
  ControlClaim,
  InitializedHypernetContext,
  PushPayment,
  PullPayment,
  Balances,
} from "@interfaces/objects";
import { CoreUninitializedError } from "@interfaces/objects/errors";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { Subject } from "rxjs";
import { okAsync, errAsync, ResultAsync } from "neverthrow";

export class ContextProvider implements IContextProvider {
  protected context: HypernetContext;
  constructor(
    onControlClaimed: Subject<ControlClaim>,
    onControlYielded: Subject<ControlClaim>,
    onPushPaymentProposed: Subject<PushPayment>,
    onPullPaymentProposed: Subject<PullPayment>,
    onPushPaymentReceived: Subject<PushPayment>,
    onPullPaymentApproved: Subject<PullPayment>,
    onPushPaymentUpdated: Subject<PushPayment>,
    onPullPaymentUpdated: Subject<PullPayment>,
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
      onPushPaymentUpdated,
      onPullPaymentUpdated,
      onBalancesChanged,
    );
  }
  public async getContext(): Promise<HypernetContext> {
    return this.context;
  }

  public getInitializedContext(): ResultAsync<InitializedHypernetContext, CoreUninitializedError> {
    if (this.context.account == null || this.context.publicIdentifier == null) {
      return errAsync(new CoreUninitializedError());
    }

    return okAsync(
      new InitializedHypernetContext(
        this.context.account,
        this.context.publicIdentifier,
        this.context.inControl,
        this.context.onControlClaimed,
        this.context.onControlYielded,
        this.context.onPushPaymentProposed,
        this.context.onPullPaymentProposed,
        this.context.onPushPaymentReceived,
        this.context.onPullPaymentApproved,
        this.context.onPushPaymentUpdated,
        this.context.onPullPaymentUpdated,
        this.context.onBalancesChanged,
      ),
    );
  }

  public setContext(context: HypernetContext): void {
    this.context = context;
  }
}
