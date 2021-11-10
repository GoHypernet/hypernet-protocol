import {
  ISignedAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  ISignedSendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import {
  GatewayConnectorError,
  GatewayValidationError,
  ProxyError,
  Signature,
  GatewayUrl,
  Balances,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  GatewayActivationError,
  IStateChannelRequest,
  UUID,
  GatewayTokenInfo,
  ActiveStateChannel,
  UtilityMessageSignature,
  PaymentId,
  AuthorizeFundsRequestData,
  SendFundsRequestData,
  EPaymentType,
} from "@hypernetlabs/objects";
import { ParentProxy, ResultUtils } from "@hypernetlabs/utils";
import { HypernetContext } from "@interfaces/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import {
  IGatewayConnectorProxy,
  IContextProvider,
} from "@interfaces/utilities";

export class GatewayConnectorProxy
  extends ParentProxy
  implements IGatewayConnectorProxy
{
  protected static openedIFramesQueue: string[] = [];
  protected activated = false;

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    public gatewayUrl: GatewayUrl,
    protected iframeName: string,
    protected contextProvider: IContextProvider,
    protected gatewayDeauthorizationTimeout: number,
    protected debug: boolean = false,
  ) {
    super(element, iframeUrl, iframeName, debug);

    this.signMessageRequested = new Subject();

    this.initiateSendFundsRequested = new Subject();
    this.sendFundsRequested = new Subject();

    this.initiateAuthorizeFundsRequested = new Subject();
    this.authorizeFundsRequested = new Subject();

    this.resolveInsuranceRequested = new Subject();
    this.stateChannelRequested = new Subject();
    this.getPaymentRequested = new Subject();
  }

  public signMessageRequested: Subject<string>;
  public initiateSendFundsRequested: Subject<SendFundsRequestData>;
  public sendFundsRequested: Subject<ISignedSendFundsRequest>;
  public initiateAuthorizeFundsRequested: Subject<AuthorizeFundsRequestData>;
  public authorizeFundsRequested: Subject<ISignedAuthorizeFundsRequest>;
  public resolveInsuranceRequested: Subject<IResolveInsuranceRequest>;
  public stateChannelRequested: Subject<IStateChannelRequest>;
  public getPaymentRequested: Subject<PaymentId>;

  public activateConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<void, GatewayActivationError | ProxyError> {
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
    return this._createCall<unknown, GatewayActivationError | ProxyError, void>(
      "activateConnector",
      activateData,
    )
      .map(() => {
        this.activated = true;
      })
      .mapErr((e) => {
        // TODO
        // _createCall's return type should be adjusted; it's not actually
        // the type is says
        return e;
      });
  }

  public getConnectorActivationStatus(): boolean {
    return this.activated;
  }

  public deauthorize(): ResultAsync<void, never> {
    const deauthTimeout = ResultAsync.fromSafePromise<void, never>(
      new Promise((resolve) => {
        setTimeout(() => resolve, this.gatewayDeauthorizationTimeout);
      }),
    );
    return ResultUtils.race<void, ProxyError>([
      this._createCall("deauthorize", null),
      deauthTimeout,
    ]).orElse(() => {
      // This method will never throw an error
      return okAsync<void, never>(undefined);
    });
  }

  public getValidatedSignature(): ResultAsync<
    Signature,
    GatewayValidationError | ProxyError
  > {
    return this._createCall("getValidatedSignature", null);
  }

  public getGatewayTokenInfo(): ResultAsync<GatewayTokenInfo[], ProxyError> {
    return this._createCall("getGatewayTokenInfo", null);
  }

  public activateProxy(): ResultAsync<void, ProxyError> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.activate(),
    ]).map(([context]) => {
      // Events coming from gateway connector iframe
      this.child?.on("displayRequested", () => {
        this._pushOpenedGatewayIFrame(this.gatewayUrl);
        this._showGatewayIFrame(context);
      });

      this.child?.on("closeRequested", () => {
        // Only hide the gateway iframe if it's really displayed in the screen
        if (GatewayConnectorProxy.openedIFramesQueue[0] === this.gatewayUrl) {
          this._hideGatewayIFrame();
        }

        // Only close the core iframe if there isn't any gateway iframe left in the queue, otherwise show the next one in the line
        if (GatewayConnectorProxy.openedIFramesQueue.length === 0) {
          context.onGatewayIFrameCloseRequested.next(this.gatewayUrl);
        } else {
          this._showGatewayIFrame(context);
        }
      });

      this.child?.on(
        "initiateSendFundsRequested",
        (request: SendFundsRequestData) => {
          this.initiateSendFundsRequested.next(request);
        },
      );

      this.child?.on(
        "sendFundsRequested",
        (request: ISignedSendFundsRequest) => {
          this.sendFundsRequested.next(request);
        },
      );

      this.child?.on(
        "initiateAuthorizeFundsRequested",
        (request: AuthorizeFundsRequestData) => {
          this.initiateAuthorizeFundsRequested.next(request);
        },
      );

      this.child?.on(
        "authorizeFundsRequested",
        (request: ISignedAuthorizeFundsRequest) => {
          this.authorizeFundsRequested.next(request);
        },
      );

      this.child?.on(
        "resolveInsuranceRequested",
        (request: IResolveInsuranceRequest) => {
          this.resolveInsuranceRequested.next(request);
        },
      );

      this.child?.on("signMessageRequested", (message: string) => {
        this.signMessageRequested.next(message);
      });

      this.child?.on(
        "stateChannelRequested",
        (request: IStateChannelRequest) => {
          this.stateChannelRequested.next(request);
        },
      );

      this.child?.on("getPaymentRequested", (paymentId: PaymentId) => {
        this.getPaymentRequested.next(paymentId);
      });
    });
  }

  // Events coming from web integration and user interactions
  public displayGatewayIFrame(): ResultAsync<
    void,
    GatewayConnectorError | ProxyError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      this._pushOpenedGatewayIFrame(this.gatewayUrl);
      this._showGatewayIFrame(context);

      return this._createCall<
        GatewayUrl,
        GatewayConnectorError | ProxyError,
        void
      >("gatewayIFrameDisplayed", this.gatewayUrl);
    });
  }

  public closeGatewayIFrame(): ResultAsync<
    void,
    GatewayConnectorError | ProxyError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      this._hideGatewayIFrame();

      // Show the next gateway iframe (which is always the first gateway iframe in the queue) if there is any in the queue.
      if (GatewayConnectorProxy.openedIFramesQueue.length > 0) {
        this._showGatewayIFrame(context);
      }

      // notify the child in gateway connector to tell him that the gateway iframe is going to close up.
      return this._createCall<
        GatewayUrl,
        GatewayConnectorError | ProxyError,
        void
      >("gatewayIFrameClosed", this.gatewayUrl);
    });
  }

  public notifyPushPaymentSent(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPushPaymentSent", payment);
  }

  public notifyPushPaymentUpdated(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPushPaymentUpdated", payment);
  }

  public notifyPushPaymentReceived(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPushPaymentReceived", payment);
  }

  public notifyPushPaymentDelayed(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPushPaymentDelayed", payment);
  }

  public notifyPushPaymentCanceled(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPushPaymentCanceled", payment);
  }

  public notifyPullPaymentSent(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPullPaymentSent", payment);
  }

  public notifyPullPaymentUpdated(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPullPaymentUpdated", payment);
  }

  public notifyPullPaymentReceived(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPullPaymentReceived", payment);
  }

  public notifyPullPaymentDelayed(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPullPaymentDelayed", payment);
  }

  public notifyPullPaymentCanceled(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError> {
    return this._createCall("notifyPullPaymentCanceled", payment);
  }

  public notifyPublicIdentifier(
    public_identifier: PublicIdentifier,
  ): ResultAsync<void, GatewayConnectorError> {
    return this._createCall("notifyPublicIdentifier", public_identifier);
  }

  public notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, GatewayConnectorError> {
    return this._createCall("notifyBalancesReceived", balances);
  }

  public messageSigned(
    message: string,
    signature: UtilityMessageSignature,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("messageSigned", { message, signature });
  }

  public returnStateChannel(
    id: UUID,
    stateChannel: ActiveStateChannel,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("returnStateChannel", {
      id,
      stateChannel,
    });
  }

  public returnPayment(
    paymentId: PaymentId,
    payment: PushPayment | PullPayment | null,
    paymentType: EPaymentType,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("returnPayment", {
      paymentId,
      payment,
      paymentType,
    });
  }

  public sendFundsInitiated(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("sendFundsInitiated", {
      requestId,
      paymentId,
    });
  }
  public authorizeFundsInitiated(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("authorizeFundsInitiated", {
      requestId,
      paymentId,
    });
  }

  private _pushOpenedGatewayIFrame(gatewayUrl: GatewayUrl) {
    // Check if there is gatewayUrl in the queue
    // If there is, don't re-add it.
    const index = GatewayConnectorProxy.openedIFramesQueue.indexOf(gatewayUrl);
    if (index > -1) {
      return;
    }
    GatewayConnectorProxy.openedIFramesQueue.push(gatewayUrl);
  }

  private _showGatewayIFrame(context: HypernetContext) {
    // Show the first gateway iframe in the queue
    document.getElementsByName(
      `hypernet-core-gateway-connector-iframe-${GatewayConnectorProxy.openedIFramesQueue[0]}`,
    )[0].style.display = "block";
    context.onGatewayIFrameDisplayRequested.next(
      GatewayUrl(GatewayConnectorProxy.openedIFramesQueue[0]),
    );
  }

  private _hideGatewayIFrame() {
    if (!GatewayConnectorProxy.openedIFramesQueue.length) return;

    // Hide the first gateway iframe in the queue which is the current one that is displayed in the screen.
    document.getElementsByName(
      `hypernet-core-gateway-connector-iframe-${GatewayConnectorProxy.openedIFramesQueue[0]}`,
    )[0].style.display = "none";
    // We're done with it, remove it from the queue
    GatewayConnectorProxy.openedIFramesQueue.shift();
  }
}
