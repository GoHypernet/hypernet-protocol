import { Subject } from "rxjs";
import { ControlClaim } from "./ControlClaim";
import { PublicIdentifier } from "./PublicIdentifier";
import { PullPayment, PushPayment } from "./Payment";
import { Balances } from "./Balances";
import { EthereumAddress } from "./EthereumAddress";

export class HypernetContext {
  constructor(
    public account: EthereumAddress | null,
    public publicIdentifier: PublicIdentifier | null,
    public inControl: boolean,
    public onControlClaimed: Subject<ControlClaim>,
    public onControlYielded: Subject<ControlClaim>,
    public onPushPaymentProposed: Subject<PushPayment>,
    public onPullPaymentProposed: Subject<PullPayment>,
    public onPushPaymentReceived: Subject<PushPayment>,
    public onPullPaymentApproved: Subject<PullPayment>,
    public onPushPaymentUpdated: Subject<PushPayment>,
    public onPullPaymentUpdated: Subject<PullPayment>,
    public onBalancesChanged: Subject<Balances>,
    public onMerchantAuthorized: Subject<URL>,
    public onAuthorizedMerchantUpdated: Subject<URL>,
    public onAuthorizedMerchantActivationFailed: Subject<URL>,
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
    public onPushPaymentProposed: Subject<PushPayment>,
    public onPullPaymentProposed: Subject<PullPayment>,
    public onPushPaymentReceived: Subject<PushPayment>,
    public onPullPaymentApproved: Subject<PullPayment>,
    public onPushPaymentUpdated: Subject<PushPayment>,
    public onPullPaymentUpdated: Subject<PullPayment>,
    public onBalancesChanged: Subject<Balances>,
    public onMerchantAuthorized: Subject<URL>,
    public onAuthorizedMerchantUpdated: Subject<URL>,
    public onAuthorizedMerchantActivationFailed: Subject<URL>,
    public authorizedMediators: Map<URL, string>,
  ) {}
}
