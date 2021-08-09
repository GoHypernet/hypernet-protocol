import { IGatewayConnector } from "@hypernetlabs/gateway-connector";
import {
  PushPayment,
  PullPayment,
  PublicIdentifier,
  Balances,
  AssetBalance,
  PaymentId,
  Signature,
} from "@hypernetlabs/objects";
import { ChildProxy, IIFrameCallData } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import { okAsync } from "neverthrow";
import Postmate from "postmate";

import { IHypernetCoreListener } from "@gateway-iframe/interfaces/api";
import {
  IGatewayService,
  IGatewayServiceType,
} from "@gateway-iframe/interfaces/business";
import {
  IContextProvider,
  IContextProviderType,
} from "@gateway-iframe/interfaces/utils";

@injectable()
export class HypernetCoreListener
  extends ChildProxy
  implements IHypernetCoreListener
{
  protected gatewayConnector: IGatewayConnector | undefined;

  constructor(
    @inject(IGatewayServiceType) protected gatewayService: IGatewayService,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model. The gateway iframe has two halves- the parts that work before the gateway connector has been activated
    // and the parts that work afterward. Postmate only supports a single model, so you have to have all the functions defined up front.
    Postmate.debug = true;
    return new Postmate.Model({
      activateConnector: (data: IIFrameCallData<IActivateConnectorData>) => {
        this.returnForModel(() => {
          // Convert the balances to an actual balances object
          const assets = data.data.balances.assets.map((val) => {
            return new AssetBalance(
              val.channelAddress,
              val.assetAddress,
              val.name,
              val.symbol,
              val.decimals,
              val.totalAmount,
              val.lockedAmount,
              val.freeAmount,
            );
          });
          const balances = new Balances(assets);

          return this.gatewayService
            .activateGatewayConnector(data.data.publicIdentifier, balances)
            .map((gatewayConnector) => {
              this.gatewayConnector = gatewayConnector;
            });
        }, data.callId);
      },
      deauthorize: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.gatewayService.deauthorize();
        }, data.callId);
      },
      getValidatedSignature: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.gatewayService.getValidatedSignature();
        }, data.callId);
      },
      getGatewayUrl: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.gatewayService.getGatewayUrl();
        }, data.callId);
      },
      gatewayIFrameClosed: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onIFrameClosed();
          return okAsync(undefined);
        }, data.callId);
      },
      gatewayIFrameDisplayed: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onIFrameClosed();
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentSent: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPushPaymentSent(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentUpdated: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPushPaymentUpdated(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentReceived: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPushPaymentReceived(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentDelayed: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPushPaymentDelayed(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentCanceled: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPushPaymentCanceled(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentSent: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPullPaymentSent(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentUpdated: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPullPaymentUpdated(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentReceived: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPullPaymentReceived(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentDelayed: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPullPaymentDelayed(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentCanceled: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onPullPaymentCanceled(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPublicIdentifier: (data: IIFrameCallData<PublicIdentifier>) => {
        this.returnForModel(() => {
          return this.gatewayService.publicIdentifierReceived(data.data);
        }, data.callId);
      },
      notifyBalancesReceived: (data: IIFrameCallData<Balances>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getGatewayContext();
          context.gatewayConnector?.onBalancesReceived(data.data);
          return okAsync(undefined);
        }, data.callId);
      },

      messageSigned: (data: IIFrameCallData<ISignatureResponseData>) => {
        this.returnForModel(() => {
          return this.gatewayService.messageSigned(
            data.data.message,
            data.data.signature,
          );
        }, data.callId);
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {
    // Send an event out to anybody that may be interested
    this.contextProvider
      .getGatewayContext()
      .onHypernetCoreProxyActivated.next(parent);
  }
}

interface IActivateConnectorData {
  publicIdentifier: PublicIdentifier;
  balances: Balances;
}

interface ISignatureResponseData {
  message: string;
  signature: Signature;
}
