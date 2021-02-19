import {
  AcceptPaymentError,
  Balances,
  BigNumber,
  CoreUninitializedError,
  ControlClaim,
  EthereumAddress,
  RouterChannelUnknownError,
  HypernetLink,
  BlockchainUnavailableError,
  VectorError,
  LogicalError,
  PublicIdentifier,
  BalancesUnavailableError,
  PublicKey,
  PullPayment,
  PushPayment,
  InsufficientBalanceError,
  Payment,
  Result,
  ResultAsync,
  MerchantValidationError,
  PersistenceError,
} from "@hypernetlabs/hypernet-core";
import { Subject } from "rxjs";
import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";
import { ok } from "neverthrow";
import { ParentProxy } from "@hypernetlabs/utils";

export default class HypernetIFrameProxy extends ParentProxy implements IHypernetIFrameProxy {
  protected coreInitialized: boolean = false;
  protected isInControl: boolean = false;
  protected waitInitializedPromise: Promise<void>;
  protected _handshakePromise: Promise<void> | null;

  constructor(element: HTMLElement | null, iframeUrl: string) {
    super(element, iframeUrl);

    this._handshakePromise = null;

    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentProposed = new Subject<PushPayment>();
    this.onPullPaymentProposed = new Subject<PullPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentApproved = new Subject<PullPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();
    this.onMerchantAuthorized = new Subject<URL>();

    // Initialize the promise that we'll use to monitor the core
    // initialization status. The iframe will emit an event "initialized"
    // once the core is initialized, we'll use that to resolve this promise.
    this.waitInitializedPromise = new Promise<void>((resolve) => {
      this._handshakePromise = this.handshake.then((child) => {
        // Subscribe to the message streams from the iframe,
        // and convert them back to RXJS Subjects.
        child.on("onControlClaimed", (data: ControlClaim) => {
          this.isInControl = true;
          this.onControlClaimed.next(data);
        });

        child.on("onControlYielded", (data: ControlClaim) => {
          this.isInControl = false;
          this.onControlYielded.next(data);
        });

        child.on("onPushPaymentProposed", (data: PushPayment) => {
          this.onPushPaymentProposed.next(data);
        });

        child.on("onPullPaymentProposed", (data: PullPayment) => {
          this.onPullPaymentProposed.next(data);
        });

        child.on("onPushPaymentReceived", (data: PushPayment) => {
          this.onPushPaymentReceived.next(data);
        });

        child.on("onPullPaymentApproved", (data: PullPayment) => {
          this.onPullPaymentApproved.next(data);
        });

        child.on("onPushPaymentUpdated", (data: PushPayment) => {
          this.onPushPaymentUpdated.next(data);
        });

        child.on("onPullPaymentUpdated", (data: PullPayment) => {
          this.onPullPaymentUpdated.next(data);
        });

        child.on("onBalancesChanged", (data: Balances) => {
          this.onBalancesChanged.next(data);
        });

        child.on("onMerchantAuthorized", (data: string) => {
          this.onMerchantAuthorized.next(new URL(data));
        });

        // Setup a listener for the "initialized" event.
        child.on("initialized", () => {
          // Resolve waitInitialized
          resolve();

          // And mark us as initialized
          this.coreInitialized = true;
        });
      });
    });
  }

  public proxyReady(): Promise<void> {
    if (this._handshakePromise == null) {
      throw new Error("proxy really, really not ready!");
    }
    return this._handshakePromise;
  }

  public initialized(): Result<boolean, LogicalError> {
    // If the child is not initialized, there is no way the core can be.
    if (this.child == null) {
      return ok(false);
    }

    // Return the current known status of coreInitialized. We request this
    // information as soon as the child is up.
    return ok(this.coreInitialized);
  }

  public waitInitialized(): ResultAsync<void, LogicalError> {
    const call = this._createCall("waitInitialized", null);

    return call.getResult();
  }

  public inControl(): Result<boolean, LogicalError> {
    // If the child is not initialized, there is no way the core can be.
    if (this.child == null) {
      return ok(false);
    }

    // Return the current known status of inControl.
    return ok(this.isInControl);
  }

  public getEthereumAccounts(): ResultAsync<string[], BlockchainUnavailableError> {
    const call = this._createCall("getEthereumAccounts", null);

    return call.getResult();
  }

  public initialize(account: PublicIdentifier): ResultAsync<void, LogicalError> {
    const call = this._createCall("initialize", account);

    return call.getResult();
  }

  public getPublicIdentifier(): ResultAsync<PublicIdentifier, CoreUninitializedError> {
    const call = this._createCall("getPublicIdentifier", null);

    return call.getResult();
  }

  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | VectorError | Error
  > {
    const call = this._createCall("depositFunds", { assetAddress, amount: amount.toString() });

    return call.getResult();
  }

  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | VectorError | Error
  > {
    const call = this._createCall("withdrawFunds", { assetAddress, amount: amount.toString(), destinationAddress });

    return call.getResult();
  }

  public getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError> {
    const call = this._createCall("getBalances", null);

    return call.getResult();
  }

  public getLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    const call = this._createCall("getLinks", null);

    return call.getResult();
  }

  public getActiveLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    const call = this._createCall("getActiveLinks", null);

    return call.getResult();
  }

  public getLinkByCounterparty(counterPartyAccount: PublicIdentifier): Promise<HypernetLink> {
    throw new Error("Unimplemented");
  }

  public sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: number,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    const call = this._createCall("sendFunds", {
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      disputeMediator,
    });

    return call.getResult();
  }

  public authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: number,
    deltaAmount: string,
    deltaTime: number,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    const call = this._createCall("authorizeFunds", {
      counterPartyAccount,
      totalAuthorized,
      expirationDate,
      deltaAmount,
      deltaTime,
      requiredStake,
      paymentToken,
      disputeMediator,
    });

    return call.getResult();
  }

  public acceptOffers(
    paymentIds: string[],
  ): ResultAsync<Result<Payment, AcceptPaymentError>[], InsufficientBalanceError | AcceptPaymentError> {
    const call = this._createCall("acceptFunds", paymentIds);

    return call.getResult();
  }

  public pullFunds(
    paymentId: string,
    amount: BigNumber,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    const call = this._createCall("pullFunds", {
      paymentId,
      amount: amount.toString(),
    });

    return call.getResult();
  }

  public finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink> {
    throw new Error("Unimplemented");
  }

  public finalizePushPayment(paymentId: string): Promise<void> {
    throw new Error("Unimplemented");
  }

  public initiateDispute(paymentId: string, metadata: string): Promise<HypernetLink> {
    throw new Error("Unimplemented");
  }

  public mintTestToken(amount: BigNumber): ResultAsync<void, CoreUninitializedError> {
    const call = this._createCall("acceptFunds", amount.toString());

    return call.getResult();
  }

  public authorizeMerchant(merchantUrl: URL): ResultAsync<void, CoreUninitializedError | MerchantValidationError> {
    const call = this._createCall("authorizeMerchant", merchantUrl);

    return call.getResult();
  }

  public startConnectorFlow(connector?: string): ResultAsync<void, CoreUninitializedError | MerchantValidationError> {
    const call = this._createCall("startConnectorFlow", connector);

    return call.getResult();
  }

  public getAuthorizedMerchants(): ResultAsync<Map<URL, string>, PersistenceError> {
    const call = this._createCall("getAuthorizedMerchants", null);

    return call.getResult();
  }

  /**
   * Observables for seeing what's going on
   */
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentProposed: Subject<PushPayment>;
  public onPullPaymentProposed: Subject<PullPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentApproved: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;
  public onMerchantAuthorized: Subject<URL>;
}
