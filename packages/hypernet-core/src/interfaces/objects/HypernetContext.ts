import {
  ControlClaim,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  Balances,
  EthereumAddress,
  GatewayUrl,
  Signature,
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
    public onBalancesChanged: Subject<Balances>,
    public onDeStorageAuthenticationStarted: Subject<void>,
    public onDeStorageAuthenticationSucceeded: Subject<void>,
    public onDeStorageAuthenticationFailed: Subject<void>,
    public onMerchantAuthorized: Subject<GatewayUrl>,
    public onMerchantDeauthorizationStarted: Subject<GatewayUrl>,
    public onAuthorizedMerchantUpdated: Subject<GatewayUrl>,
    public onAuthorizedMerchantActivationFailed: Subject<GatewayUrl>,
    public onMerchantIFrameDisplayRequested: Subject<GatewayUrl>,
    public onMerchantIFrameCloseRequested: Subject<GatewayUrl>,
    public onInitializationRequired: Subject<void>,
    public onPrivateCredentialsRequested: Subject<void>,
    public onMerchantConnectorProxyActivated: Subject<IGatewayConnectorProxy>,
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
    public onBalancesChanged: Subject<Balances>,
    public onDeStorageAuthenticationStarted: Subject<void>,
    public onDeStorageAuthenticationSucceeded: Subject<void>,
    public onDeStorageAuthenticationFailed: Subject<void>,
    public onMerchantAuthorized: Subject<GatewayUrl>,
    public onMerchantDeauthorizationStarted: Subject<GatewayUrl>,
    public onAuthorizedMerchantUpdated: Subject<GatewayUrl>,
    public onAuthorizedMerchantActivationFailed: Subject<GatewayUrl>,
    public onMerchantIFrameDisplayRequested: Subject<GatewayUrl>,
    public onMerchantIFrameCloseRequested: Subject<GatewayUrl>,
    public onInitializationRequired: Subject<void>,
    public onPrivateCredentialsRequested: Subject<void>,
    public onMerchantConnectorProxyActivated: Subject<IGatewayConnectorProxy>,
    public authorizedMediators: Map<GatewayUrl, Signature>,
  ) {}
}
