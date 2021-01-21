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
import { ok } from "neverthrow";

interface IIFrameCallData<T> {
  callId: number;
  data: T;
}

class IFrameCallData<T> implements IIFrameCallData<T> {
  constructor(public callId: number, public data: T) {}
}

class IFrameCall<T, E> {
  protected promise: Promise<T>;
  protected resolveFunc: ((result: T) => void) | null;
  protected rejectFunc: ((error: E) => void) | null;

  constructor(public callData: IIFrameCallData<any>) {
    this.resolveFunc = null;
    this.rejectFunc = null;

    this.promise = new Promise((resolve, reject) => {
      this.resolveFunc = resolve;
      this.rejectFunc = reject;
    });
  }

  public resolve(result: T): void {
    if (this.resolveFunc != null) {
      this.resolveFunc(result);
    }
  }

  public reject(error: E): void {
    if (this.rejectFunc != null) {
      this.rejectFunc(error);
    }
  }

  public getResult(): ResultAsync<T, E> {
    return ResultAsync.fromPromise(this.promise, (e) => {
      return e as E;
    });
  }
}

export default class HypernetIFrameProxy implements IHypernetIFrameProxy {
  protected handshake: Postmate;
  protected child: Postmate.ParentAPI | null;
  protected coreInitialized: boolean = false;
  protected isInControl: boolean = false;
  protected waitInitializedPromise: Promise<void>;
  protected _handshakePromise: Promise<void> | null;
  protected callId: number = 0;
  protected calls: IFrameCall<any, any>[] = [];

  constructor(element: HTMLElement | null, iframeUrl: string) {
    this.child = null;
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

    if (element == null) {
      element = document.body;
    }

    this.handshake = new Postmate({
      container: element,
      url: iframeUrl,
      name: "hypernet-core-iframe",
      classListArray: ["hypernet-core-iframe-style"], // Classes to add to the iframe
    });

    // Initialize the promise that we'll use to monitor the core
    // initialization status. The iframe will emit an event "initialized"
    // once the core is initialized, we'll use that to resolve this promise.
    this.waitInitializedPromise = new Promise<void>((resolve) => {
      this._handshakePromise = this.handshake.then((child) => {
        // Stash the API for future calls
        this.child = child;

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

        // Setup a listener for the "initialized" event.
        child.on("initialized", () => {
          // Resolve waitInitialized
          resolve();

          // And mark us as initialized
          this.coreInitialized = true;
        });

        child.on("callSuccess", (data: IIFrameCallData<any>) => {
          // Get the matching calls
          const matchingCalls = this.calls.filter((val) => {
            return val.callData.callId == data.callId;
          });

          // Remove the matching calls from the source array
          this.calls = this.calls.filter((val) => {
            return val.callData.callId != data.callId;
          });

          // Resolve the calls - should only ever be 1
          for (const call of matchingCalls) {
            call.resolve(data.data);
          }
        });

        child.on("callError", (data: IIFrameCallData<any>) => {
          // Get the matching calls
          const matchingCalls = this.calls.filter((val) => {
            return val.callData.callId == data.callId;
          });

          // Remove the matching calls from the source array
          this.calls = this.calls.filter((val) => {
            return val.callData.callId != data.callId;
          });

          // Reject the calls - should only ever be 1
          for (const call of matchingCalls) {
            call.reject(data.data);
          }
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
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | NodeError | Error
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
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | NodeError | Error
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
    RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
  > {
    const call = this._createCall("getLinks", null);

    return call.getResult();
  }

  public getActiveLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
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
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error> {
    const call = this._createCall("sendFunds", {
      counterPartyAccount,
      amount,
      expirationDate: expirationDate.toISOString(),
      requiredStake,
      paymentToken,
      disputeMediator,
    });

    return call.getResult();
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
    const call = this._createCall("acceptFunds", paymentIds);

    return call.getResult();
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
    const call = this._createCall("acceptFunds", amount.toString());

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

  protected _createCall(callName: string, data: any): IFrameCall<any, any> {
    const callId = this.callId++;
    const callData = new IFrameCallData(callId, data);

    const call = new IFrameCall(callData);
    this.calls.push(call);

    this.child?.call(callName, callData);

    return call;
  }
}
