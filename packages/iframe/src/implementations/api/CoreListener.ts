import { ICoreListener } from "@core-iframe/interfaces/api";
import {
  ICoreUIService,
  ICoreUIServiceType,
} from "@core-iframe/interfaces/business";
import {
  EthereumAddress,
  PublicIdentifier,
  IHypernetCore,
  IHypernetCoreType,
  PaymentId,
  GatewayUrl,
  BigNumberString,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { IIFrameCallData, ChildProxy } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import Postmate from "postmate";

@injectable()
export class CoreListener extends ChildProxy implements ICoreListener {
  constructor(
    @inject(IHypernetCoreType) protected core: IHypernetCore,
    @inject(ICoreUIServiceType) protected coreUIService: ICoreUIService,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model, and wrap up the core as the model
    return new Postmate.Model({
      initialize: (data: IIFrameCallData<EthereumAddress>) => {
        this.returnForModel(() => {
          return this.core.initialize(data.data);
        }, data.callId);
      },
      waitInitialized: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.waitInitialized();
        }, data.callId);
      },
      getEthereumAccounts: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getEthereumAccounts();
        }, data.callId);
      },
      getPublicIdentifier: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getPublicIdentifier();
        }, data.callId);
      },
      depositFunds: (
        data: IIFrameCallData<{
          assetAddress: EthereumAddress;
          amount: BigNumberString;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.depositFunds(
            data.data.assetAddress,
            data.data.amount,
          );
        }, data.callId);
      },

      withdrawFunds: (
        data: IIFrameCallData<{
          assetAddress: EthereumAddress;
          amount: BigNumberString;
          destinationAddress: EthereumAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.withdrawFunds(
            data.data.assetAddress,
            data.data.amount,
            data.data.destinationAddress,
          );
        }, data.callId);
      },

      getBalances: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getBalances();
        }, data.callId);
      },
      getLinks: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getLinks();
        }, data.callId);
      },
      getActiveLinks: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getActiveLinks();
        }, data.callId);
      },
      sendFunds: (
        data: IIFrameCallData<{
          counterPartyAccount: PublicIdentifier;
          amount: BigNumberString;
          expirationDate: UnixTimestamp;
          requiredStake: BigNumberString;
          paymentToken: EthereumAddress;
          gatewayUrl: GatewayUrl;
          metadata: string | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.sendFunds(
            data.data.counterPartyAccount,
            data.data.amount,
            data.data.expirationDate,
            data.data.requiredStake,
            data.data.paymentToken,
            data.data.gatewayUrl,
            data.data.metadata,
          );
        }, data.callId);
      },

      authorizeFunds: (
        data: IIFrameCallData<{
          counterPartyAccount: PublicIdentifier;
          totalAuthorized: BigNumberString;
          expirationDate: UnixTimestamp;
          deltaAmount: BigNumberString;
          deltaTime: number;
          requiredStake: BigNumberString;
          paymentToken: EthereumAddress;
          gatewayUrl: GatewayUrl;
          metadata: string | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.authorizeFunds(
            data.data.counterPartyAccount,
            data.data.totalAuthorized,
            data.data.expirationDate,
            data.data.deltaAmount,
            data.data.deltaTime,
            data.data.requiredStake,
            data.data.paymentToken,
            data.data.gatewayUrl,
            data.data.metadata,
          );
        }, data.callId);
      },

      acceptFunds: (data: IIFrameCallData<PaymentId[]>) => {
        this.returnForModel(() => {
          return this.core.acceptOffers(data.data);
        }, data.callId);
      },
      authorizeGateway: (data: IIFrameCallData<GatewayUrl>) => {
        this.returnForModel(() => {
          return this.core.authorizeGateway(data.data);
        }, data.callId);
      },
      deauthorizeGateway: (data: IIFrameCallData<GatewayUrl>) => {
        this.returnForModel(() => {
          return this.core.deauthorizeGateway(data.data);
        }, data.callId);
      },
      initiateDispute: (data: IIFrameCallData<PaymentId>) => {
        this.returnForModel(() => {
          return this.core.initiateDispute(data.data);
        }, data.callId);
      },
      closeGatewayIFrame: (data: IIFrameCallData<GatewayUrl>) => {
        this.core.closeGatewayIFrame(data.data);
      },
      displayGatewayIFrame: (data: IIFrameCallData<GatewayUrl>) => {
        this.core.displayGatewayIFrame(data.data);
      },

      //   pullFunds(paymentId: string, amount: BigNumber): Promise<Payment>;

      // finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink>;

      // finalizePushPayment(paymentId: string): Promise<void>;

      mintTestToken: (data: IIFrameCallData<BigNumberString>) => {
        this.returnForModel(() => {
          return this.core.mintTestToken(data.data);
        }, data.callId);
      },
      getAuthorizedGateways: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getAuthorizedGateways();
        }, data.callId);
      },
      getAuthorizedGatewaysConnectorsStatus: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getAuthorizedGatewaysConnectorsStatus();
        }, data.callId);
      },
      providePrivateCredentials: (
        data: IIFrameCallData<{
          privateKey: string | null;
          mnemonic: string | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.providePrivateCredentials(
            data.data.privateKey,
            data.data.mnemonic,
          );
        }, data.callId);
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {
    // We are going to just call waitInitialized() on the core, and emit an event
    // to the parent when it is initialized; combining a few functions.
    this.core.waitInitialized().map(() => {
      parent.emit("initialized");
    });

    // We are going to relay the RXJS events
    this.core.onControlClaimed.subscribe((val) => {
      parent.emit("onControlClaimed", val);
    });

    this.core.onControlYielded.subscribe((val) => {
      parent.emit("onControlYielded", val);
    });

    this.core.onPushPaymentSent.subscribe((val) => {
      parent.emit("onPushPaymentSent", val);
    });

    this.core.onPullPaymentSent.subscribe((val) => {
      parent.emit("onPullPaymentSent", val);
    });

    this.core.onPushPaymentUpdated.subscribe((val) => {
      parent.emit("onPushPaymentUpdated", val);
    });

    this.core.onPullPaymentUpdated.subscribe((val) => {
      parent.emit("onPullPaymentUpdated", val);
    });

    this.core.onPushPaymentReceived.subscribe((val) => {
      parent.emit("onPushPaymentReceived", val);
    });

    this.core.onPullPaymentReceived.subscribe((val) => {
      parent.emit("onPullPaymentReceived", val);
    });

    this.core.onPushPaymentDelayed.subscribe((val) => {
      parent.emit("onPushPaymentDelayed", val);
    });

    this.core.onPullPaymentDelayed.subscribe((val) => {
      parent.emit("onPullPaymentDelayed", val);
    });

    this.core.onBalancesChanged.subscribe((val) => {
      parent.emit("onBalancesChanged", val);
    });

    this.core.onDeStorageAuthenticationStarted.subscribe(() => {
      parent.emit("onDeStorageAuthenticationStarted");
    });

    this.core.onDeStorageAuthenticationSucceeded.subscribe(() => {
      parent.emit("onDeStorageAuthenticationSucceeded");
    });

    this.core.onDeStorageAuthenticationFailed.subscribe(() => {
      parent.emit("onDeStorageAuthenticationFailed");
    });

    this.core.onGatewayAuthorized.subscribe((val) => {
      parent.emit("onGatewayAuthorized", val.toString());
    });

    this.core.onGatewayDeauthorizationStarted.subscribe((val) => {
      parent.emit("onGatewayDeauthorizationStarted", val.toString());
    });

    this.core.onAuthorizedGatewayUpdated.subscribe((val) => {
      parent.emit("onAuthorizedGatewayUpdated", val.toString());
    });

    this.core.onAuthorizedGatewayActivationFailed.subscribe((val) => {
      parent.emit("onAuthorizedGatewayActivationFailed", val.toString());
    });

    this.core.onGatewayIFrameDisplayRequested.subscribe((gatewayUrl) => {
      parent.emit("onGatewayIFrameDisplayRequested", gatewayUrl);
    });

    this.core.onGatewayIFrameCloseRequested.subscribe((gatewayUrl) => {
      parent.emit("onGatewayIFrameCloseRequested", gatewayUrl);
    });

    this.core.onInitializationRequired.subscribe(() => {
      parent.emit("onInitializationRequired");
    });

    this.core.onPrivateCredentialsRequested.subscribe(() => {
      parent.emit("onPrivateCredentialsRequested");
    });

    this.core.onDeStorageAuthenticationStarted.subscribe(() => {
      this.coreUIService.renderDeStorageAuthenticationUI();
    });

    this.core.onDeStorageAuthenticationFailed.subscribe(() => {
      this.coreUIService.renderDeStorageAuthenticationFailedUI();
    });

    this.core.onDeStorageAuthenticationSucceeded.subscribe(() => {
      this.coreUIService.renderDeStorageAuthenticationSucceededUI();
    });
  }
}
