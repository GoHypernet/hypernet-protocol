import {
  IAuthorizeFundsRequest,
  IResolutionResult,
  ISendFundsRequest,
} from "@hypernetlabs/merchant-connector";
import {
  EthereumAddress,
  MerchantConnectorError,
  MerchantValidationError,
  PaymentId,
  ProxyError,
  Signature,
  MerchantUrl,
  Balances,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  MerchantActivationError,
} from "@hypernetlabs/objects";
import { ParentProxy, ResultUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { HypernetContext } from "@interfaces/objects";
import {
  IMerchantConnectorProxy,
  IContextProvider,
} from "@interfaces/utilities";

export class MerchantConnectorProxy
  extends ParentProxy
  implements IMerchantConnectorProxy {
  protected static openedIFramesQueue: string[] = [];

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    public merchantUrl: MerchantUrl,
    protected iframeName: string,
    protected contextProvider: IContextProvider,
    protected debug: boolean = false,
  ) {
    super(element, iframeUrl, iframeName, debug);

    this.signMessageRequested = new Subject();
    this.sendFundsRequested = new Subject();
    this.authorizeFundsRequested = new Subject();
  }

  public signMessageRequested: Subject<string>;
  public sendFundsRequested: Subject<ISendFundsRequest>;
  public authorizeFundsRequested: Subject<IAuthorizeFundsRequest>;

  public activateConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<void, MerchantActivationError | ProxyError> {
    const assets = balances.assets.map((val) => {
      return {
        assetAddress: val.assetAddress,
        name: val.name,
        symbol: val.symbol,
        decimals: val.decimals,
        totalAmount: val.totalAmount.toString(),
        lockedAmount: val.lockedAmount.toString(),
        freeAmount: val.freeAmount.toString(),
      };
    });
    const activateData = {
      publicIdentifier,
      balances: { assets: assets },
    };
    return this._createCall<void, MerchantActivationError | ProxyError>(
      "activateConnector",
      activateData,
    ).mapErr((e) => {
      // TODO
      // _createCall's return type should be adjusted; it's not actually
      // the type is says
      return e;
    });
  }

  public resolveChallenge(
    paymentId: PaymentId,
  ): ResultAsync<IResolutionResult, MerchantConnectorError | ProxyError> {
    return this._createCall("resolveChallenge", paymentId);
  }

  public getAddress(): ResultAsync<
    EthereumAddress,
    MerchantConnectorError | ProxyError
  > {
    return this._createCall("getAddress", null);
  }

  public getValidatedSignature(): ResultAsync<
    Signature,
    MerchantValidationError | ProxyError
  > {
    return this._createCall("getValidatedSignature", null);
  }

  public activateProxy(): ResultAsync<void, ProxyError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.activate(),
    ]).map((vals) => {
      const [context] = vals;

      // Events coming from merchant connector iframe
      this.child?.on("displayRequested", () => {
        this._pushOpenedMerchantIFrame(this.merchantUrl);
        this._showMerchantIFrame(context);
      });

      this.child?.on("closeRequested", () => {
        // Only hide the merchant iframe if it's really displayed in the screen
        if (MerchantConnectorProxy.openedIFramesQueue[0] === this.merchantUrl) {
          this._hideMerchantIFrame();
        }

        // Only close the core iframe if there isn't any merchant iframe left in the queue, otherwise show the next one in the line
        if (MerchantConnectorProxy.openedIFramesQueue.length === 0) {
          context.onMerchantIFrameCloseRequested.next(this.merchantUrl);
        } else {
          this._showMerchantIFrame(context);
        }
      });

      this.child?.on("sendFundsRequested", (request: ISendFundsRequest) => {
        this.sendFundsRequested.next(request);
      });

      this.child?.on(
        "authorizeFundsRequested",
        (request: IAuthorizeFundsRequest) => {
          this.authorizeFundsRequested.next(request);
        },
      );

      this.child?.on("signMessageRequested", (message: string) => {
        this.signMessageRequested.next(message);
      });
    });
  }

  // Events coming from web integration and user interactions
  public displayMerchantIFrame(): ResultAsync<
    void,
    MerchantConnectorError | ProxyError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      this._pushOpenedMerchantIFrame(this.merchantUrl);
      this._showMerchantIFrame(context);

      return this._createCall("merchantIFrameDisplayed", this.merchantUrl);
    });
  }

  public closeMerchantIFrame(): ResultAsync<
    void,
    MerchantConnectorError | ProxyError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      this._hideMerchantIFrame();

      // Show the next merchant iframe (which is always the first merchant iframe in the queue) if there is any in the queue.
      if (MerchantConnectorProxy.openedIFramesQueue.length > 0) {
        this._showMerchantIFrame(context);
      }

      // notify the child in merchant connector to tell him that the merchant iframe is going to close up.
      return this._createCall("merchantIFrameClosed", this.merchantUrl);
    });
  }

  public notifyPushPaymentSent(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError> {
    return this._createCall("notifyPushPaymentSent", payment);
  }

  public notifyPushPaymentUpdated(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError> {
    return this._createCall("notifyPushPaymentUpdated", payment);
  }

  public notifyPushPaymentReceived(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError> {
    return this._createCall("notifyPushPaymentReceived", payment);
  }

  public notifyPullPaymentSent(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError> {
    return this._createCall("notifyPullPaymentSent", payment);
  }

  public notifyPullPaymentUpdated(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError> {
    return this._createCall("notifyPullPaymentUpdated", payment);
  }

  public notifyPullPaymentReceived(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError> {
    return this._createCall("notifyPullPaymentReceived", payment);
  }

  public notifyPublicIdentifier(
    public_identifier: PublicIdentifier,
  ): ResultAsync<void, MerchantConnectorError> {
    return this._createCall("notifyPublicIdentifier", public_identifier);
  }

  public notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError> {
    return this._createCall("notifyBalancesReceived", balances);
  }

  public messageSigned(
    message: string,
    signature: Signature,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("messageSigned", { message, signature });
  }

  private _pushOpenedMerchantIFrame(merchantUrl: MerchantUrl) {
    // Check if there is merchantUrl in the queue
    // If there is, don't re-add it.
    const index = MerchantConnectorProxy.openedIFramesQueue.indexOf(
      merchantUrl,
    );
    if (index > -1) {
      return;
    }
    MerchantConnectorProxy.openedIFramesQueue.push(merchantUrl);
  }

  private _showMerchantIFrame(context: HypernetContext) {
    // Show the first merchant iframe in the queue
    document.getElementsByName(
      `hypernet-core-merchant-connector-iframe-${MerchantConnectorProxy.openedIFramesQueue[0]}`,
    )[0].style.display = "block";
    context.onMerchantIFrameDisplayRequested.next(
      MerchantUrl(MerchantConnectorProxy.openedIFramesQueue[0]),
    );
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
