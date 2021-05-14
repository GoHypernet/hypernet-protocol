import {
  Balances,
  ControlClaim,
  EthereumAddress,
  MerchantUrl,
  PullPayment,
  PushPayment,
  Signature,
} from "@hypernetlabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import {
  HypernetContext,
  InitializedHypernetContext,
} from "@interfaces/objects";
import {
  IContextProvider,
  IMerchantConnectorProxy,
} from "@interfaces/utilities";
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
  public onPushPaymentDelayed: Subject<PushPayment>;
  public onPullPaymentDelayed: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;
  public onDeStorageAuthenticationStarted: Subject<void>;
  public onDeStorageAuthenticationSucceeded: Subject<void>;
  public onDeStorageAuthenticationFailed: Subject<void>;
  public onMerchantAuthorized: Subject<MerchantUrl>;
  public onAuthorizedMerchantUpdated: Subject<MerchantUrl>;
  public onAuthorizedMerchantActivationFailed: Subject<MerchantUrl>;
  public onMerchantIFrameDisplayRequested: Subject<MerchantUrl>;
  public onMerchantIFrameCloseRequested: Subject<MerchantUrl>;
  public onInitializationRequired: Subject<void>;
  public onPrivateCredentialsRequested: Subject<void>;
  public onMerchantConnectorActivated: Subject<IMerchantConnectorProxy>;

  public authorizedMerchants: Map<MerchantUrl, Signature>;

  constructor(
    context: HypernetContext | null = null,
    initializedContext: InitializedHypernetContext | null = null,
    uninitializedAccount: EthereumAddress | null = null,
  ) {
    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentSent = new Subject<PushPayment>();
    this.onPullPaymentSent = new Subject<PullPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentReceived = new Subject<PullPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onPushPaymentDelayed = new Subject<PushPayment>();
    this.onPullPaymentDelayed = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();
    this.onDeStorageAuthenticationStarted = new Subject<void>();
    this.onDeStorageAuthenticationSucceeded = new Subject<void>();
    this.onDeStorageAuthenticationFailed = new Subject<void>();
    this.onMerchantAuthorized = new Subject<MerchantUrl>();
    this.onAuthorizedMerchantUpdated = new Subject<MerchantUrl>();
    this.onAuthorizedMerchantActivationFailed = new Subject<MerchantUrl>();
    this.onMerchantIFrameDisplayRequested = new Subject<MerchantUrl>();
    this.onMerchantIFrameCloseRequested = new Subject<MerchantUrl>();
    this.onInitializationRequired = new Subject<void>();
    this.onPrivateCredentialsRequested = new Subject<void>();
    this.onMerchantConnectorActivated = new Subject();

    this.authorizedMerchants = new Map<MerchantUrl, Signature>();

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
        this.onPushPaymentDelayed,
        this.onPullPaymentDelayed,
        this.onBalancesChanged,
        this.onDeStorageAuthenticationStarted,
        this.onDeStorageAuthenticationSucceeded,
        this.onDeStorageAuthenticationFailed,
        this.onMerchantAuthorized,
        this.onAuthorizedMerchantUpdated,
        this.onAuthorizedMerchantActivationFailed,
        this.onMerchantIFrameDisplayRequested,
        this.onMerchantIFrameCloseRequested,
        this.onInitializationRequired,
        this.onPrivateCredentialsRequested,
        this.onMerchantConnectorActivated,
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
        this.onPushPaymentDelayed,
        this.onPullPaymentDelayed,
        this.onBalancesChanged,
        this.onDeStorageAuthenticationStarted,
        this.onDeStorageAuthenticationSucceeded,
        this.onDeStorageAuthenticationFailed,
        this.onMerchantAuthorized,
        this.onAuthorizedMerchantUpdated,
        this.onAuthorizedMerchantActivationFailed,
        this.onMerchantIFrameDisplayRequested,
        this.onMerchantIFrameCloseRequested,
        this.onInitializationRequired,
        this.onPrivateCredentialsRequested,
        this.onMerchantConnectorActivated,
        this.authorizedMerchants,
      );
    }
  }

  public getContext(): ResultAsync<HypernetContext, never> {
    return okAsync(this.context);
  }

  public getAccount(): ResultAsync<string, never> {
    return okAsync(this.context.account || "");
  }

  public getInitializedContext(): ResultAsync<
    InitializedHypernetContext,
    never
  > {
    return okAsync(this.initializedContext);
  }

  public setContext(context: HypernetContext): ResultAsync<void, never> {
    return okAsync<null, never>(null).map(() => {});
  }
}
