import {
  Balances,
  ControlClaim,
  HypernetContext,
  InitializedHypernetContext,
  PullPayment,
  PushPayment,
} from "@interfaces/objects";
import { CoreUninitializedError } from "@interfaces/objects/errors";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";
import { HyperMock, account, publicIdentifier } from "@mock/mocks";

export class ContextProviderMock extends HyperMock implements IContextProvider {
  protected context: HypernetContext;
  protected initializedContext: InitializedHypernetContext;

  protected onControlClaimed: Subject<ControlClaim>;
  protected onControlYielded: Subject<ControlClaim>;
  protected onPushPaymentProposed: Subject<PushPayment>;
  protected onPullPaymentProposed: Subject<PullPayment>;
  protected onPushPaymentReceived: Subject<PushPayment>;
  protected onPullPaymentApproved: Subject<PullPayment>;
  protected onPushPaymentUpdated: Subject<PushPayment>;
  protected onPullPaymentUpdated: Subject<PullPayment>;
  protected onBalancesChanged: Subject<Balances>;

  constructor(context: HypernetContext | null = null, initializedContext: InitializedHypernetContext | null = null) {
    super();

    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentProposed = new Subject<PushPayment>();
    this.onPullPaymentProposed = new Subject<PullPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentApproved = new Subject<PullPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();

    if (context != null) {
      this.context = context;
    } else {
      this.context = new HypernetContext(
        null,
        null,
        false,
        this.onControlClaimed,
        this.onControlYielded,
        this.onPushPaymentProposed,
        this.onPullPaymentProposed,
        this.onPushPaymentReceived,
        this.onPullPaymentApproved,
        this.onPushPaymentUpdated,
        this.onPullPaymentUpdated,
        this.onBalancesChanged,
      );
    }

    if (initializedContext != null) {
      this.initializedContext = initializedContext;
    } else {
      this.initializedContext = new InitializedHypernetContext(
        account,
        publicIdentifier,
        true,
        this.onControlClaimed,
        this.onControlYielded,
        this.onPushPaymentProposed,
        this.onPullPaymentProposed,
        this.onPushPaymentReceived,
        this.onPullPaymentApproved,
        this.onPushPaymentUpdated,
        this.onPullPaymentUpdated,
        this.onBalancesChanged,
      );
    }
  }

  public getContext(): ResultAsync<HypernetContext, never> {
    this.recordCall("getContext", arguments);

    return okAsync(this.context);
  }

  public getInitializedContext(): ResultAsync<InitializedHypernetContext, CoreUninitializedError> {
    this.recordCall("getInitializedContext", arguments);

    return okAsync(this.initializedContext);
  }

  public setContext(context: HypernetContext): ResultAsync<void, never> {
    this.recordCall("setContext", arguments);

    return this.voidResult();
  }
}
