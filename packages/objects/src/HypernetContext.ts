import { Subject } from "rxjs";
import { ControlClaim } from "@objects/ControlClaim";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { PullPayment } from "@objects/PullPayment";
import { PushPayment } from "@objects/PushPayment";
import { Balances } from "@objects/Balances";
import { EthereumAddress } from "@objects/EthereumAddress";
import { MerchantUrl } from "@objects/MerchantUrl";
import { Signature } from "@objects/Signature";

export class HypernetContext {
  constructor(
    public account: EthereumAddress | null,
    public publicIdentifier: PublicIdentifier | null,
    public inControl: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
    public onPushPaymentSent: Subject<PushPayment>,
    public onPullPaymentSent: Subject<PullPayment>,
    public onPushPaymentReceived: Subject<PushPayment>,
    public onPullPaymentReceived: Subject<PullPayment>,
    public onPushPaymentUpdated: Subject<PushPayment>,
    public onPullPaymentUpdated: Subject<PullPayment>,
    public onBalancesChanged: Subject<Balances>,
    public onMerchantAuthorized: Subject<MerchantUrl>,
    public onAuthorizedMerchantUpdated: Subject<MerchantUrl>,
    public onAuthorizedMerchantActivationFailed: Subject<MerchantUrl>,
    public onMerchantIFrameDisplayRequested: Subject<MerchantUrl>,
    public onMerchantIFrameCloseRequested: Subject<MerchantUrl>,
    public onInitializationRequired: Subject<void>,
    public onPrivateCredentialsRequested: Subject<void>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class InitializedHypernetContext {
  constructor(
    public account: EthereumAddress,
    public publicIdentifier: PublicIdentifier,
    public inControl: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
    public onPushPaymentSent: Subject<PushPayment>,
    public onPullPaymentSent: Subject<PullPayment>,
    public onPushPaymentReceived: Subject<PushPayment>,
    public onPullPaymentReceived: Subject<PullPayment>,
    public onPushPaymentUpdated: Subject<PushPayment>,
    public onPullPaymentUpdated: Subject<PullPayment>,
    public onBalancesChanged: Subject<Balances>,
    public onMerchantAuthorized: Subject<MerchantUrl>,
    public onAuthorizedMerchantUpdated: Subject<MerchantUrl>,
    public onAuthorizedMerchantActivationFailed: Subject<MerchantUrl>,
    public onMerchantIFrameDisplayRequested: Subject<MerchantUrl>,
    public onMerchantIFrameCloseRequested: Subject<MerchantUrl>,
    public onInitializationRequired: Subject<void>,
    public onPrivateCredentialsRequested: Subject<void>,
    public authorizedMediators: Map<MerchantUrl, Signature>,
  ) {}
}
