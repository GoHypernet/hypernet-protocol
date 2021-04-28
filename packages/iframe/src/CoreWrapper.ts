import { EthereumAddress, PublicIdentifier, IHypernetCore, PaymentId, MerchantUrl } from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { IIFrameCallData, ChildProxy } from "@hypernetlabs/utils";
import Postmate from "postmate";

export default class CoreWrapper extends ChildProxy {
  constructor(protected core: IHypernetCore) {
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
      depositFunds: (data: IIFrameCallData<{ assetAddress: EthereumAddress; amount: string }>) => {
        this.returnForModel(() => {
          return this.core.depositFunds(data.data.assetAddress, BigNumber.from(data.data.amount));
        }, data.callId);
      },

      withdrawFunds: (
        data: IIFrameCallData<{ assetAddress: EthereumAddress; amount: string; destinationAddress: EthereumAddress }>,
      ) => {
        this.returnForModel(() => {
          return this.core.withdrawFunds(
            data.data.assetAddress,
            BigNumber.from(data.data.amount),
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
          amount: string;
          expirationDate: number;
          requiredStake: string;
          paymentToken: EthereumAddress;
          merchantUrl: MerchantUrl;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.sendFunds(
            data.data.counterPartyAccount,
            data.data.amount,
            data.data.expirationDate,
            data.data.requiredStake,
            data.data.paymentToken,
            data.data.merchantUrl,
          );
        }, data.callId);
      },
      //   authorizeFunds: (data: IIFrameCallData<{
      //     counterPartyAccount: PublicIdentifier,
      //     totalAuthorized: string,
      //     expirationDate: string,
      //     requiredStake: string,
      //     paymentToken: EthereumAddress,
      //     merchantUrl: string,
      //   }>) => {
      //     this.returnForModel(() => {
      //       return core.authorizeFunds(data.data.counterPartyAccount,
      //         BigNumber.from(data.data.totalAuthorized),
      //         moment(data.data.expirationDate),
      //         BigNumber.from(data.data.requiredStake),
      //         data.data.paymentToken,
      //         data.data.merchantUrl);
      //     }, data.callId);
      //   },

      acceptFunds: (data: IIFrameCallData<PaymentId[]>) => {
        this.returnForModel(() => {
          return this.core.acceptOffers(data.data);
        }, data.callId);
      },
      authorizeMerchant: (data: IIFrameCallData<MerchantUrl>) => {
        this.returnForModel(() => {
          return this.core.authorizeMerchant(data.data);
        }, data.callId);
      },
      initiateDispute: (data: IIFrameCallData<PaymentId>) => {
        this.returnForModel(() => {
          return this.core.initiateDispute(data.data);
        }, data.callId);
      },
      closeMerchantIFrame: (data: IIFrameCallData<MerchantUrl>) => {
        this.core.closeMerchantIFrame(data.data);
      },
      displayMerchantIFrame: (data: IIFrameCallData<MerchantUrl>) => {
        this.core.displayMerchantIFrame(data.data);
      },

      //   pullFunds(paymentId: string, amount: BigNumber): Promise<Payment>;

      // finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink>;

      // finalizePushPayment(paymentId: string): Promise<void>;

      mintTestToken: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.mintTestToken(BigNumber.from(data.data));
        }, data.callId);
      },
      getAuthorizedMerchants: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.getAuthorizedMerchants();
        }, data.callId);
      },
      providePrivateCredentials: (
        data: IIFrameCallData<{
          privateKey: string | null;
          mnemonic: string | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.providePrivateCredentials(data.data.privateKey, data.data.mnemonic);
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

    this.core.onMerchantAuthorized.subscribe((val) => {
      parent.emit("onMerchantAuthorized", val.toString());
    });

    this.core.onAuthorizedMerchantUpdated.subscribe((val) => {
      parent.emit("onAuthorizedMerchantUpdated", val.toString());
    });

    this.core.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      parent.emit("onAuthorizedMerchantActivationFailed", val.toString());
    });

    this.core.onMerchantIFrameDisplayRequested.subscribe((merchantUrl) => {
      parent.emit("onMerchantIFrameDisplayRequested", merchantUrl);
    });

    this.core.onMerchantIFrameCloseRequested.subscribe((merchantUrl) => {
      parent.emit("onMerchantIFrameCloseRequested", merchantUrl);
    });

    this.core.onInitializationRequired.subscribe(() => {
      parent.emit("onInitializationRequired");
    });

    this.core.onPrivateCredentialsRequested.subscribe(() => {
      parent.emit("onPrivateCredentialsRequested");
    });
  }
}
