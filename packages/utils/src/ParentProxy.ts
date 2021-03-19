import Postmate from "postmate";
import { errAsync, ResultAsync } from "neverthrow";
import { ProxyError } from "@hypernetlabs/objects/errors";

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

export abstract class ParentProxy {
  protected handshake: Postmate;
  protected child: Postmate.ParentAPI | null;
  protected callId: number = 0;
  protected calls: IFrameCall<any, any>[] = [];
  protected active: boolean;

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected iframeName: string,
    protected debug: boolean = false,
  ) {
    this.child = null;
    this.active = false;

    if (element == null) {
      element = document.body;
    }

    Postmate.debug = debug;
    this.handshake = new Postmate({
      container: element,
      url: iframeUrl,
      name: iframeName,
      classListArray: ["hypernet-core-iframe-style"], // Classes to add to the iframe
    });
  }

  protected activateResult: ResultAsync<void, Error> | undefined;

  public activate(): ResultAsync<void, Error> {
    if (this.activateResult != null) {
      return this.activateResult;
    }
    this.activateResult = ResultAsync.fromPromise(this.handshake, (e) => e as Error).map((child) => {
      // Stash the API for future calls
      this.child = child;

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

      this.active = true;
    });

    return this.activateResult;
  }

  public destroy() {
    this.child?.destroy();
    this.active = false;
  }

  protected _createCall<T, E>(callName: string, data: any): ResultAsync<T, E | ProxyError> {
    if (!this.active) {
      return errAsync(
        new ProxyError("Proxy is not activated or has been destroyed, cannot make a call to the iframe!"),
      );
    }
    const callId = this.callId++;
    const callData = new IFrameCallData(callId, data);

    const call = new IFrameCall<T, E>(callData);
    this.calls.push(call);

    this.child?.call(callName, callData);

    return call.getResult();
  }
}
