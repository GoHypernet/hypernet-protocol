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
  IPrivateCredentials,
} from "@hypernetlabs/objects";
import {
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
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { Result, ResultAsync, ok } from "neverthrow";
import { Subject } from "rxjs";
import IHypernetIFrameProxy from "@web-integration-interfaces/proxy/IHypernetIFrameProxy";
import { ParentProxy } from "@hypernetlabs/utils";

export default class HypernetIFrameProxy extends ParentProxy implements IHypernetIFrameProxy {
  protected coreInitialized: boolean = false;
  protected isInControl: boolean = false;
  protected waitInitializedPromise: Promise<void>;
  protected _handshakePromise: Promise<void> | null;

  constructor(element: HTMLElement | null, iframeUrl: string, iframeName: string) {
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
    this.onBalancesChanged = new Subject<Balances>();
    this.onMerchantAuthorized = new Subject<string>();
    this.onAuthorizedMerchantUpdated = new Subject<string>();
    this.onAuthorizedMerchantActivationFailed = new Subject<string>();
    this.onMerchantIFrameDisplayRequested = new Subject<string>();
    this.onMerchantIFrameCloseRequested = new Subject<string>();
    this.onInitializationRequired = new Subject<void>();
    this.onPrivateCredentialsRequested = new Subject<void>();
    this.onPrivateCredentialsSent = new Subject<IPrivateCredentials>();

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

        child.on("onBalancesChanged", (data: Balances) => {
          this.onBalancesChanged.next(data);
        });

        child.on("onMerchantAuthorized", (data: string) => {
          this.onMerchantAuthorized.next(data);
        });

        child.on("onAuthorizedMerchantUpdated", (data: string) => {
          this.onAuthorizedMerchantUpdated.next(data);
        });

        child.on("onAuthorizedMerchantActivationFailed", (data: string) => {
          this.onAuthorizedMerchantActivationFailed.next(data);
        });

        // Setup a listener for the "initialized" event.
        child.on("initialized", () => {
          // Resolve waitInitialized
          resolve();

          // And mark us as initialized
          this.coreInitialized = true;
        });

        child.on("onMerchantIFrameDisplayRequested", (data: string) => {
          child.frame.style.display = "block";
          if (element) {
            element.style.display = "block";
          }
          this.onMerchantIFrameDisplayRequested.next(data);
        });

        child.on("onMerchantIFrameCloseRequested", (data: string) => {
          child.frame.style.display = "none";
          if (element) {
            element.style.display = "none";
          }
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

  public finalizePullPayment(paymentId: PaymentId, finalAmount: BigNumber): Promise<HypernetLink> {
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

  public getEthereumAccounts(): ResultAsync<EthereumAddress[], BlockchainUnavailableError> {
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
  ): ResultAsync<Balances, BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error> {
    return this._createCall("depositFunds", { assetAddress, amount: amount.toString() });
  }

  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<Balances, BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error> {
    return this._createCall("withdrawFunds", { assetAddress, amount: amount.toString(), destinationAddress });
  }

  public getBalances(): ResultAsync<Balances, BalancesUnavailableError> {
    return this._createCall("getBalances", null);
  }

  public getLinks(): ResultAsync<HypernetLink[], RouterChannelUnknownError | VectorError | Error> {
    return this._createCall("getLinks", null);
  }

  public getActiveLinks(): ResultAsync<HypernetLink[], RouterChannelUnknownError | VectorError | Error> {
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
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error> {
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
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error> {
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
    paymentIds: PaymentId[],
  ): ResultAsync<Result<Payment, AcceptPaymentError>[], InsufficientBalanceError | AcceptPaymentError> {
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

  public mintTestToken(amount: BigNumber): ResultAsync<void, BlockchainUnavailableError> {
    return this._createCall("mintTestToken", amount.toString());
  }

  public authorizeMerchant(merchantUrl: string): ResultAsync<void, MerchantValidationError> {
    return this._createCall("authorizeMerchant", merchantUrl);
  }

  public getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError> {
    return this._createCall("getAuthorizedMerchants", null);
  }

  public closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    if (this.child != null) {
      this.child.frame.style.display = "none";
    }
    if (this.element != null) {
      this.element.style.display = "none";
    }
    return this._createCall("closeMerchantIFrame", merchantUrl);
  }

  public displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    if (this.child != null) {
      this.child.frame.style.display = "block";
    }
    if (this.element != null) {
      this.element.style.display = "block";
    }

    return this._createCall("displayMerchantIFrame", merchantUrl);
  }

  public providePrivateCredentials(privateCredentials: IPrivateCredentials): ResultAsync<void, InvalidParametersError> {
    return this._createCall("providePrivateCredentials", privateCredentials);
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
  public onBalancesChanged: Subject<Balances>;
  public onMerchantAuthorized: Subject<string>;
  public onAuthorizedMerchantUpdated: Subject<string>;
  public onAuthorizedMerchantActivationFailed: Subject<string>;
  public onMerchantIFrameDisplayRequested: Subject<string>;
  public onMerchantIFrameCloseRequested: Subject<string>;
  public onInitializationRequired: Subject<void>;
  public onPrivateCredentialsRequested: Subject<void>;
  public onPrivateCredentialsSent: Subject<IPrivateCredentials>;
}
