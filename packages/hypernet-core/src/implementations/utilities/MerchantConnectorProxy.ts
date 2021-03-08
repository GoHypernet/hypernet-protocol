import { ParentProxy, ResultUtils } from "@hypernetlabs/utils";
import Postmate from "postmate";
import { okAsync, ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { MerchantConnectorError, MerchantValidationError } from "@interfaces/objects/errors";
import { HexString, HypernetContext, PublicKey } from "@interfaces/objects";
import { IMerchantConnectorProxy, IContextProvider } from "@interfaces/utilities";

export class MerchantConnectorProxy extends ParentProxy implements IMerchantConnectorProxy {
  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected contextProvider: IContextProvider,
  ) {
    super(element, iframeUrl);
  }

  public activateConnector(): ResultAsync<void, MerchantConnectorError> {
    return this._createCall("activateConnector", null);
  }

  public resolveChallenge(paymentId: HexString): ResultAsync<IResolutionResult, MerchantConnectorError> {
    return this._createCall("resolveChallenge", paymentId);
  }

  public getPublicKey(): ResultAsync<PublicKey, MerchantConnectorError> {
    return this._createCall("getPublicKey", null);
  }

  public getValidatedSignature(): ResultAsync<string, MerchantValidationError> {
    return this._createCall("getValidatedSignature", null);
  }

  public activateProxy(): ResultAsync<void, MerchantValidationError> {
    let context: HypernetContext;

    return ResultUtils.combine([this.contextProvider.getContext(), this.activate()])
      .andThen((vals) => {
        [context] = vals;

        return this.activate();
      })
      .map(() => {
        // We need to make sure to have the listeners after postmate model gets activated
        this.child?.on("onDisplayRequested", () => {
          context.onMerchantIFrameDisplayRequested.next("");
        });
        this.child?.on("onCloseRequested", () => {
          context.onMerchantIFrameCloseRequested.next();
        });

        // Listen for iframe close and open events and pass them down to the child proxy.
        context.onMerchantIFrameClosed.subscribe((data: string) => {
          this._createCall("onMerchantIFrameClosed", data);
        });

        context.onMerchantIFrameDisplayed.subscribe((data: string) => {
          this._createCall("onMerchantIFrameDisplayed", data);
        });
      });
  }
}
