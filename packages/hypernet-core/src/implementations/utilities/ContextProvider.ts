import {
  HypernetContext,
  ControlClaim,
  InitializedHypernetContext,
  PushPayment,
  PullPayment,
  Balances,
} from "@hypernetlabs/objects";
import { CoreUninitializedError } from "@hypernetlabs/objects/errors";
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
    onMerchantAuthorized: Subject<string>,
    onAuthorizedMerchantUpdated: Subject<string>,
    onAuthorizedMerchantActivationFailed: Subject<string>,
    onMerchantIFrameDisplayRequested: Subject<string>,
    onMerchantIFrameCloseRequested: Subject<string>,
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
      onMerchantAuthorized,
      onAuthorizedMerchantUpdated,
      onAuthorizedMerchantActivationFailed,
      onMerchantIFrameDisplayRequested,
      onMerchantIFrameCloseRequested,
    );
  }
  public getContext(): ResultAsync<HypernetContext, never> {
    return okAsync(this.context);
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
        this.context.onMerchantAuthorized,
        this.context.onAuthorizedMerchantUpdated,
        this.context.onAuthorizedMerchantActivationFailed,
        this.context.onMerchantIFrameDisplayRequested,
        this.context.onMerchantIFrameCloseRequested,
        new Map<string, string>(),
      ),
    );
  }

  public setContext(context: HypernetContext): ResultAsync<void, never> {
    this.context = context;
    return okAsync<null, never>(null).map(() => {
      return;
    });
  }
}
