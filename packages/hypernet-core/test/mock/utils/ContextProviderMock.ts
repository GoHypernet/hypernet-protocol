import {
  Balances,
  ControlClaim,
  HypernetContext,
  InitializedHypernetContext,
  PullPayment,
  PushPayment,
} from "@hypernetlabs/objects";
import { CoreUninitializedError } from "@hypernetlabs/objects";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";
import { account, publicIdentifier } from "@mock/mocks";

export class ContextProviderMock implements IContextProvider {
  public context: HypernetContext;
  public initializedContext: InitializedHypernetContext;

  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentSent: Subject<PushPayment>;
  public onPullPaymentSent: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentReceived: Subject<PullPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;
  public onMerchantAuthorized: Subject<string>;
  public onAuthorizedMerchantUpdated: Subject<string>;
  public onAuthorizedMerchantActivationFailed: Subject<string>;
  public onMerchantIFrameDisplayRequested: Subject<string>;
  public onMerchantIFrameCloseRequested: Subject<string>;

  public authorizedMerchants: Map<string, string>;

  constructor(
    context: HypernetContext | null = null,
    initializedContext: InitializedHypernetContext | null = null,
    uninitializedAccount: string | null = null,
  ) {
    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentSent = new Subject<PushPayment>();
    this.onPullPaymentSent = new Subject<PullPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentReceived = new Subject<PullPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();
    this.onMerchantAuthorized = new Subject<string>();
    this.onAuthorizedMerchantUpdated = new Subject<string>();
    this.onAuthorizedMerchantActivationFailed = new Subject<string>();
    this.onMerchantIFrameDisplayRequested = new Subject<string>();
    this.onMerchantIFrameCloseRequested = new Subject<string>();

    this.authorizedMerchants = new Map<string, string>();

    if (context != null) {
      this.context = context;
    } else {
      this.context = new HypernetContext(
        uninitializedAccount,
        null,
        false,
        this.onControlClaimed,
        this.onControlYielded,
        this.onPushPaymentSent,
        this.onPullPaymentSent,
        this.onPushPaymentReceived,
        this.onPullPaymentReceived,
        this.onPushPaymentUpdated,
        this.onPullPaymentUpdated,
        this.onBalancesChanged,
        this.onMerchantAuthorized,
        this.onAuthorizedMerchantUpdated,
        this.onAuthorizedMerchantActivationFailed,
        this.onMerchantIFrameDisplayRequested,
        this.onMerchantIFrameCloseRequested,
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
        this.onPushPaymentSent,
        this.onPullPaymentSent,
        this.onPushPaymentReceived,
        this.onPullPaymentReceived,
        this.onPushPaymentUpdated,
        this.onPullPaymentUpdated,
        this.onBalancesChanged,
        this.onMerchantAuthorized,
        this.onAuthorizedMerchantUpdated,
        this.onAuthorizedMerchantActivationFailed,
        this.onMerchantIFrameDisplayRequested,
        this.onMerchantIFrameCloseRequested,
        this.authorizedMerchants,
      );
    }
  }

  public getContext(): ResultAsync<HypernetContext, never> {
    return okAsync(this.context);
  }

  public getInitializedContext(): ResultAsync<InitializedHypernetContext, CoreUninitializedError> {
    return okAsync(this.initializedContext);
  }

  public setContext(context: HypernetContext): ResultAsync<void, never> {
    return okAsync<null, never>(null).map(() => {});
  }
}
