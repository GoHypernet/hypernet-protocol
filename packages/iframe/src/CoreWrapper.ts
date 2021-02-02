import {
  BigNumber,
  EthereumAddress,
  IHypernetCore,
  PublicIdentifier,
  PublicKey,
  ResultAsync,
} from "@hypernetlabs/hypernet-core";
import { renderConnectorAuthenticatorScreen } from "@hypernetlabs/web-ui";
import moment from "moment";
import Postmate from "postmate";

interface IIFrameCallData<T> {
  callId: number;
  data: T;
}

class IFrameCallData<T> implements IIFrameCallData<T> {
  constructor(public callId: number, public data: T) {}
}

export default class CoreWrapper {
  protected parent: Postmate.ChildAPI | undefined;

  constructor(protected core: IHypernetCore) {
    // Fire up the Postmate model, and wrap up the core as the model
    const handshake = new Postmate.Model({
      initialize: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return core.initialize(data.data);
        }, data.callId);
      },
      waitInitialized: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return core.waitInitialized();
        }, data.callId);
      },
      getEthereumAccounts: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return core.getEthereumAccounts();
        }, data.callId);
      },
      getPublicIdentifier: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return core.getPublicIdentifier();
        }, data.callId);
      },
      depositFunds: (data: IIFrameCallData<{ assetAddress: string; amount: string }>) => {
        this.returnForModel(() => {
          return core.depositFunds(data.data.assetAddress, BigNumber.from(data.data.amount));
        }, data.callId);
      },

      withdrawFunds: (data: IIFrameCallData<{ assetAddress: string; amount: string; destinationAddress: string }>) => {
        this.returnForModel(() => {
          return core.withdrawFunds(
            data.data.assetAddress,
            BigNumber.from(data.data.amount),
            data.data.destinationAddress,
          );
        }, data.callId);
      },

      getBalances: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return core.getBalances();
        }, data.callId);
      },
      getLinks: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return core.getLinks();
        }, data.callId);
      },
      getActiveLinks: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return core.getActiveLinks();
        }, data.callId);
      },
      sendFunds: (
        data: IIFrameCallData<{
          counterPartyAccount: PublicIdentifier;
          amount: string;
          expirationDate: string;
          requiredStake: string;
          paymentToken: EthereumAddress;
          disputeMediator: PublicKey;
        }>,
      ) => {
        this.returnForModel(() => {
          return core.sendFunds(
            data.data.counterPartyAccount,
            data.data.amount,
            moment(data.data.expirationDate),
            data.data.requiredStake,
            data.data.paymentToken,
            data.data.disputeMediator,
          );
        }, data.callId);
      },
      //   authorizeFunds: (data: IIFrameCallData<{
      //     counterPartyAccount: PublicIdentifier,
      //     totalAuthorized: string,
      //     expirationDate: string,
      //     requiredStake: string,
      //     paymentToken: EthereumAddress,
      //     disputeMediator: PublicKey,
      //   }>) => {
      //     this.returnForModel(() => {
      //       return core.authorizeFunds(data.data.counterPartyAccount,
      //         BigNumber.from(data.data.totalAuthorized),
      //         moment(data.data.expirationDate),
      //         BigNumber.from(data.data.requiredStake),
      //         data.data.paymentToken,
      //         data.data.disputeMediator);
      //     }, data.callId);
      //   },

      acceptFunds: (data: IIFrameCallData<string[]>) => {
        this.returnForModel(() => {
          return core.acceptFunds(data.data);
        }, data.callId);
      },

      //   pullFunds(paymentId: string, amount: BigNumber): Promise<Payment>;

      // finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink>;

      // finalizePushPayment(paymentId: string): Promise<void>;

      // initiateDispute(paymentId: string, metadata: string): Promise<HypernetLink>;

      mintTestToken: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return core.mintTestToken(BigNumber.from(data.data));
        }, data.callId);
      },
      startConnectorFlow: (connector?: string) => {
        // get balances first then render modal with connect button
        // TODO: balances need viewModel class just like the one in web-integration store
        this.core.getBalances().map((balances) => {
          renderConnectorAuthenticatorScreen(connector, balances.assets, () => {
            // user clicked connect confirm button
            console.log("hello from callback");
          });
        });
      },
    });

    handshake.then((initializedParent) => {
      this.parent = initializedParent;

      // We are going to just call waitInitialized() on the core, and emit an event
      // to the parent when it is initialized; combining a few functions.
      this.core.waitInitialized().map(() => {
        this.parent?.emit("initialized");
      });

      // We are going to relay the RXJS events
      this.core.onControlClaimed.subscribe((val) => {
        this.parent?.emit("onControlClaimed", val);
      });

      this.core.onControlYielded.subscribe((val) => {
        this.parent?.emit("onControlYielded", val);
      });

      this.core.onPushPaymentProposed.subscribe((val) => {
        this.parent?.emit("onPushPaymentProposed", val);
      });

      this.core.onPullPaymentProposed.subscribe((val) => {
        this.parent?.emit("onPullPaymentProposed", val);
      });

      this.core.onPushPaymentUpdated.subscribe((val) => {
        this.parent?.emit("onPushPaymentUpdated", val);
      });

      this.core.onPullPaymentUpdated.subscribe((val) => {
        this.parent?.emit("onPullPaymentUpdated", val);
      });

      this.core.onPushPaymentReceived.subscribe((val) => {
        this.parent?.emit("onPushPaymentReceived", val);
      });

      this.core.onPullPaymentApproved.subscribe((val) => {
        this.parent?.emit("onPullPaymentApproved", val);
      });

      this.core.onBalancesChanged.subscribe((val) => {
        this.parent?.emit("onBalancesChanged", val);
      });
    });
  }

  protected returnForModel<T, E>(func: () => ResultAsync<T, E>, callId: number) {
    func().match(
      (result) => {
        if (this.parent != null) {
          this.parent.emit("callSuccess", new IFrameCallData(callId, result));
        }
      },
      (e) => {
        if (this.parent != null) {
          this.parent.emit("callError", new IFrameCallData(callId, e));
        }
      },
    );
  }
}
