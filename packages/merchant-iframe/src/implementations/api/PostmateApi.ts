import { errAsync, okAsync, ResultAsync } from "neverthrow";
import Postmate from "postmate";
import { ChildProxy, IIFrameCallData } from "@hypernetlabs/utils";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
import { IMerchantIFrameApi } from "@merchant-iframe/interfaces/api";
import { IMerchantService } from "@merchant-iframe/interfaces/business";

export default class PostmateApi extends ChildProxy implements IMerchantIFrameApi {
  protected merchantConnector: IMerchantConnector | undefined;
  constructor(protected merchantService: IMerchantService, protected contextProvider: IContextProvider) {
    super();

    const context = contextProvider.getMerchantContext();

    context.onMerchantConnectorActivated.subscribe({
      next: (merchantConnector) => {
        // We are going to relay the RXJS events
        merchantConnector.onSendFundsRequested.subscribe((val) => {
          this.parent?.emit("onSendFundsRequested", val);
        });

        merchantConnector.onAuthorizeFundsRequested.subscribe((val) => {
          this.parent?.emit("onAuthorizeFundsRequested", val);
        });

        merchantConnector.onDisplayRequested.subscribe(() => {
          this.parent?.emit("onDisplayRequested");
        });

        merchantConnector.onCloseRequested.subscribe(() => {
          this.parent?.emit("onCloseRequested");
        });
      },
    });
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model. The merchant iframe has two halves- the parts that work before the merchant connector has been activated
    // and the parts that work afterward. Postmate only supports a single model, so you have to have all the functions defined up front.
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
      getPublicKey: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          if (this.merchantConnector == null) {
            return errAsync(new Error("No merchant connector available!"));
          }
          return ResultAsync.fromPromise(this.merchantConnector.getPublicKey(), (e) => e);
        }, data.callId);
      },
      getValidatedSignature: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();

          console.log(`In iframe, validatedMerchantSignature = ${context.validatedMerchantSignature}`);

          return okAsync(context.validatedMerchantSignature);
        }, data.callId);
      },
      onMerchantIFrameClosed: (data: IIFrameCallData<void>) => {
        const context = this.contextProvider.getMerchantContext();
        context.merchantConnector?.onIFrameClosed.next();
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {}
}
