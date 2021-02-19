import Postmate from "postmate";
import { ResultAsync } from "neverthrow";

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

  constructor(element: HTMLElement | null, iframeUrl: string) {
    this.child = null;

    if (element == null) {
      element = document.body;
    }

    this.handshake = new Postmate({
      container: element,
      url: iframeUrl,
      name: "hypernet-core-iframe",
      classListArray: ["hypernet-core-iframe-style"], // Classes to add to the iframe
    });
  }

  public activate(): ResultAsync<void, Error> {
    return ResultAsync.fromPromise(this.handshake, (e) => e as Error).map((child) => {
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
    });
  }

  protected _createCall(callName: string, data: any): IFrameCall<any, any> {
    const callId = this.callId++;
    const callData = new IFrameCallData(callId, data);

    const call = new IFrameCall(callData);
    this.calls.push(call);

    this.child?.call(callName, callData);

    return call;
  }
}
