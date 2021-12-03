import { IGatewayConnector } from "@hypernetlabs/gateway-connector";
import {
  PushPayment,
  PullPayment,
  PublicIdentifier,
  Balances,
  AssetBalance,
  UUID,
  ActiveStateChannel,
  UtilityMessageSignature,
  PaymentId,
  EPaymentType,
} from "@hypernetlabs/objects";
import { ChildProxy, IIFrameCallData } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import { errAsync, okAsync } from "neverthrow";
import Postmate from "postmate";

import { IHypernetCoreListener } from "@gateway-iframe/interfaces/api";
import {
  IGatewayService,
  IGatewayServiceType,
  IPaymentService,
  IPaymentServiceType,
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
    @inject(IPaymentServiceType) protected paymentService: IPaymentService,
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
          try {
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
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      deauthorize: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          try {
            return this.gatewayService.deauthorize();
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      getValidatedSignature: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          try {
            return this.gatewayService.getValidatedSignature();
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      getGatewayTokenInfo: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          try {
            return this.gatewayService.getGatewayTokenInfo();
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      getGatewayUrl: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          try {
            return this.gatewayService.getGatewayUrl();
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      gatewayIFrameClosed: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onIFrameClosed();
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      gatewayIFrameDisplayed: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onIFrameDisplayed();
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPushPaymentSent: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPushPaymentSent(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPushPaymentUpdated: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPushPaymentUpdated(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPushPaymentReceived: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPushPaymentReceived(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPushPaymentDelayed: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPushPaymentDelayed(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPushPaymentCanceled: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPushPaymentCanceled(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPullPaymentSent: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPullPaymentSent(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPullPaymentUpdated: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPullPaymentUpdated(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPullPaymentReceived: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPullPaymentReceived(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPullPaymentDelayed: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPullPaymentDelayed(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPullPaymentCanceled: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onPullPaymentCanceled(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyRepairRequested: (
        data: IIFrameCallData<PushPayment | PullPayment>,
      ) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onRepairRequested(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyPublicIdentifier: (data: IIFrameCallData<PublicIdentifier>) => {
        this.returnForModel(() => {
          try {
            return this.gatewayService.publicIdentifierReceived(data.data);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },
      notifyBalancesReceived: (data: IIFrameCallData<Balances>) => {
        this.returnForModel(() => {
          try {
            const context = this.contextProvider.getGatewayContext();
            context.gatewayConnector?.onBalancesReceived(data.data);
            return okAsync(undefined);
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },

      sendFundsInitiated: (data: IIFrameCallData<ISendFundsInitiatedData>) => {
        this.returnForModel(() => {
          try {
            return this.paymentService.sendFundsInitiated(
              data.data.requestId,
              data.data.paymentId,
            );
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },

      authorizeFundsInitiated: (
        data: IIFrameCallData<IAuthorizeFundsInitiatedData>,
      ) => {
        this.returnForModel(() => {
          try {
            return this.paymentService.authorizeFundsInitiated(
              data.data.requestId,
              data.data.paymentId,
            );
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },

      messageSigned: (data: IIFrameCallData<ISignatureResponseData>) => {
        this.returnForModel(() => {
          try {
            return this.gatewayService.messageSigned(
              data.data.message,
              data.data.signature,
            );
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },

      returnStateChannel: (
        data: IIFrameCallData<IStateChannelReturnedResponseData>,
      ) => {
        this.returnForModel(() => {
          try {
            return this.gatewayService.stateChannelAssured(
              data.data.id,
              data.data.stateChannel,
            );
          } catch (e) {
            return errAsync(e);
          }
        }, data.callId);
      },

      returnPayment: (data: IIFrameCallData<IPaymentReturnedResponseData>) => {
        this.returnForModel(() => {
          try {
            return this.paymentService.paymentReceived(
              data.data.paymentId,
              data.data.payment,
              data.data.paymentType,
            );
          } catch (e) {
            return errAsync(e);
          }
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

interface ISendFundsInitiatedData {
  requestId: string;
  paymentId: PaymentId;
}

interface IAuthorizeFundsInitiatedData {
  requestId: string;
  paymentId: PaymentId;
}

interface IActivateConnectorData {
  publicIdentifier: PublicIdentifier;
  balances: Balances;
}

interface ISignatureResponseData {
  message: string;
  signature: UtilityMessageSignature;
}

interface IStateChannelReturnedResponseData {
  id: UUID;
  stateChannel: ActiveStateChannel;
}

interface IPaymentReturnedResponseData {
  paymentId: PaymentId;
  payment: PushPayment | PullPayment | null;
  paymentType: EPaymentType;
}
