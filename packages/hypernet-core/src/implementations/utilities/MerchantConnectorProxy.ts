import { ParentProxy, ResultUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { MerchantConnectorError, MerchantValidationError } from "@interfaces/objects/errors";
import { HexString } from "@interfaces/objects";
import { IMerchantConnectorProxy, IContextProvider } from "@interfaces/utilities";

export class MerchantConnectorProxy extends ParentProxy implements IMerchantConnectorProxy {
  protected static openedIFramesQueue: string[] = [];

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected iframeName: string,
    protected contextProvider: IContextProvider,
    protected debug: boolean = false,
  ) {
    super(element, iframeUrl, iframeName, debug);
  }

  public activateConnector(): ResultAsync<void, MerchantConnectorError> {
    return this._createCall("activateConnector", null);
  }

  public resolveChallenge(paymentId: HexString): ResultAsync<IResolutionResult, MerchantConnectorError> {
    return this._createCall("resolveChallenge", paymentId);
  }

  public getAddress(): ResultAsync<HexString, MerchantConnectorError> {
    return this._createCall("getAddress", null);
  }

  public getValidatedSignature(): ResultAsync<string, MerchantValidationError> {
    return this._createCall("getValidatedSignature", null);
  }

  public activate(): ResultAsync<void, MerchantValidationError> {
    return ResultUtils.combine([this.contextProvider.getContext(), super.activate()]).map((vals) => {
      const [context] = vals;

      // Events coming from merchant connector iframe
      this.child?.on("onDisplayRequested", (merchantUrl) => {
        this._pushOpenedMerchantIFrame(merchantUrl);
        this._showMerchantIFrame();

        context.onMerchantIFrameDisplayRequested.next(merchantUrl);
      });

      this.child?.on("onCloseRequested", (merchantUrl) => {
        // Only hide the merchant iframe if it's really displayed in the screen
        if (MerchantConnectorProxy.openedIFramesQueue[0] === merchantUrl) {
          this._hideMerchantIFrame();
        }

        // Only close the core iframe if there isn't any merchant iframe left in the queue, otherwise show the next one in the line
        if (MerchantConnectorProxy.openedIFramesQueue.length === 0) {
          context.onMerchantIFrameCloseRequested.next(merchantUrl);
        } else {
          this._showMerchantIFrame();
        }
      });

      // Events coming from web integration and user interactions
      context.onMerchantIFrameDisplayed.subscribe((merchantUrl: string) => {
        this._pushOpenedMerchantIFrame(merchantUrl);
        this._showMerchantIFrame();

        this._createCall("onMerchantIFrameDisplayed", merchantUrl);
      });

      context.onMerchantIFrameClosed.subscribe((merchantUrl: string) => {
        this._hideMerchantIFrame();

        // Show the next merchant iframe (which is always the first merchant iframe in the queue) if there is any in the queue.
        if (MerchantConnectorProxy.openedIFramesQueue.length > 0) {
          this._showMerchantIFrame();
          context.onMerchantIFrameDisplayRequested.next(MerchantConnectorProxy.openedIFramesQueue[0]);
        }

        // notify the child in merchant connector to tell him that the merchant iframe is going to close up.
        this._createCall("onMerchantIFrameClosed", merchantUrl);
      });
    });
  }

  private _pushOpenedMerchantIFrame(merchantUrl: string) {
    // Check if there is merchantUrl in the queue
    const index = MerchantConnectorProxy.openedIFramesQueue.indexOf(merchantUrl);
    if (index > -1) {
      MerchantConnectorProxy.openedIFramesQueue.splice(index, 1);
    }
    MerchantConnectorProxy.openedIFramesQueue.push(merchantUrl);
  }

  private _showMerchantIFrame() {
    // Show the first merchant iframe in the queue
    document.getElementsByName(
      `hypernet-core-merchant-connector-iframe-${MerchantConnectorProxy.openedIFramesQueue[0]}`,
    )[0].style.display = "block";
  }

  private _hideMerchantIFrame() {
    if (!MerchantConnectorProxy.openedIFramesQueue.length) return;

    // Hide the first merchant iframe in the queue which is the current one that is displayed in the screen.
    document.getElementsByName(
      `hypernet-core-merchant-connector-iframe-${MerchantConnectorProxy.openedIFramesQueue[0]}`,
    )[0].style.display = "none";
    // We're done with it, remove it from the queue
    MerchantConnectorProxy.openedIFramesQueue.shift();
  }
}
