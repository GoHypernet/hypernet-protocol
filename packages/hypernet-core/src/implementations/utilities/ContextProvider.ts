import {
  ControlClaim,
  PushPayment,
  PullPayment,
  Balances,
  EthereumAddress,
  PublicIdentifier,
  GatewayUrl,
  Signature,
  PersistenceError,
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
    onCeramicFailed: Subject<PersistenceError>,
    onGatewayAuthorized: Subject<GatewayUrl>,
    onGatewayDeauthorizationStarted: Subject<GatewayUrl>,
    onAuthorizedGatewayUpdated: Subject<GatewayUrl>,
    onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>,
    onGatewayIFrameDisplayRequested: Subject<GatewayUrl>,
    onGatewayIFrameCloseRequested: Subject<GatewayUrl>,
    onInitializationRequired: Subject<void>,
    onPrivateCredentialsRequested: Subject<void>,
  ) {
    this.context = new HypernetContext(
      null,
      null,
      false,
      window.ethereum != null,
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
      onInitializationRequired,
      onPrivateCredentialsRequested,
      new Subject<IGatewayConnectorProxy>(),
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
          EthereumAddress(this.context.account || ""),
          PublicIdentifier(this.context.publicIdentifier || ""),
          this.context.inControl,
          window.ethereum != null,
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
          this.context.onInitializationRequired,
          this.context.onPrivateCredentialsRequested,
          this.context.onGatewayConnectorProxyActivated,
          new Map<GatewayUrl, Signature>(),
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
      this.context.account != null && this.context.publicIdentifier != null
    );
  }
}
