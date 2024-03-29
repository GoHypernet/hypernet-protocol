import {
  ControlClaim,
  PushPayment,
  PullPayment,
  Balances,
  PublicIdentifier,
  GatewayUrl,
  ActiveStateChannel,
  ChainId,
  EthereumAccountAddress,
  InitializeStatus,
  chainConfig,
  GovernanceChainInformation,
  GovernanceSignerUnavailableError,
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

export class ContextProvider implements IContextProvider {
  protected context: HypernetContext;
  protected _initializePromise: Promise<InitializedHypernetContext>;
  protected _initializePromiseResolve: (
    value: InitializedHypernetContext,
  ) => void;
  protected _getAccountPromise: Promise<string>;
  protected _getAccountPromiseResolve: (value: string) => void;
  constructor(
    onControlClaimed: Subject<ControlClaim>,
    onControlYielded: Subject<ControlClaim>,
    onPushPaymentSent: Subject<PushPayment>,
    onPullPaymentSent: Subject<PullPayment>,
    onPushPaymentReceived: Subject<PushPayment>,
    onPullPaymentReceived: Subject<PullPayment>,
    onPushPaymentUpdated: Subject<PushPayment>,
    onPullPaymentUpdated: Subject<PullPayment>,
    onPushPaymentDelayed: Subject<PushPayment>,
    onPullPaymentDelayed: Subject<PullPayment>,
    onPushPaymentCanceled: Subject<PushPayment>,
    onPullPaymentCanceled: Subject<PullPayment>,
    onBalancesChanged: Subject<Balances>,
    onCeramicAuthenticationStarted: Subject<void>,
    onCeramicAuthenticationSucceeded: Subject<void>,
    onCeramicFailed: Subject<Error>,
    onGatewayAuthorized: Subject<GatewayUrl>,
    onGatewayDeauthorizationStarted: Subject<GatewayUrl>,
    onAuthorizedGatewayUpdated: Subject<GatewayUrl>,
    onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>,
    onGatewayIFrameDisplayRequested: Subject<GatewayUrl>,
    onGatewayIFrameCloseRequested: Subject<GatewayUrl>,
    onCoreIFrameDisplayRequested: Subject<void>,
    onCoreIFrameCloseRequested: Subject<void>,
    onInitializationRequired: Subject<void>,
    onPrivateCredentialsRequested: Subject<void>,
    onWalletConnectOptionsDisplayRequested: Subject<void>,
    onStateChannelCreated: Subject<ActiveStateChannel>,
    onChainConnected: Subject<ChainId>,
    onGovernanceChainConnected: Subject<ChainId>,
    onChainChanged: Subject<ChainId>,
    onAccountChanged: Subject<EthereumAccountAddress>,
    onGovernanceChainChanged: Subject<ChainId>,
    onGovernanceAccountChanged: Subject<EthereumAccountAddress>,
    onGovernanceSignerUnavailable: Subject<GovernanceSignerUnavailableError>,
    defaultGovernanceChainId?: ChainId,
  ) {
    const governanceChainInfo = chainConfig.get(
      defaultGovernanceChainId || ChainId(1),
    );
    if (governanceChainInfo == null) {
      throw new Error("Main net chain information does not exist!");
    }

    if (!(governanceChainInfo instanceof GovernanceChainInformation)) {
      throw new Error(
        `Invalid configuration! Governance chain ${governanceChainInfo} is not a GovernanceChainInformation`,
      );
    }

    this.context = new HypernetContext(
      null,
      null,
      null,
      false,
      new InitializeStatus(new Map(), new Map(), new Map(), new Map()),
      governanceChainInfo,
      onControlClaimed,
      onControlYielded,
      onPushPaymentSent,
      onPullPaymentSent,
      onPushPaymentReceived,
      onPullPaymentReceived,
      onPushPaymentUpdated,
      onPullPaymentUpdated,
      onPushPaymentDelayed,
      onPullPaymentDelayed,
      onPushPaymentCanceled,
      onPullPaymentCanceled,
      onBalancesChanged,
      onCeramicAuthenticationStarted,
      onCeramicAuthenticationSucceeded,
      onCeramicFailed,
      onGatewayAuthorized,
      onGatewayDeauthorizationStarted,
      onAuthorizedGatewayUpdated,
      onAuthorizedGatewayActivationFailed,
      onGatewayIFrameDisplayRequested,
      onGatewayIFrameCloseRequested,
      onCoreIFrameDisplayRequested,
      onCoreIFrameCloseRequested,
      onInitializationRequired,
      onPrivateCredentialsRequested,
      onWalletConnectOptionsDisplayRequested,
      new Subject<IGatewayConnectorProxy>(),
      onStateChannelCreated,
      onChainConnected,
      onGovernanceChainConnected,
      onChainChanged,
      onAccountChanged,
      onGovernanceChainChanged,
      onGovernanceAccountChanged,
      onGovernanceSignerUnavailable,
    );
    this._initializePromiseResolve = () => null;
    this._initializePromise = new Promise((resolve) => {
      this._initializePromiseResolve = resolve;
    });

    this._getAccountPromiseResolve = () => null;
    this._getAccountPromise = new Promise((resolve) => {
      this._getAccountPromiseResolve = resolve;
    });
  }
  public getContext(): ResultAsync<HypernetContext, never> {
    return okAsync(this.context);
  }

  public getInitializedContext(): ResultAsync<
    InitializedHypernetContext,
    never
  > {
    if (!this.contextInitialized()) {
      this.context.onInitializationRequired.next();
    }
    return ResultAsync.fromSafePromise(this._initializePromise);
  }

  public setContext(context: HypernetContext): ResultAsync<void, never> {
    this.context = context;

    if (this.contextInitialized()) {
      this._initializePromiseResolve(
        new InitializedHypernetContext(
          EthereumAccountAddress(this.context.account || ""),
          PublicIdentifier(this.context.publicIdentifier || ""),
          this.context.activeStateChannels || [],
          this.context.inControl,
          this.context.initializeStatus,
          this.context.governanceChainInformation,
          this.context.onControlClaimed,
          this.context.onControlYielded,
          this.context.onPushPaymentSent,
          this.context.onPullPaymentSent,
          this.context.onPushPaymentReceived,
          this.context.onPullPaymentReceived,
          this.context.onPushPaymentUpdated,
          this.context.onPullPaymentUpdated,
          this.context.onPushPaymentDelayed,
          this.context.onPullPaymentDelayed,
          this.context.onPushPaymentCanceled,
          this.context.onPullPaymentCanceled,
          this.context.onBalancesChanged,
          this.context.onCeramicAuthenticationStarted,
          this.context.onCeramicAuthenticationSucceeded,
          this.context.onCeramicFailed,
          this.context.onGatewayAuthorized,
          this.context.onGatewayDeauthorizationStarted,
          this.context.onAuthorizedGatewayUpdated,
          this.context.onAuthorizedGatewayActivationFailed,
          this.context.onGatewayIFrameDisplayRequested,
          this.context.onGatewayIFrameCloseRequested,
          this.context.onCoreIFrameDisplayRequested,
          this.context.onCoreIFrameCloseRequested,
          this.context.onInitializationRequired,
          this.context.onPrivateCredentialsRequested,
          this.context.onWalletConnectOptionsDisplayRequested,
          this.context.onGatewayConnectorProxyActivated,
          this.context.onStateChannelCreated,
          this.context.onChainConnected,
          this.context.onGovernanceChainConnected,
          this.context.onChainChanged,
          this.context.onAccountChanged,
          this.context.onGovernanceChainChanged,
          this.context.onGovernanceAccountChanged,
          this.context.onGovernanceSignerUnavailable,
        ),
      );
    }

    if (this.context.account != null) {
      this._getAccountPromiseResolve(this.context.account);
    }

    return okAsync(undefined);
  }

  public getAccount(): ResultAsync<string, never> {
    return ResultAsync.fromSafePromise(this._getAccountPromise);
  }

  protected contextInitialized(): boolean {
    return (
      this.context.account != null &&
      this.context.publicIdentifier != null &&
      this.context.activeStateChannels != null
    );
  }
}
