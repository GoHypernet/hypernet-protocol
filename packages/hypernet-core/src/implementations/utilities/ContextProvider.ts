import {
  ControlClaim,
  PushPayment,
  PullPayment,
  Balances,
  EthereumAddress,
  PublicIdentifier,
  GatewayUrl,
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
    onBalancesChanged: Subject<Balances>,
    onDeStorageAuthenticationStarted: Subject<void>,
    onDeStorageAuthenticationSucceeded: Subject<void>,
    onDeStorageAuthenticationFailed: Subject<void>,
    onMerchantAuthorized: Subject<GatewayUrl>,
    onMerchantDeauthorizationStarted: Subject<GatewayUrl>,
    onAuthorizedMerchantUpdated: Subject<GatewayUrl>,
    onAuthorizedMerchantActivationFailed: Subject<GatewayUrl>,
    onMerchantIFrameDisplayRequested: Subject<GatewayUrl>,
    onMerchantIFrameCloseRequested: Subject<GatewayUrl>,
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
      onBalancesChanged,
      onDeStorageAuthenticationStarted,
      onDeStorageAuthenticationSucceeded,
      onDeStorageAuthenticationFailed,
      onMerchantAuthorized,
      onMerchantDeauthorizationStarted,
      onAuthorizedMerchantUpdated,
      onAuthorizedMerchantActivationFailed,
      onMerchantIFrameDisplayRequested,
      onMerchantIFrameCloseRequested,
      onInitializationRequired,
      onPrivateCredentialsRequested,
      new Subject<IMerchantConnectorProxy>(),
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
          this.context.onBalancesChanged,
          this.context.onDeStorageAuthenticationStarted,
          this.context.onDeStorageAuthenticationSucceeded,
          this.context.onDeStorageAuthenticationFailed,
          this.context.onMerchantAuthorized,
          this.context.onMerchantDeauthorizationStarted,
          this.context.onAuthorizedMerchantUpdated,
          this.context.onAuthorizedMerchantActivationFailed,
          this.context.onMerchantIFrameDisplayRequested,
          this.context.onMerchantIFrameCloseRequested,
          this.context.onInitializationRequired,
          this.context.onPrivateCredentialsRequested,
          this.context.onMerchantConnectorProxyActivated,
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
