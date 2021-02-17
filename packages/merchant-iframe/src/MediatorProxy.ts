import { ResultAsync } from "neverthrow";
import Postmate from "postmate";
import { IMerchantConnector } from "@hypernetlabs/merchant-connector";

interface IIFrameCallData<T> {
  callId: number;
  data: T;
}

class IFrameCallData<T> implements IIFrameCallData<T> {
  constructor(public callId: number, public data: T) {}
}

export default class MediatorProxy {
  protected parent: Postmate.ChildAPI | undefined;

  constructor(protected mediator: IMerchantConnector) {
    // Fire up the Postmate model, and wrap up the core as the model
    const handshake = new Postmate.Model({
      resolveChallenge: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return ResultAsync.fromPromise(mediator.resolveChallenge(data.data), (e) => e);
        }, data.callId);
      },
      getPublicKey: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return ResultAsync.fromPromise(mediator.getPublicKey(), (e) => e);
        }, data.callId);
      },
    });

    handshake.then((initializedParent) => {
      this.parent = initializedParent;

      // We are going to relay the RXJS events
      this.mediator.onPushFundsRequested.subscribe((val) => {
        this.parent?.emit("onPushFundsRequested", val);
      });
    });
  }

  protected returnForModel<T, E>(func: () => ResultAsync<T, E>, callId: number) {
    func().match(
      (result) => {
        if (this.parent != null) {
          this.parent.emit("callSuccess", new IFrameCallData(callId, result));
        }
      },
      (e) => {
        if (this.parent != null) {
          this.parent.emit("callError", new IFrameCallData(callId, e));
        }
      },
    );
  }
}
