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
  PullPayment,
  PushPayment,
  InsufficientBalanceError,
  Payment,
  Result,
  ResultAsync,
  ok,
  MerchantValidationError,
  PersistenceError,
} from "@hypernetlabs/hypernet-core";
import { Subject } from "rxjs";
import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";
import { IFrameContainer, ParentProxy } from "@hypernetlabs/utils";

export default class HypernetIFrameProxy extends ParentProxy implements IHypernetIFrameProxy {
  protected coreInitialized: boolean = false;
  protected isInControl: boolean = false;
  protected waitInitializedPromise: Promise<void>;
  protected _handshakePromise: Promise<void> | null;

  constructor(iFrameContainer: IFrameContainer | null, iframeUrl: string) {
    super(iFrameContainer, iframeUrl);

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
    this.onAuthorizedMerchantUpdated = new Subject<URL>();
    this.onAuthorizedMerchantActivationFailed = new Subject<URL>();

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

        child.on("onAuthorizedMerchantUpdated", (data: string) => {
          this.onAuthorizedMerchantUpdated.next(new URL(data));
        });

        child.on("onAuthorizedMerchantActivationFailed", (data: string) => {
          this.onAuthorizedMerchantActivationFailed.next(new URL(data));
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

  public proxyReady(): ResultAsync<void, LogicalError> {
    if (this._handshakePromise == null) {
      throw new Error("proxy really, really not ready!");
    }
    return ResultAsync.fromPromise(this._handshakePromise, (err) => new LogicalError());
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
    return this._createCall("waitInitialized", null);
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
    return this._createCall("getEthereumAccounts", null);
  }

  public initialize(account: PublicIdentifier): ResultAsync<void, LogicalError> {
    return this._createCall("initialize", account);
  }

  public getPublicIdentifier(): ResultAsync<PublicIdentifier, CoreUninitializedError> {
    return this._createCall("getPublicIdentifier", null);
  }

  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | VectorError | Error
  > {
    return this._createCall("depositFunds", { assetAddress, amount: amount.toString() });
  }

  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | VectorError | Error
  > {
    return this._createCall("withdrawFunds", { assetAddress, amount: amount.toString(), destinationAddress });
  }

  public getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError> {
    return this._createCall("getBalances", null);
  }

  public getLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    return this._createCall("getLinks", null);
  }

  public getActiveLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    return this._createCall("getActiveLinks", null);
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
    merchantUrl: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    return this._createCall("sendFunds", {
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      merchantUrl,
    });
  }

  public authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: number,
    deltaAmount: string,
    deltaTime: number,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    merchantUrl: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    return this._createCall("authorizeFunds", {
      counterPartyAccount,
      totalAuthorized,
      expirationDate,
      deltaAmount,
      deltaTime,
      requiredStake,
      paymentToken,
      merchantUrl,
    });
  }

  public acceptOffers(
    paymentIds: string[],
  ): ResultAsync<Result<Payment, AcceptPaymentError>[], InsufficientBalanceError | AcceptPaymentError> {
    return this._createCall("acceptFunds", paymentIds);
  }

  public pullFunds(
    paymentId: string,
    amount: BigNumber,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    return this._createCall("pullFunds", {
      paymentId,
      amount: amount.toString(),
    });
  }

  public finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink> {
    throw new Error("Unimplemented");
  }

  public finalizePushPayment(paymentId: string): Promise<void> {
    throw new Error("Unimplemented");
  }

  public initiateDispute(paymentId: string): ResultAsync<Payment, CoreUninitializedError> {
    return this._createCall("initiateDispute", paymentId);
  }

  public mintTestToken(amount: BigNumber): ResultAsync<void, CoreUninitializedError> {
    return this._createCall("mintTestToken", amount.toString());
  }

  public authorizeMerchant(merchantUrl: URL): ResultAsync<void, CoreUninitializedError | MerchantValidationError> {
    return this._createCall("authorizeMerchant", merchantUrl);
  }

  public startConnectorFlow(connector?: string): ResultAsync<void, CoreUninitializedError | MerchantValidationError> {
    return this._createCall("startConnectorFlow", connector);
  }

  public getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError> {
    return this._createCall("getAuthorizedMerchants", null);
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
  public onAuthorizedMerchantUpdated: Subject<URL>;
  public onAuthorizedMerchantActivationFailed: Subject<URL>;
}
