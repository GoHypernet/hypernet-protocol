import {
  ActiveStateChannel,
  Balances,
  ChainId,
  ControlClaim,
  GatewayUrl,
  PullPayment,
  PushPayment,
  EthereumAccountAddress,
  InitializeStatus,
} from "@hypernetlabs/objects";
import {
  HypernetContext,
  InitializedHypernetContext,
} from "@interfaces/objects";
import { account, activeStateChannel, publicIdentifier } from "@mock/mocks";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import {
  IContextProvider,
  IGatewayConnectorProxy,
} from "@interfaces/utilities";

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
  public onCeramicAuthenticationStarted: Subject<void>;
  public onCeramicAuthenticationStartedActivationCount = 0;
  public onCeramicAuthenticationSucceeded: Subject<void>;
  public onCeramicAuthenticationSucceededActivationCount = 0;
  public onCeramicFailed: Subject<Error>;
  public onCeramicFailedActivationCount = 0;
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
  public onWalletConnectOptionsDisplayRequested: Subject<void>;
  public onWalletConnectOptionsDisplayRequestedActivationCount = 0;
  public onGatewayConnectorActivated: Subject<IGatewayConnectorProxy>;
  public onGatewayConnectorActivatedActivations: IGatewayConnectorProxy[] = [];
  public onStateChannelCreated: Subject<ActiveStateChannel>;
  public onStateChannelCreatedActivations: ActiveStateChannel[] = [];
  public onChainConnected: Subject<ChainId>;
  public onChainConnectedActivations: ChainId[] = [];
  public onGovernanceChainConnected: Subject<ChainId>;
  public onGovernanceChainConnectedActivations: ChainId[] = [];
  public onChainChanged: Subject<ChainId>;
  public onChainChangedActivations: ChainId[] = [];
  public onAccountChanged: Subject<EthereumAccountAddress>;
  public onAccountChangedActivations: EthereumAccountAddress[] = [];
  public onGovernanceChainChanged: Subject<ChainId>;
  public onGovernanceChainChangedActivations: ChainId[] = [];
  public onGovernanceAccountChanged: Subject<EthereumAccountAddress>;
  public onGovernanceAccountChangedActivations: EthereumAccountAddress[] = [];

  constructor(
    context: HypernetContext | null = null,
    initializedContext: InitializedHypernetContext | null = null,
    uninitializedAccount: EthereumAccountAddress | null = null,
  ) {
    this.onControlClaimed = new Subject();
    this.onControlClaimed.subscribe((val) => {
      this.onControlClaimedActivations.push(val);
    });

    this.onControlYielded = new Subject();
    this.onControlYielded.subscribe((val) => {
      this.onControlYieldedActivations.push(val);
    });

    this.onPushPaymentSent = new Subject();
    this.onPushPaymentSent.subscribe((val) => {
      this.onPushPaymentSentActivations.push(val);
    });

    this.onPullPaymentSent = new Subject();
    this.onPullPaymentSent.subscribe((val) => {
      this.onPullPaymentSentActivations.push(val);
    });

    this.onPushPaymentReceived = new Subject();
    this.onPushPaymentReceived.subscribe((val) => {
      this.onPushPaymentReceivedActivations.push(val);
    });

    this.onPullPaymentReceived = new Subject();
    this.onPullPaymentReceived.subscribe((val) => {
      this.onPullPaymentReceivedActivations.push(val);
    });

    this.onPushPaymentUpdated = new Subject();
    this.onPushPaymentUpdated.subscribe((val) => {
      this.onPushPaymentUpdatedActivations.push(val);
    });

    this.onPullPaymentUpdated = new Subject();
    this.onPullPaymentUpdated.subscribe((val) => {
      this.onPullPaymentUpdatedActivations.push(val);
    });

    this.onPushPaymentDelayed = new Subject();
    this.onPushPaymentDelayed.subscribe((val) => {
      this.onPushPaymentDelayedActivations.push(val);
    });

    this.onPullPaymentDelayed = new Subject();
    this.onPullPaymentDelayed.subscribe((val) => {
      this.onPullPaymentDelayedActivations.push(val);
    });

    this.onPushPaymentCanceled = new Subject();
    this.onPushPaymentCanceled.subscribe((val) => {
      this.onPushPaymentCanceledActivations.push(val);
    });

    this.onPullPaymentCanceled = new Subject();
    this.onPullPaymentCanceled.subscribe((val) => {
      this.onPullPaymentCanceledActivations.push(val);
    });

    this.onBalancesChanged = new Subject();
    this.onBalancesChanged.subscribe((val) => {
      this.onBalancesChangedActivations.push(val);
    });

    this.onCeramicAuthenticationStarted = new Subject();
    this.onCeramicAuthenticationStarted.subscribe(() => {
      this.onCeramicAuthenticationStartedActivationCount++;
    });

    this.onCeramicAuthenticationSucceeded = new Subject();
    this.onCeramicAuthenticationSucceeded.subscribe(() => {
      this.onCeramicAuthenticationSucceededActivationCount++;
    });

    this.onCeramicFailed = new Subject();
    this.onCeramicFailed.subscribe(() => {
      this.onCeramicFailedActivationCount++;
    });

    this.onGatewayAuthorized = new Subject();
    this.onGatewayAuthorized.subscribe((val) => {
      this.onGatewayAuthorizedActivations.push(val);
    });

    this.onGatewayDeauthorizationStarted = new Subject();
    this.onGatewayDeauthorizationStarted.subscribe((val) => {
      this.onGatewayDeauthorizationStartedActivations.push(val);
    });

    this.onAuthorizedGatewayUpdated = new Subject();
    this.onAuthorizedGatewayUpdated.subscribe((val) => {
      this.onAuthorizedGatewayUpdatedActivations.push(val);
    });

    this.onAuthorizedGatewayActivationFailed = new Subject();
    this.onAuthorizedGatewayActivationFailed.subscribe((val) => {
      this.onAuthorizedGatewayActivationFailedActivations.push(val);
    });

    this.onGatewayIFrameDisplayRequested = new Subject();
    this.onGatewayIFrameDisplayRequested.subscribe((val) => {
      this.onGatewayIFrameDisplayRequestedActivations.push(val);
    });

    this.onGatewayIFrameCloseRequested = new Subject();
    this.onGatewayIFrameCloseRequested.subscribe((val) => {
      this.onGatewayIFrameCloseRequestedActivations.push(val);
    });

    this.onCoreIFrameDisplayRequested = new Subject();
    this.onCoreIFrameDisplayRequested.subscribe(() => {
      this.onCoreIFrameDisplayRequestedActivationCount++;
    });

    this.onCoreIFrameCloseRequested = new Subject();
    this.onCoreIFrameCloseRequested.subscribe(() => {
      this.onCoreIFrameCloseRequestedActivationCount++;
    });

    this.onInitializationRequired = new Subject();
    this.onInitializationRequired.subscribe(() => {
      this.onInitializationRequiredActivationCount++;
    });

    this.onPrivateCredentialsRequested = new Subject();
    this.onPrivateCredentialsRequested.subscribe(() => {
      this.onPrivateCredentialsRequestedActivationCount++;
    });

    this.onWalletConnectOptionsDisplayRequested = new Subject();
    this.onWalletConnectOptionsDisplayRequested.subscribe(() => {
      this.onWalletConnectOptionsDisplayRequestedActivationCount++;
    });

    this.onGatewayConnectorActivated = new Subject();
    this.onGatewayConnectorActivated.subscribe((val) => {
      this.onGatewayConnectorActivatedActivations.push(val);
    });

    this.onStateChannelCreated = new Subject();
    this.onStateChannelCreated.subscribe((val) => {
      this.onStateChannelCreatedActivations.push(val);
    });

    this.onChainConnected = new Subject();
    this.onChainConnected.subscribe((val) => {
      this.onChainConnectedActivations.push(val);
    });

    this.onGovernanceChainConnected = new Subject();
    this.onGovernanceChainConnected.subscribe((val) => {
      this.onGovernanceChainConnectedActivations.push(val);
    });

    this.onChainChanged = new Subject();
    this.onChainChanged.subscribe((val) => {
      this.onChainChangedActivations.push(val);
    });

    this.onAccountChanged = new Subject();
    this.onAccountChanged.subscribe((val) => {
      this.onAccountChangedActivations.push(val);
    });

    this.onGovernanceChainChanged = new Subject();
    this.onGovernanceChainChanged.subscribe((val) => {
      this.onGovernanceChainChangedActivations.push(val);
    });

    this.onGovernanceAccountChanged = new Subject();
    this.onGovernanceAccountChanged.subscribe((val) => {
      this.onGovernanceAccountChangedActivations.push(val);
    });

    if (context != null) {
      this.context = context;
    } else {
      this.context = new HypernetContext(
        account,
        null,
        [activeStateChannel],
        false,
        new InitializeStatus(false, false, false, false),
        null,
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
        this.onCeramicAuthenticationStarted,
        this.onCeramicAuthenticationSucceeded,
        this.onCeramicFailed,
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
        this.onWalletConnectOptionsDisplayRequested,
        this.onGatewayConnectorActivated,
        this.onStateChannelCreated,
        this.onChainConnected,
        this.onGovernanceChainConnected,
        this.onChainChanged,
        this.onAccountChanged,
        this.onGovernanceChainChanged,
        this.onGovernanceAccountChanged,
      );
    }

    if (initializedContext != null) {
      this.initializedContext = initializedContext;
    } else {
      this.initializedContext = new InitializedHypernetContext(
        account,
        publicIdentifier,
        [activeStateChannel],
        true,
        new InitializeStatus(true, true, true, true),
        ChainId(1),
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
        this.onCeramicAuthenticationStarted,
        this.onCeramicAuthenticationSucceeded,
        this.onCeramicFailed,
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
        this.onWalletConnectOptionsDisplayRequested,
        this.onGatewayConnectorActivated,
        this.onStateChannelCreated,
        this.onChainConnected,
        this.onGovernanceChainConnected,
        this.onChainChanged,
        this.onAccountChanged,
        this.onGovernanceChainChanged,
        this.onGovernanceAccountChanged,
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

  public setContextValues = new Array<HypernetContext>();
  public setContext(context: HypernetContext): ResultAsync<void, never> {
    this.setContextValues.push(context);
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
      onPushPaymentCanceled: 0,
      onPullPaymentCanceled: 0,
      onBalancesChanged: 0,
      onCeramicAuthenticationStarted: 0,
      onCeramicAuthenticationSucceeded: 0,
      onCeramicFailed: 0,
      onGatewayAuthorized: 0,
      onGatewayDeauthorizationStarted: 0,
      onAuthorizedGatewayUpdated: 0,
      onAuthorizedGatewayActivationFailed: 0,
      onGatewayIFrameDisplayRequested: 0,
      onGatewayIFrameCloseRequested: 0,
      onInitializationRequired: 0,
      onPrivateCredentialsRequested: 0,
      onWalletConnectOptionsDisplayRequested: 0,
      onGatewayConnectorActivated: 0,
      onStateChannelCreated: 0,
      onChainConnected: 0,
      onGovernanceChainConnected: 0,
      onChainChanged: 0,
      onAccountChanged: 0,
      onGovernanceChainChanged: 0,
      onGovernanceAccountChanged: 0,
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
    expect(this.onPushPaymentCanceledActivations.length).toBe(
      counts.onPushPaymentCanceled,
    );
    expect(this.onPullPaymentCanceledActivations.length).toBe(
      counts.onPullPaymentCanceled,
    );
    expect(this.onBalancesChangedActivations.length).toBe(
      counts.onBalancesChanged,
    );
    expect(this.onCeramicAuthenticationStartedActivationCount).toBe(
      counts.onCeramicAuthenticationStarted,
    );
    expect(this.onCeramicAuthenticationSucceededActivationCount).toBe(
      counts.onCeramicAuthenticationSucceeded,
    );
    expect(this.onCeramicFailedActivationCount).toBe(counts.onCeramicFailed);
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
    expect(this.onWalletConnectOptionsDisplayRequestedActivationCount).toBe(
      counts.onWalletConnectOptionsDisplayRequested,
    );
    expect(this.onGatewayConnectorActivatedActivations.length).toBe(
      counts.onGatewayConnectorActivated,
    );
    expect(this.onStateChannelCreatedActivations.length).toBe(
      counts.onStateChannelCreated,
    );

    expect(this.onChainConnectedActivations.length).toBe(
      counts.onChainConnected,
    );

    expect(this.onGovernanceChainConnectedActivations.length).toBe(
      counts.onGovernanceChainConnected,
    );

    expect(this.onChainChangedActivations.length).toBe(counts.onChainChanged);

    expect(this.onAccountChangedActivations.length).toBe(
      counts.onAccountChanged,
    );

    expect(this.onGovernanceChainChangedActivations.length).toBe(
      counts.onGovernanceChainChanged,
    );

    this.onGovernanceAccountChanged,
      expect(this.onGovernanceAccountChangedActivations.length).toBe(
        counts.onGovernanceAccountChanged,
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
  onPushPaymentCanceled?: number;
  onPullPaymentCanceled?: number;
  onBalancesChanged?: number;
  onCeramicAuthenticationStarted?: number;
  onCeramicAuthenticationSucceeded?: number;
  onCeramicFailed?: number;
  onGatewayAuthorized?: number;
  onGatewayDeauthorizationStarted?: number;
  onAuthorizedGatewayUpdated?: number;
  onAuthorizedGatewayActivationFailed?: number;
  onGatewayIFrameDisplayRequested?: number;
  onGatewayIFrameCloseRequested?: number;
  onInitializationRequired?: number;
  onPrivateCredentialsRequested?: number;
  onWalletConnectOptionsDisplayRequested?: number;
  onGatewayConnectorActivated?: number;
  onStateChannelCreated?: number;
  onChainConnected?: number;
  onGovernanceChainConnected?: number;
  onChainChanged?: number;
  onAccountChanged?: number;
  onGovernanceChainChanged?: number;
  onGovernanceAccountChanged?: number;
}
