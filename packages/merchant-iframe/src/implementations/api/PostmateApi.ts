import { errAsync, okAsync, ResultAsync } from "neverthrow";
import Postmate from "postmate";
import { ChildProxy, IIFrameCallData } from "@hypernetlabs/utils";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
import { IMerchantIFrameApi } from "@merchant-iframe/interfaces/api";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { PushPayment, PullPayment } from "@hypernetlabs/objects";

export class PostmateApi extends ChildProxy implements IMerchantIFrameApi {
  protected merchantConnector: IMerchantConnector | undefined;
  constructor(protected merchantService: IMerchantService, protected contextProvider: IContextProvider) {
    super();

    const context = contextProvider.getMerchantContext();

    context.onMerchantConnectorActivated.subscribe({
      next: (merchantConnector) => {
        // We are going to relay the RXJS events
        merchantConnector.onSendFundsRequested.subscribe(() => {
          this.parent?.emit("onSendFundsRequested");
        });

        merchantConnector.onAuthorizeFundsRequested.subscribe(() => {
          this.parent?.emit("onAuthorizeFundsRequested");
        });

        merchantConnector.onDisplayRequested.subscribe(() => {
          this.parent?.emit("onDisplayRequested", context.merchantUrl);
        });

        merchantConnector.onCloseRequested.subscribe(() => {
          this.parent?.emit("onCloseRequested", context.merchantUrl);
        });
      },
    });
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model. The merchant iframe has two halves- the parts that work before the merchant connector has been activated
    // and the parts that work afterward. Postmate only supports a single model, so you have to have all the functions defined up front.
    Postmate.debug = true;
    return new Postmate.Model({
      activateConnector: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          console.log("activateConnector!");

          return this.merchantService.activateMerchantConnector().map((merchantConnector) => {
            this.merchantConnector = merchantConnector;
          });
        }, data.callId);
      },
      resolveChallenge: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          if (this.merchantConnector == null) {
            return errAsync(new Error("No merchant connector available!"));
          }

          return ResultAsync.fromPromise(this.merchantConnector.resolveChallenge(data.data), (e) => e);
        }, data.callId);
      },
      getAddress: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          if (this.merchantConnector == null) {
            return errAsync(new Error("No merchant connector available!"));
          }
          return ResultAsync.fromPromise(this.merchantConnector.getAddress(), (e) => e);
        }, data.callId);
      },
      getValidatedSignature: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();

          return okAsync(context.validatedMerchantSignature);
        }, data.callId);
      },
      merchantIFrameClosed: (data: IIFrameCallData<void>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onIFrameClosed();
      },
      merchantIFrameDisplayed: (data: IIFrameCallData<void>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onIFrameClosed();
      },
      onPushPaymentSent: (data: IIFrameCallData<PushPayment>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onPushPaymentSent(data.data);
      },
      onPushPaymentUpdated: (data: IIFrameCallData<PushPayment>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onPushPaymentUpdated(data.data);
      },
      onPushPaymentReceived: (data: IIFrameCallData<PushPayment>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onPushPaymentReceived(data.data);
      },
      onPullPaymentSent: (data: IIFrameCallData<PullPayment>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onPullPaymentSent(data.data);
      },
      onPullPaymentUpdated: (data: IIFrameCallData<PullPayment>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onPullPaymentUpdated(data.data);
      },
      onPullPaymentReceived: (data: IIFrameCallData<PullPayment>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onPullPaymentReceived(data.data);
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {}
}
