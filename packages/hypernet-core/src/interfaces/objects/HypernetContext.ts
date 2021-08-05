import {
  ControlClaim,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  Balances,
  EthereumAddress,
  GatewayUrl,
  Signature,
  PersistenceError,
} from "@hypernetlabs/objects";
import { Subject } from "rxjs";

import { IGatewayConnectorProxy } from "@interfaces/utilities";

export class HypernetContext {
  constructor(
    public account: EthereumAddress | null,
    public publicIdentifier: PublicIdentifier | null,
    public inControl: boolean,
    public metamaskEnabled: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
    public onPushPaymentSent: Subject<PushPayment>,
    public onPullPaymentSent: Subject<PullPayment>,
    public onPushPaymentReceived: Subject<PushPayment>,
    public onPullPaymentReceived: Subject<PullPayment>,
    public onPushPaymentUpdated: Subject<PushPayment>,
    public onPullPaymentUpdated: Subject<PullPayment>,
    public onPushPaymentDelayed: Subject<PushPayment>,
    public onPullPaymentDelayed: Subject<PullPayment>,
    public onPushPaymentCanceled: Subject<PushPayment>,
    public onPullPaymentCanceled: Subject<PullPayment>,
    public onBalancesChanged: Subject<Balances>,
    public onCeramicAuthenticationStarted: Subject<void>,
    public onCeramicAuthenticationSucceeded: Subject<void>,
    public onCeramicFailed: Subject<PersistenceError>,
    public onGatewayAuthorized: Subject<GatewayUrl>,
    public onGatewayDeauthorizationStarted: Subject<GatewayUrl>,
    public onAuthorizedGatewayUpdated: Subject<GatewayUrl>,
    public onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>,
    public onGatewayIFrameDisplayRequested: Subject<GatewayUrl>,
    public onGatewayIFrameCloseRequested: Subject<GatewayUrl>,
    public onInitializationRequired: Subject<void>,
    public onPrivateCredentialsRequested: Subject<void>,
    public onGatewayConnectorProxyActivated: Subject<IGatewayConnectorProxy>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InitializedHypernetContext {
  constructor(
    public account: EthereumAddress,
    public publicIdentifier: PublicIdentifier,
    public inControl: boolean,
    public metamaskEnabled: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
    public onPushPaymentSent: Subject<PushPayment>,
    public onPullPaymentSent: Subject<PullPayment>,
    public onPushPaymentReceived: Subject<PushPayment>,
    public onPullPaymentReceived: Subject<PullPayment>,
    public onPushPaymentUpdated: Subject<PushPayment>,
    public onPullPaymentUpdated: Subject<PullPayment>,
    public onPushPaymentDelayed: Subject<PushPayment>,
    public onPullPaymentDelayed: Subject<PullPayment>,
    public onPushPaymentCanceled: Subject<PushPayment>,
    public onPullPaymentCanceled: Subject<PullPayment>,
    public onBalancesChanged: Subject<Balances>,
    public onCeramicAuthenticationStarted: Subject<void>,
    public onCeramicAuthenticationSucceeded: Subject<void>,
    public onCeramicFailed: Subject<PersistenceError>,
    public onGatewayAuthorized: Subject<GatewayUrl>,
    public onGatewayDeauthorizationStarted: Subject<GatewayUrl>,
    public onAuthorizedGatewayUpdated: Subject<GatewayUrl>,
    public onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>,
    public onGatewayIFrameDisplayRequested: Subject<GatewayUrl>,
    public onGatewayIFrameCloseRequested: Subject<GatewayUrl>,
    public onInitializationRequired: Subject<void>,
    public onPrivateCredentialsRequested: Subject<void>,
    public onGatewayConnectorProxyActivated: Subject<IGatewayConnectorProxy>,
    public authorizedMediators: Map<GatewayUrl, Signature>,
  ) {}
}
