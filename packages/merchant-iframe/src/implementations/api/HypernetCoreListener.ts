import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
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
import { BigNumber } from "ethers";
import { injectable, inject } from "inversify";
import { okAsync } from "neverthrow";
import Postmate from "postmate";

import { IHypernetCoreListener } from "@merchant-iframe/interfaces/api";
import {
  IMerchantService,
  IMerchantServiceType,
} from "@merchant-iframe/interfaces/business";
import {
  IContextProvider,
  IContextProviderType,
} from "@merchant-iframe/interfaces/utils";

@injectable()
export class HypernetCoreListener
  extends ChildProxy
  implements IHypernetCoreListener {
  protected merchantConnector: IMerchantConnector | undefined;

  constructor(
    @inject(IMerchantServiceType) protected merchantService: IMerchantService,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model. The merchant iframe has two halves- the parts that work before the merchant connector has been activated
    // and the parts that work afterward. Postmate only supports a single model, so you have to have all the functions defined up front.
    Postmate.debug = true;
    return new Postmate.Model({
      activateConnector: (data: IIFrameCallData<IActivateConnectorData>) => {
        this.returnForModel(() => {
          // Convert the balances to an actual balances object
          const assets = data.data.balances.assets.map((val) => {
            return new AssetBalance(
              val.assetAddress,
              val.name,
              val.symbol,
              val.decimals,
              BigNumber.from(val.totalAmount),
              BigNumber.from(val.lockedAmount),
              BigNumber.from(val.freeAmount),
            );
          });
          const balances = new Balances(assets);

          return this.merchantService
            .activateMerchantConnector(data.data.publicIdentifier, balances)
            .map((merchantConnector) => {
              this.merchantConnector = merchantConnector;
            });
        }, data.callId);
      },
      resolveChallenge: (data: IIFrameCallData<PaymentId>) => {
        this.returnForModel(() => {
          return this.merchantService.resolveChallenge(data.data);
        }, data.callId);
      },
      getAddress: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.merchantService.getAddress();
        }, data.callId);
      },
      getValidatedSignature: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.merchantService.getValidatedSignature();
        }, data.callId);
      },
      getMerchantUrl: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.merchantService.getMerchantUrl();
        }, data.callId);
      },
      merchantIFrameClosed: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onIFrameClosed();
          return okAsync(undefined);
        }, data.callId);
      },
      merchantIFrameDisplayed: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onIFrameClosed();
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentSent: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPushPaymentSent(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentUpdated: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPushPaymentUpdated(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPushPaymentReceived: (data: IIFrameCallData<PushPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPushPaymentReceived(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentSent: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPullPaymentSent(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentUpdated: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPullPaymentUpdated(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPullPaymentReceived: (data: IIFrameCallData<PullPayment>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onPullPaymentReceived(data.data);
          return okAsync(undefined);
        }, data.callId);
      },
      notifyPublicIdentifier: (data: IIFrameCallData<PublicIdentifier>) => {
        this.returnForModel(() => {
          return this.merchantService.publicIdentifierReceived(data.data);
        }, data.callId);
      },
      notifyBalancesReceived: (data: IIFrameCallData<Balances>) => {
        this.returnForModel(() => {
          const context = this.contextProvider.getMerchantContext();
          context.merchantConnector?.onBalancesReceived(data.data);
          return okAsync(undefined);
        }, data.callId);
      },

      messageSigned: (data: IIFrameCallData<ISignatureResponseData>) => {
        this.returnForModel(() => {
          return this.merchantService.messageSigned(
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
      .getMerchantContext()
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
