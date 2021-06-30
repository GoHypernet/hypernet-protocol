import {
  Balances,
  ControlClaim,
  EthereumAddress,
  GatewayUrl,
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
  public onBalancesChanged: Subject<Balances>;
  public onBalancesChangedActivations: Balances[] = [];
  public onDeStorageAuthenticationStarted: Subject<void>;
  public onDeStorageAuthenticationStartedActivationCount = 0;
  public onDeStorageAuthenticationSucceeded: Subject<void>;
  public onDeStorageAuthenticationSucceededActivationCount = 0;
  public onDeStorageAuthenticationFailed: Subject<void>;
  public onDeStorageAuthenticationFailedActivationCount = 0;
  public onMerchantAuthorized: Subject<GatewayUrl>;
  public onMerchantAuthorizedActivations: GatewayUrl[] = [];
  public onMerchantDeauthorizationStarted: Subject<GatewayUrl>;
  public onMerchantDeauthorizationStartedActivations: GatewayUrl[] = [];
  public onAuthorizedMerchantUpdated: Subject<GatewayUrl>;
  public onAuthorizedMerchantUpdatedActivations: GatewayUrl[] = [];
  public onAuthorizedMerchantActivationFailed: Subject<GatewayUrl>;
  public onAuthorizedMerchantActivationFailedActivations: GatewayUrl[] = [];
  public onMerchantIFrameDisplayRequested: Subject<GatewayUrl>;
  public onMerchantIFrameDisplayRequestedActivations: GatewayUrl[] = [];
  public onMerchantIFrameCloseRequested: Subject<GatewayUrl>;
  public onMerchantIFrameCloseRequestedActivations: GatewayUrl[] = [];
  public onInitializationRequired: Subject<void>;
  public onInitializationRequiredActivationCount = 0;
  public onPrivateCredentialsRequested: Subject<void>;
  public onPrivateCredentialsRequestedActivationCount = 0;
  public onMerchantConnectorActivated: Subject<IMerchantConnectorProxy>;
  public onMerchantConnectorActivatedActivations: IMerchantConnectorProxy[] = [];

  public authorizedMerchants: Map<GatewayUrl, Signature>;

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

    this.onMerchantAuthorized = new Subject<GatewayUrl>();
    this.onMerchantAuthorized.subscribe((val) => {
      this.onMerchantAuthorizedActivations.push(val);
    });

    this.onMerchantDeauthorizationStarted = new Subject<GatewayUrl>();
    this.onMerchantDeauthorizationStarted.subscribe((val) => {
      this.onMerchantDeauthorizationStartedActivations.push(val);
    });

    this.onAuthorizedMerchantUpdated = new Subject<GatewayUrl>();
    this.onAuthorizedMerchantUpdated.subscribe((val) => {
      this.onAuthorizedMerchantUpdatedActivations.push(val);
    });

    this.onAuthorizedMerchantActivationFailed = new Subject<GatewayUrl>();
    this.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      this.onAuthorizedMerchantActivationFailedActivations.push(val);
    });

    this.onMerchantIFrameDisplayRequested = new Subject<GatewayUrl>();
    this.onMerchantIFrameDisplayRequested.subscribe((val) => {
      this.onMerchantIFrameDisplayRequestedActivations.push(val);
    });

    this.onMerchantIFrameCloseRequested = new Subject<GatewayUrl>();
    this.onMerchantIFrameCloseRequested.subscribe((val) => {
      this.onMerchantIFrameCloseRequestedActivations.push(val);
    });

    this.onInitializationRequired = new Subject<void>();
    this.onInitializationRequired.subscribe(() => {
      this.onInitializationRequiredActivationCount++;
    });

    this.onPrivateCredentialsRequested = new Subject<void>();
    this.onPrivateCredentialsRequested.subscribe(() => {
      this.onPrivateCredentialsRequestedActivationCount++;
    });

    this.onMerchantConnectorActivated = new Subject<IMerchantConnectorProxy>();
    this.onMerchantConnectorActivated.subscribe((val) => {
      this.onMerchantConnectorActivatedActivations.push(val);
    });

    this.authorizedMerchants = new Map<GatewayUrl, Signature>();

    if (context != null) {
      this.context = context;
    } else {
      this.context = new HypernetContext(
        uninitializedAccount,
        null,
        false,
        window.ethereum != null,
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
        this.onMerchantDeauthorizationStarted,
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
        window.ethereum != null,
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
        this.onMerchantDeauthorizationStarted,
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
      onMerchantAuthorized: 0,
      onMerchantDeauthorizationStarted: 0,
      onAuthorizedMerchantUpdated: 0,
      onAuthorizedMerchantActivationFailed: 0,
      onMerchantIFrameDisplayRequested: 0,
      onMerchantIFrameCloseRequested: 0,
      onInitializationRequired: 0,
      onPrivateCredentialsRequested: 0,
      onMerchantConnectorActivated: 0,
      authorizedMerchants: 0,
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
    expect(this.onMerchantAuthorizedActivations.length).toBe(
      counts.onMerchantAuthorized,
    );
    expect(this.onMerchantDeauthorizationStartedActivations.length).toBe(
      counts.onMerchantDeauthorizationStarted,
    );
    expect(this.onAuthorizedMerchantUpdatedActivations.length).toBe(
      counts.onAuthorizedMerchantUpdated,
    );
    expect(this.onAuthorizedMerchantActivationFailedActivations.length).toBe(
      counts.onAuthorizedMerchantActivationFailed,
    );
    expect(this.onMerchantIFrameDisplayRequestedActivations.length).toBe(
      counts.onMerchantIFrameDisplayRequested,
    );
    expect(this.onMerchantIFrameCloseRequestedActivations.length).toBe(
      counts.onMerchantIFrameCloseRequested,
    );
    expect(this.onInitializationRequiredActivationCount).toBe(
      counts.onInitializationRequired,
    );
    expect(this.onPrivateCredentialsRequestedActivationCount).toBe(
      counts.onPrivateCredentialsRequested,
    );
    expect(this.onMerchantConnectorActivatedActivations.length).toBe(
      counts.onMerchantConnectorActivated,
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
  onMerchantAuthorized?: number;
  onMerchantDeauthorizationStarted?: number;
  onAuthorizedMerchantUpdated?: number;
  onAuthorizedMerchantActivationFailed?: number;
  onMerchantIFrameDisplayRequested?: number;
  onMerchantIFrameCloseRequested?: number;
  onInitializationRequired?: number;
  onPrivateCredentialsRequested?: number;
  onMerchantConnectorActivated?: number;
  authorizedMerchants?: number;
}
