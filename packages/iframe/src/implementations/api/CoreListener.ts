import {
  EthereumAddress,
  PublicIdentifier,
  IHypernetCore,
  IHypernetCoreType,
  PaymentId,
  MerchantUrl,
} from "@hypernetlabs/objects";
import { IIFrameCallData, ChildProxy } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { injectable, inject } from "inversify";
import Postmate from "postmate";

import { ICoreListener } from "@core-iframe/interfaces/api";
import {
  ICoreUIService,
  ICoreUIServiceType,
} from "@core-iframe/interfaces/business";

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
          amount: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.depositFunds(
            data.data.assetAddress,
            BigNumber.from(data.data.amount),
          );
        }, data.callId);
      },

      withdrawFunds: (
        data: IIFrameCallData<{
          assetAddress: EthereumAddress;
          amount: string;
          destinationAddress: EthereumAddress;
        }>,
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
            BigNumber.from(data.data.amount),
            data.data.expirationDate,
            BigNumber.from(data.data.requiredStake),
            data.data.paymentToken,
            data.data.merchantUrl,
          );
        }, data.callId);
      },

      authorizeFunds: (
        data: IIFrameCallData<{
          counterPartyAccount: PublicIdentifier;
          totalAuthorized: string;
          expirationDate: number;
          deltaAmount: string;
          deltaTime: number;
          requiredStake: string;
          paymentToken: EthereumAddress;
          merchantUrl: MerchantUrl;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.authorizeFunds(
            data.data.counterPartyAccount,
            BigNumber.from(data.data.totalAuthorized),
            data.data.expirationDate,
            BigNumber.from(data.data.deltaAmount),
            data.data.deltaTime,
            BigNumber.from(data.data.requiredStake),
            data.data.paymentToken,
            data.data.merchantUrl,
          );
        }, data.callId);
      },

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
      deauthorizeMerchant: (data: IIFrameCallData<MerchantUrl>) => {
        this.returnForModel(() => {
          return this.core.deauthorizeMerchant(data.data);
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
      getAuthorizedMerchants: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getAuthorizedMerchants();
        }, data.callId);
      },
      getAuthorizedMerchantsConnectorsStatus: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getAuthorizedMerchantsConnectorsStatus();
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
      setPreferredPaymentToken: (data: IIFrameCallData<EthereumAddress>) => {
        this.returnForModel(() => {
          return this.core.setPreferredPaymentToken(data.data);
        }, data.callId);
      },
      getPreferredPaymentToken: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getPreferredPaymentToken();
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