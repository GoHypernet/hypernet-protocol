import {
  Balances,
  ControlClaim,
  EthereumAddress,
  GatewayUrl,
  PullPayment,
  PushPayment,
  Signature,
} from "@hypernetlabs/objects";
import {
  HypernetContext,
  InitializedHypernetContext,
} from "@interfaces/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import {
  IContextProvider,
  IGatewayConnectorProxy,
} from "@interfaces/utilities";
import { account, publicIdentifier } from "@mock/mocks";

export class ContextProviderMock implements IContextProvider {
  public context: HypernetContext;
  public initializedContext: InitializedHypernetContext;

  public onControlClaimed: Subject<ControlClaim>;
  public onControlClaimedActivations: ControlClaim[] = [];
  public onControlYielded: Subject<ControlClaim>;
  public onControlYieldedActivations: ControlClaim[] = [];
  public onPushPaymentSent: Subject<PushPayment>;
  public onPushPaymentSentActivations: PushPayment[] = [];
  public onPullPaymentSent: Subject<PullPayment>;
  public onPullPaymentSentActivations: PullPayment[] = [];
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPushPaymentReceivedActivations: PushPayment[] = [];
  public onPullPaymentReceived: Subject<PullPayment>;
  public onPullPaymentReceivedActivations: PullPayment[] = [];
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPushPaymentUpdatedActivations: PushPayment[] = [];
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onPullPaymentUpdatedActivations: PullPayment[] = [];
  public onPushPaymentDelayed: Subject<PushPayment>;
  public onPushPaymentDelayedActivations: PushPayment[] = [];
  public onPullPaymentDelayed: Subject<PullPayment>;
  public onPullPaymentDelayedActivations: PullPayment[] = [];
  public onPushPaymentCanceled: Subject<PushPayment>;
  public onPushPaymentCanceledActivations: PushPayment[] = [];
  public onPullPaymentCanceled: Subject<PullPayment>;
  public onPullPaymentCanceledActivations: PullPayment[] = [];
  public onBalancesChanged: Subject<Balances>;
  public onBalancesChangedActivations: Balances[] = [];
  public onDeStorageAuthenticationStarted: Subject<void>;
  public onDeStorageAuthenticationStartedActivationCount = 0;
  public onDeStorageAuthenticationSucceeded: Subject<void>;
  public onDeStorageAuthenticationSucceededActivationCount = 0;
  public onDeStorageAuthenticationFailed: Subject<void>;
  public onDeStorageAuthenticationFailedActivationCount = 0;
  public onGatewayAuthorized: Subject<GatewayUrl>;
  public onGatewayAuthorizedActivations: GatewayUrl[] = [];
  public onGatewayDeauthorizationStarted: Subject<GatewayUrl>;
  public onGatewayDeauthorizationStartedActivations: GatewayUrl[] = [];
  public onAuthorizedGatewayUpdated: Subject<GatewayUrl>;
  public onAuthorizedGatewayUpdatedActivations: GatewayUrl[] = [];
  public onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>;
  public onAuthorizedGatewayActivationFailedActivations: GatewayUrl[] = [];
  public onGatewayIFrameDisplayRequested: Subject<GatewayUrl>;
  public onGatewayIFrameDisplayRequestedActivations: GatewayUrl[] = [];
  public onGatewayIFrameCloseRequested: Subject<GatewayUrl>;
  public onGatewayIFrameCloseRequestedActivations: GatewayUrl[] = [];
  public onCoreIFrameDisplayRequested: Subject<void>;
  public onCoreIFrameDisplayRequestedActivationCount = 0;
  public onCoreIFrameCloseRequested: Subject<void>;
  public onCoreIFrameCloseRequestedActivationCount = 0;
  public onInitializationRequired: Subject<void>;
  public onInitializationRequiredActivationCount = 0;
  public onPrivateCredentialsRequested: Subject<void>;
  public onPrivateCredentialsRequestedActivationCount = 0;
  public onGatewayConnectorActivated: Subject<IGatewayConnectorProxy>;
  public onGatewayConnectorActivatedActivations: IGatewayConnectorProxy[] = [];

  public authorizedGateways: Map<GatewayUrl, Signature>;

  constructor(
    context: HypernetContext | null = null,
    initializedContext: InitializedHypernetContext | null = null,
    uninitializedAccount: EthereumAddress | null = null,
  ) {
    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlClaimed.subscribe((val) => {
      this.onControlClaimedActivations.push(val);
    });

    this.onControlYielded = new Subject<ControlClaim>();
    this.onControlYielded.subscribe((val) => {
      this.onControlYieldedActivations.push(val);
    });

    this.onPushPaymentSent = new Subject<PushPayment>();
    this.onPushPaymentSent.subscribe((val) => {
      this.onPushPaymentSentActivations.push(val);
    });

    this.onPullPaymentSent = new Subject<PullPayment>();
    this.onPullPaymentSent.subscribe((val) => {
      this.onPullPaymentSentActivations.push(val);
    });

    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPushPaymentReceived.subscribe((val) => {
      this.onPushPaymentReceivedActivations.push(val);
    });

    this.onPullPaymentReceived = new Subject<PullPayment>();
    this.onPullPaymentReceived.subscribe((val) => {
      this.onPullPaymentReceivedActivations.push(val);
    });

    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPushPaymentUpdated.subscribe((val) => {
      this.onPushPaymentUpdatedActivations.push(val);
    });

    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onPullPaymentUpdated.subscribe((val) => {
      this.onPullPaymentUpdatedActivations.push(val);
    });

    this.onPushPaymentDelayed = new Subject<PushPayment>();
    this.onPushPaymentDelayed.subscribe((val) => {
      this.onPushPaymentDelayedActivations.push(val);
    });

    this.onPullPaymentDelayed = new Subject<PullPayment>();
    this.onPullPaymentDelayed.subscribe((val) => {
      this.onPullPaymentDelayedActivations.push(val);
    });

    this.onPushPaymentCanceled = new Subject<PushPayment>();
    this.onPushPaymentCanceled.subscribe((val) => {
      this.onPushPaymentCanceledActivations.push(val);
    });

    this.onPullPaymentCanceled = new Subject<PullPayment>();
    this.onPullPaymentCanceled.subscribe((val) => {
      this.onPullPaymentCanceledActivations.push(val);
    });

    this.onBalancesChanged = new Subject<Balances>();
    this.onBalancesChanged.subscribe((val) => {
      this.onBalancesChangedActivations.push(val);
    });

    this.onDeStorageAuthenticationStarted = new Subject<void>();
    this.onDeStorageAuthenticationStarted.subscribe(() => {
      this.onDeStorageAuthenticationStartedActivationCount++;
    });

    this.onDeStorageAuthenticationSucceeded = new Subject<void>();
    this.onDeStorageAuthenticationSucceeded.subscribe(() => {
      this.onDeStorageAuthenticationSucceededActivationCount++;
    });

    this.onDeStorageAuthenticationFailed = new Subject<void>();
    this.onDeStorageAuthenticationFailed.subscribe(() => {
      this.onDeStorageAuthenticationFailedActivationCount++;
    });

    this.onGatewayAuthorized = new Subject<GatewayUrl>();
    this.onGatewayAuthorized.subscribe((val) => {
      this.onGatewayAuthorizedActivations.push(val);
    });

    this.onGatewayDeauthorizationStarted = new Subject<GatewayUrl>();
    this.onGatewayDeauthorizationStarted.subscribe((val) => {
      this.onGatewayDeauthorizationStartedActivations.push(val);
    });

    this.onAuthorizedGatewayUpdated = new Subject<GatewayUrl>();
    this.onAuthorizedGatewayUpdated.subscribe((val) => {
      this.onAuthorizedGatewayUpdatedActivations.push(val);
    });

    this.onAuthorizedGatewayActivationFailed = new Subject<GatewayUrl>();
    this.onAuthorizedGatewayActivationFailed.subscribe((val) => {
      this.onAuthorizedGatewayActivationFailedActivations.push(val);
    });

    this.onGatewayIFrameDisplayRequested = new Subject<GatewayUrl>();
    this.onGatewayIFrameDisplayRequested.subscribe((val) => {
      this.onGatewayIFrameDisplayRequestedActivations.push(val);
    });

    this.onGatewayIFrameCloseRequested = new Subject<GatewayUrl>();
    this.onGatewayIFrameCloseRequested.subscribe((val) => {
      this.onGatewayIFrameCloseRequestedActivations.push(val);
    });

    this.onCoreIFrameDisplayRequested = new Subject<void>();
    this.onCoreIFrameDisplayRequested.subscribe(() => {
      this.onCoreIFrameDisplayRequestedActivationCount++;
    });

    this.onCoreIFrameCloseRequested = new Subject<void>();
    this.onCoreIFrameCloseRequested.subscribe(() => {
      this.onCoreIFrameCloseRequestedActivationCount++;
    });

    this.onInitializationRequired = new Subject<void>();
    this.onInitializationRequired.subscribe(() => {
      this.onInitializationRequiredActivationCount++;
    });

    this.onPrivateCredentialsRequested = new Subject<void>();
    this.onPrivateCredentialsRequested.subscribe(() => {
      this.onPrivateCredentialsRequestedActivationCount++;
    });

    this.onGatewayConnectorActivated = new Subject<IGatewayConnectorProxy>();
    this.onGatewayConnectorActivated.subscribe((val) => {
      this.onGatewayConnectorActivatedActivations.push(val);
    });

    this.authorizedGateways = new Map<GatewayUrl, Signature>();

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
        this.onPushPaymentCanceled,
        this.onPullPaymentCanceled,
        this.onBalancesChanged,
        this.onDeStorageAuthenticationStarted,
        this.onDeStorageAuthenticationSucceeded,
        this.onDeStorageAuthenticationFailed,
        this.onGatewayAuthorized,
        this.onGatewayDeauthorizationStarted,
        this.onAuthorizedGatewayUpdated,
        this.onAuthorizedGatewayActivationFailed,
        this.onGatewayIFrameDisplayRequested,
        this.onGatewayIFrameCloseRequested,
        this.onCoreIFrameDisplayRequested,
        this.onCoreIFrameCloseRequested,
        this.onInitializationRequired,
        this.onPrivateCredentialsRequested,
        this.onGatewayConnectorActivated,
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
        this.onPushPaymentCanceled,
        this.onPullPaymentCanceled,
        this.onBalancesChanged,
        this.onDeStorageAuthenticationStarted,
        this.onDeStorageAuthenticationSucceeded,
        this.onDeStorageAuthenticationFailed,
        this.onGatewayAuthorized,
        this.onGatewayDeauthorizationStarted,
        this.onAuthorizedGatewayUpdated,
        this.onAuthorizedGatewayActivationFailed,
        this.onGatewayIFrameDisplayRequested,
        this.onGatewayIFrameCloseRequested,
        this.onCoreIFrameDisplayRequested,
        this.onCoreIFrameCloseRequested,
        this.onInitializationRequired,
        this.onPrivateCredentialsRequested,
        this.onGatewayConnectorActivated,
        this.authorizedGateways,
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

  public assertEventCounts(expectedCounts: IExpectedEventCounts): void {
    const counts: IExpectedEventCounts = {
      onControlClaimed: 0,
      onControlYielded: 0,
      onPushPaymentSent: 0,
      onPullPaymentSent: 0,
      onPushPaymentReceived: 0,
      onPullPaymentReceived: 0,
      onPushPaymentUpdated: 0,
      onPullPaymentUpdated: 0,
      onPushPaymentDelayed: 0,
      onPullPaymentDelayed: 0,
      onBalancesChanged: 0,
      onDeStorageAuthenticationStarted: 0,
      onDeStorageAuthenticationSucceeded: 0,
      onDeStorageAuthenticationFailed: 0,
      onGatewayAuthorized: 0,
      onGatewayDeauthorizationStarted: 0,
      onAuthorizedGatewayUpdated: 0,
      onAuthorizedGatewayActivationFailed: 0,
      onGatewayIFrameDisplayRequested: 0,
      onGatewayIFrameCloseRequested: 0,
      onInitializationRequired: 0,
      onPrivateCredentialsRequested: 0,
      onGatewayConnectorActivated: 0,
      authorizedGateways: 0,
    };

    // Merge the passed in counts with the basic counts
    Object.assign(counts, expectedCounts);

    expect(this.onControlClaimedActivations.length).toBe(
      counts.onControlClaimed,
    );
    expect(this.onControlYieldedActivations.length).toBe(
      counts.onControlYielded,
    );
    expect(this.onPushPaymentSentActivations.length).toBe(
      counts.onPushPaymentSent,
    );
    expect(this.onPullPaymentSentActivations.length).toBe(
      counts.onPullPaymentSent,
    );
    expect(this.onPushPaymentReceivedActivations.length).toBe(
      counts.onPushPaymentReceived,
    );
    expect(this.onPullPaymentReceivedActivations.length).toBe(
      counts.onPullPaymentReceived,
    );
    expect(this.onPushPaymentUpdatedActivations.length).toBe(
      counts.onPushPaymentUpdated,
    );
    expect(this.onPullPaymentUpdatedActivations.length).toBe(
      counts.onPullPaymentUpdated,
    );
    expect(this.onPushPaymentDelayedActivations.length).toBe(
      counts.onPushPaymentDelayed,
    );
    expect(this.onPullPaymentDelayedActivations.length).toBe(
      counts.onPullPaymentDelayed,
    );
    expect(this.onBalancesChangedActivations.length).toBe(
      counts.onBalancesChanged,
    );
    expect(this.onDeStorageAuthenticationStartedActivationCount).toBe(
      counts.onDeStorageAuthenticationStarted,
    );
    expect(this.onDeStorageAuthenticationSucceededActivationCount).toBe(
      counts.onDeStorageAuthenticationSucceeded,
    );
    expect(this.onDeStorageAuthenticationFailedActivationCount).toBe(
      counts.onDeStorageAuthenticationFailed,
    );
    expect(this.onGatewayAuthorizedActivations.length).toBe(
      counts.onGatewayAuthorized,
    );
    expect(this.onGatewayDeauthorizationStartedActivations.length).toBe(
      counts.onGatewayDeauthorizationStarted,
    );
    expect(this.onAuthorizedGatewayUpdatedActivations.length).toBe(
      counts.onAuthorizedGatewayUpdated,
    );
    expect(this.onAuthorizedGatewayActivationFailedActivations.length).toBe(
      counts.onAuthorizedGatewayActivationFailed,
    );
    expect(this.onGatewayIFrameDisplayRequestedActivations.length).toBe(
      counts.onGatewayIFrameDisplayRequested,
    );
    expect(this.onGatewayIFrameCloseRequestedActivations.length).toBe(
      counts.onGatewayIFrameCloseRequested,
    );
    expect(this.onInitializationRequiredActivationCount).toBe(
      counts.onInitializationRequired,
    );
    expect(this.onPrivateCredentialsRequestedActivationCount).toBe(
      counts.onPrivateCredentialsRequested,
    );
    expect(this.onGatewayConnectorActivatedActivations.length).toBe(
      counts.onGatewayConnectorActivated,
    );
  }
}

export interface IExpectedEventCounts {
  onControlClaimed?: number;
  onControlYielded?: number;
  onPushPaymentSent?: number;
  onPullPaymentSent?: number;
  onPushPaymentReceived?: number;
  onPullPaymentReceived?: number;
  onPushPaymentUpdated?: number;
  onPullPaymentUpdated?: number;
  onPushPaymentDelayed?: number;
  onPullPaymentDelayed?: number;
  onBalancesChanged?: number;
  onDeStorageAuthenticationStarted?: number;
  onDeStorageAuthenticationSucceeded?: number;
  onDeStorageAuthenticationFailed?: number;
  onGatewayAuthorized?: number;
  onGatewayDeauthorizationStarted?: number;
  onAuthorizedGatewayUpdated?: number;
  onAuthorizedGatewayActivationFailed?: number;
  onGatewayIFrameDisplayRequested?: number;
  onGatewayIFrameCloseRequested?: number;
  onInitializationRequired?: number;
  onPrivateCredentialsRequested?: number;
  onGatewayConnectorActivated?: number;
  authorizedGateways?: number;
}
