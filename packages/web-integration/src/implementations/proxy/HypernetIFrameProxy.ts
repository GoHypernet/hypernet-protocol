import {
  Balances,
  ControlClaim,
  EthereumAddress,
  HypernetLink,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  Payment,
  PaymentId,
  MerchantUrl,
  Signature,
  AssetInfo,
  AcceptPaymentError,
  RouterChannelUnknownError,
  BlockchainUnavailableError,
  VectorError,
  LogicalError,
  BalancesUnavailableError,
  InsufficientBalanceError,
  MerchantValidationError,
  PersistenceError,
  MerchantConnectorError,
  ProxyError,
  InvalidPaymentError,
  InvalidParametersError,
  TransferResolutionError,
  PreferredPaymentTokenError,
} from "@hypernetlabs/objects";
import { ParentProxy } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { Result, ResultAsync, ok } from "neverthrow";
import { Subject } from "rxjs";

import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";

export default class HypernetIFrameProxy
  extends ParentProxy
  implements IHypernetIFrameProxy {
  protected coreInitialized = false;
  protected isInControl = false;
  protected waitInitializedPromise: Promise<void>;
  protected _handshakePromise: Promise<void> | null;

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected iframeName: string,
  ) {
    super(element, iframeUrl, iframeName);

    this._handshakePromise = null;

    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentSent = new Subject<PushPayment>();
    this.onPullPaymentSent = new Subject<PullPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentReceived = new Subject<PullPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onPushPaymentDelayed = new Subject<PushPayment>();
    this.onPullPaymentDelayed = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();
    this.onDeStorageAuthenticationStarted = new Subject<void>();
    this.onDeStorageAuthenticationSucceeded = new Subject<void>();
    this.onDeStorageAuthenticationFailed = new Subject<void>();
    this.onMerchantAuthorized = new Subject<MerchantUrl>();
    this.onAuthorizedMerchantUpdated = new Subject<MerchantUrl>();
    this.onAuthorizedMerchantActivationFailed = new Subject<MerchantUrl>();
    this.onMerchantIFrameDisplayRequested = new Subject<MerchantUrl>();
    this.onMerchantIFrameCloseRequested = new Subject<MerchantUrl>();
    this.onInitializationRequired = new Subject<void>();
    this.onPrivateCredentialsRequested = new Subject<void>();

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

        child.on("onPushPaymentSent", (data: PushPayment) => {
          this.onPushPaymentSent.next(data);
        });

        child.on("onPullPaymentSent", (data: PullPayment) => {
          this.onPullPaymentSent.next(data);
        });

        child.on("onPushPaymentReceived", (data: PushPayment) => {
          this.onPushPaymentReceived.next(data);
        });

        child.on("onPullPaymentReceived", (data: PullPayment) => {
          this.onPullPaymentReceived.next(data);
        });

        child.on("onPushPaymentUpdated", (data: PushPayment) => {
          this.onPushPaymentUpdated.next(data);
        });

        child.on("onPullPaymentUpdated", (data: PullPayment) => {
          this.onPullPaymentUpdated.next(data);
        });

        child.on("onPushPaymentDelayed", (data: PushPayment) => {
          this.onPushPaymentDelayed.next(data);
        });

        child.on("onPullPaymentDelayed", (data: PullPayment) => {
          this.onPullPaymentDelayed.next(data);
        });

        child.on("onBalancesChanged", (data: Balances) => {
          this.onBalancesChanged.next(data);
        });

        child.on("onDeStorageAuthenticationStarted", () => {
          this._displayCoreIFrame();

          this.onDeStorageAuthenticationStarted.next();
        });

        child.on("onDeStorageAuthenticationSucceeded", () => {
          this._closeCoreIFrame();

          this.onDeStorageAuthenticationSucceeded.next();
        });

        child.on("onDeStorageAuthenticationFailed", () => {
          this.onDeStorageAuthenticationFailed.next();
        });

        child.on("onMerchantAuthorized", (data: MerchantUrl) => {
          this.onMerchantAuthorized.next(data);
        });

        child.on("onAuthorizedMerchantUpdated", (data: MerchantUrl) => {
          this.onAuthorizedMerchantUpdated.next(data);
        });

        child.on(
          "onAuthorizedMerchantActivationFailed",
          (data: MerchantUrl) => {
            this.onAuthorizedMerchantActivationFailed.next(data);
          },
        );

        // Setup a listener for the "initialized" event.
        child.on("initialized", () => {
          // Resolve waitInitialized
          resolve();

          // And mark us as initialized
          this.coreInitialized = true;
        });

        child.on("onMerchantIFrameDisplayRequested", (data: MerchantUrl) => {
          this._displayCoreIFrame();

          this.onMerchantIFrameDisplayRequested.next(data);
        });

        child.on("onMerchantIFrameCloseRequested", (data: MerchantUrl) => {
          this._closeCoreIFrame();

          this.onMerchantIFrameCloseRequested.next(data);
        });

        child.on("onInitializationRequired", () => {
          this.onInitializationRequired.next();
        });

        child.on("onPrivateCredentialsRequested", () => {
          this.onPrivateCredentialsRequested.next();
        });
      });
    });
  }

  public finalizePullPayment(
    _paymentId: PaymentId,
    _finalAmount: BigNumber,
  ): Promise<HypernetLink> {
    throw new Error("Method not implemented.");
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
    return this.activate().andThen(() => {
      return this._createCall("waitInitialized", null);
    });
  }

  public inControl(): Result<boolean, LogicalError> {
    // If the child is not initialized, there is no way the core can be.
    if (this.child == null) {
      return ok(false);
    }

    // Return the current known status of inControl.
    return ok(this.isInControl);
  }

  public getEthereumAccounts(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this._createCall("getEthereumAccounts", null);
  }

  public initialize(account: EthereumAddress): ResultAsync<void, LogicalError> {
    return this._createCall("initialize", account);
  }

  public getPublicIdentifier(): ResultAsync<PublicIdentifier, ProxyError> {
    return this._createCall("getPublicIdentifier", null);
  }

  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  > {
    return this._createCall("depositFunds", {
      assetAddress,
      amount: amount.toString(),
    });
  }

  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  > {
    return this._createCall("withdrawFunds", {
      assetAddress,
      amount: amount.toString(),
      destinationAddress,
    });
  }

  public getBalances(): ResultAsync<Balances, BalancesUnavailableError> {
    return this._createCall("getBalances", null);
  }

  public getLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | VectorError | Error
  > {
    return this._createCall("getLinks", null);
  }

  public getActiveLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | VectorError | Error
  > {
    return this._createCall("getActiveLinks", null);
  }

  public getLinkByCounterparty(
    _counterPartyAccount: PublicIdentifier,
  ): Promise<HypernetLink> {
    throw new Error("Unimplemented");
  }

  public sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumber,
    expirationDate: number,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    merchantUrl: MerchantUrl,
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error> {
    return this._createCall("sendFunds", {
      counterPartyAccount,
      amount: amount.toString(),
      expirationDate,
      requiredStake: requiredStake.toString(),
      paymentToken,
      merchantUrl,
    });
  }

  public authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: number,
    deltaAmount: BigNumber,
    deltaTime: number,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    merchantUrl: MerchantUrl,
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error> {
    return this._createCall("authorizeFunds", {
      counterPartyAccount,
      totalAuthorized: totalAuthorized.toString(),
      expirationDate,
      deltaAmount: deltaAmount.toString(),
      deltaTime,
      requiredStake: requiredStake.toString(),
      paymentToken,
      merchantUrl,
    });
  }

  public acceptOffers(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Result<Payment, AcceptPaymentError>[],
    InsufficientBalanceError | AcceptPaymentError
  > {
    return this._createCall("acceptFunds", paymentIds);
  }

  public pullFunds(
    paymentId: PaymentId,
    amount: BigNumber,
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error> {
    return this._createCall("pullFunds", {
      paymentId,
      amount: amount.toString(),
    });
  }

  public initiateDispute(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | MerchantConnectorError
    | MerchantValidationError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
  > {
    return this._createCall("initiateDispute", paymentId);
  }

  public mintTestToken(
    amount: BigNumber,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this._createCall("mintTestToken", amount.toString());
  }

  public authorizeMerchant(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantValidationError> {
    return this._createCall("authorizeMerchant", merchantUrl);
  }

  public deauthorizeMerchant(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, PersistenceError> {
    return this._createCall("deauthorizeMerchant", merchantUrl);
  }

  public getAuthorizedMerchants(): ResultAsync<
    Map<MerchantUrl, Signature>,
    PersistenceError
  > {
    return this._createCall("getAuthorizedMerchants", null);
  }

  public getAuthorizedMerchantsConnectorsStatus(): ResultAsync<
    Map<MerchantUrl, boolean>,
    PersistenceError
  > {
    return this._createCall("getAuthorizedMerchantsConnectorsStatus", null);
  }

  public displayMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    this._displayCoreIFrame();

    return this._createCall("displayMerchantIFrame", merchantUrl);
  }

  public closeMerchantIFrame(
    merchantUrl: MerchantUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    this._closeCoreIFrame();

    return this._createCall("closeMerchantIFrame", merchantUrl);
  }

  public providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError> {
    return this._createCall("providePrivateCredentials", {
      privateKey,
      mnemonic,
    });
  }

  public setPreferredPaymentToken(
    tokenAddress: EthereumAddress,
  ): ResultAsync<void, PreferredPaymentTokenError> {
    return this._createCall("setPreferredPaymentToken", tokenAddress);
  }

  public getPreferredPaymentToken(): ResultAsync<
    AssetInfo,
    BlockchainUnavailableError | PreferredPaymentTokenError
  > {
    return this._createCall("getPreferredPaymentToken", null);
  }

  private _displayCoreIFrame(): void {
    // Show core iframe
    if (this.child != null) {
      this.child.frame.style.display = "block";
    }

    // Show core iframe container
    if (this.element != null) {
      this.element.style.display = "block";
    }
  }

  private _closeCoreIFrame(): void {
    // Hide core iframe
    if (this.child != null) {
      this.child.frame.style.display = "none";
    }

    // Hide core iframe container
    if (this.element != null) {
      this.element.style.display = "none";
    }
  }

  /**
   * Observables for seeing what's going on
   */
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentSent: Subject<PushPayment>;
  public onPullPaymentSent: Subject<PullPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentReceived: Subject<PullPayment>;
  public onPushPaymentDelayed: Subject<PushPayment>;
  public onPullPaymentDelayed: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;
  public onDeStorageAuthenticationStarted: Subject<void>;
  public onDeStorageAuthenticationSucceeded: Subject<void>;
  public onDeStorageAuthenticationFailed: Subject<void>;
  public onMerchantAuthorized: Subject<MerchantUrl>;
  public onAuthorizedMerchantUpdated: Subject<MerchantUrl>;
  public onAuthorizedMerchantActivationFailed: Subject<MerchantUrl>;
  public onMerchantIFrameDisplayRequested: Subject<MerchantUrl>;
  public onMerchantIFrameCloseRequested: Subject<MerchantUrl>;
  public onInitializationRequired: Subject<void>;
  public onPrivateCredentialsRequested: Subject<void>;
}
