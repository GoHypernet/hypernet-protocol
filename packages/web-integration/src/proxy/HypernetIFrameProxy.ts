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
  NodeError,
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
} from "@hypernetlabs/hypernet-core";
import Postmate from "postmate";
import { Subject } from "rxjs";
import IHypernetIFrameProxy from "./IHypernetIFrameProxy";
import { ok, errAsync } from "neverthrow";

export default class HypernetIFrameProxy implements IHypernetIFrameProxy {
  protected handshake: Postmate;
  protected child: Postmate.ParentAPI | null;
  protected coreInitialized: boolean = false;
  protected waitInitializedPromise: Promise<void>;

  constructor(element: HTMLElement | null, iframeUrl: string) {
    this.child = null;
    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentProposed = new Subject<PushPayment>();
    this.onPullPaymentProposed = new Subject<PullPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentApproved = new Subject<PullPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();

    if (element == null) {
      element = document.body;
    }

    this.handshake = new Postmate({
      container: element,
      url: iframeUrl,
      name: "hypernet-core-iframe",
      classListArray: ["my-class"] // Classes to add to the iframe
    });

    // Initialize the promise that we'll use to monitor the core
    // initialization status. The iframe will emit an event "initialized"
    // once the core is initialized, we'll use that to resolve this promise.
    this.waitInitializedPromise = new Promise<void>((resolve) => {
      return this.handshake.then((child) => {
        // Stash the API for future calls
        this.child = child;

        // Subscribe to the message streams from the iframe,
        // and convert them back to RXJS Subjects.
        child.on("onControlClaimed", (data) => {
          this.onControlClaimed.next(data);
        });

        child.on("onControlYielded", (data) => {
          this.onControlYielded.next(data);
        });

        child.on("onPushPaymentProposed", (data) => {
          this.onPushPaymentProposed.next(data);
        });

        child.on("onPullPaymentProposed", (data) => {
          this.onPullPaymentProposed.next(data);
        });

        child.on("onPushPaymentReceived", (data) => {
          this.onPushPaymentReceived.next(data);
        });

        child.on("onPullPaymentApproved", (data) => {
          this.onPullPaymentApproved.next(data);
        });

        child.on("onPushPaymentUpdated", (data) => {
          this.onPushPaymentUpdated.next(data);
        });

        child.on("onPullPaymentUpdated", (data) => {
          this.onPullPaymentUpdated.next(data);
        });

        child.on("onBalancesChanged", (data) => {
          this.onBalancesChanged.next(data);
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

  public initialized(): Result < boolean, LogicalError > {
      // If the child is not initialized, there is no way the core can be.
      if(this.child == null) {
      return ok(false);
    }

    // Return the current known status of coreInitialized. We request this
    // information as soon as the child is up.
    return ok(this.coreInitialized);
  }

  public waitInitialized(): ResultAsync<void, LogicalError> {
    if (this.waitInitializedPromise == null) {
      return errAsync(new LogicalError());
    }
    return ResultAsync.fromPromise(this.waitInitializedPromise,
      (e) => { return new LogicalError(); });
  }

  public inControl(): Result<boolean, LogicalError> {
    throw new Error("Unimplemented");
  }

  public getEthereumAccounts(): ResultAsync<string[], BlockchainUnavailableError> {
    throw new Error("Unimplemented");
  }

  public initialize(account: PublicIdentifier): ResultAsync<void, LogicalError> {
    throw new Error("Unimplemented");
  }

  public getPublicIdentifier(): ResultAsync<PublicIdentifier, CoreUninitializedError> {
    throw new Error("Unimplemented");
  }

  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | NodeError | Error
  > {
    throw new Error("Unimplemented");
  }

  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | NodeError | Error
  > {
    throw new Error("Unimplemented");
  }

  public getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError> {
    throw new Error("Unimplemented");
  }

  public getLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
  > {
    throw new Error("Unimplemented");
  }

  public getActiveLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
  > {
    throw new Error("Unimplemented");
  }

  public getLinkByCounterparty(counterPartyAccount: PublicIdentifier): Promise<HypernetLink> {
    throw new Error("Unimplemented");
  }

  public sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error> {
    throw new Error("Unimplemented");
  }

  public authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment> {
    throw new Error("Unimplemented");
  }

  public acceptFunds(
    paymentIds: string[],
  ): ResultAsync<Result<Payment, AcceptPaymentError>[], InsufficientBalanceError | AcceptPaymentError> {
    throw new Error("Unimplemented");
  }

  public pullFunds(paymentId: string, amount: BigNumber): Promise<Payment> {
    throw new Error("Unimplemented");
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
    throw new Error("Unimplemented");
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
}
