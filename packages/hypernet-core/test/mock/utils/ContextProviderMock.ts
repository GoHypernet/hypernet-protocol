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
import { account, publicIdentifier } from "@mock/mocks";

export class ContextProviderMock implements IContextProvider {
  public context: HypernetContext;
  public initializedContext: InitializedHypernetContext;

  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentProposed: Subject<PushPayment>;
  public onPullPaymentProposed: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentApproved: Subject<PullPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;
  public onMerchantAuthorized: Subject<string>;
  public onAuthorizedMerchantUpdated: Subject<string>;
  public onAuthorizedMerchantActivationFailed: Subject<string>;

  public authorizedMerchants: Map<string, string>;

  constructor(context: HypernetContext | null = null, initializedContext: InitializedHypernetContext | null = null) {
    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentProposed = new Subject<PushPayment>();
    this.onPullPaymentProposed = new Subject<PullPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentApproved = new Subject<PullPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();
    this.onMerchantAuthorized = new Subject<string>();
    this.onAuthorizedMerchantUpdated = new Subject<string>();
    this.onAuthorizedMerchantActivationFailed = new Subject<string>();

    this.authorizedMerchants = new Map<string, string>();

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
        this.onMerchantAuthorized,
        this.onAuthorizedMerchantUpdated,
        this.onAuthorizedMerchantActivationFailed,
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
        this.onMerchantAuthorized,
        this.onAuthorizedMerchantUpdated,
        this.onAuthorizedMerchantActivationFailed,
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
