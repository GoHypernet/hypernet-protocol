import { ICoreListener } from "@core-iframe/interfaces/api";
import {
  ICoreUIService,
  ICoreUIServiceType,
} from "@core-iframe/interfaces/business";
import {
  EthereumAddress,
  IHypernetCore,
  IHypernetCoreType,
  PaymentId,
  GatewayUrl,
  BigNumberString,
  ChainId,
  PublicIdentifier,
  GatewayRegistrationFilter,
  EProposalVoteSupport,
  RegistryParams,
} from "@hypernetlabs/objects";
import { IIFrameCallData, ChildProxy } from "@hypernetlabs/utils";
import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import Postmate from "postmate";

@injectable()
export class CoreListener extends ChildProxy implements ICoreListener {
  constructor(
    @inject(IHypernetCoreType) protected core: IHypernetCore,
    @inject(ICoreUIServiceType) protected coreUIService: ICoreUIService,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model, and wrap up the core as the model
    return new Postmate.Model({
      initialize: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.initialize();
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
      getActiveStateChannels: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getActiveStateChannels();
        }, data.callId);
      },
      createStateChannel: (
        data: IIFrameCallData<{
          routerPublicIdentifiers: PublicIdentifier[];
          chainId: ChainId;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.createStateChannel(
            data.data.routerPublicIdentifiers,
            data.data.chainId,
          );
        }, data.callId);
      },
      depositFunds: (
        data: IIFrameCallData<{
          channelAddress: EthereumAddress;
          assetAddress: EthereumAddress;
          amount: BigNumberString;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.depositFunds(
            data.data.channelAddress,
            data.data.assetAddress,
            data.data.amount,
          );
        }, data.callId);
      },

      withdrawFunds: (
        data: IIFrameCallData<{
          channelAddress: EthereumAddress;
          assetAddress: EthereumAddress;
          amount: BigNumberString;
          destinationAddress: EthereumAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.withdrawFunds(
            data.data.channelAddress,
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
      acceptFunds: (data: IIFrameCallData<PaymentId>) => {
        this.returnForModel(() => {
          return this.core.acceptOffer(data.data);
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
      getGatewayTokenInfo: (data: IIFrameCallData<GatewayUrl[]>) => {
        this.returnForModel(() => {
          return this.core.getGatewayTokenInfo(data.data);
        }, data.callId);
      },
      getGatewayRegistrationInfo: (
        data: IIFrameCallData<GatewayRegistrationFilter>,
      ) => {
        this.returnForModel(() => {
          return this.core.getGatewayRegistrationInfo(data.data);
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
      getProposals: (
        data: IIFrameCallData<{
          pageNumber: number;
          pageSize: number;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getProposals(
            data.data.pageNumber,
            data.data.pageSize,
          );
        }, data.callId);
      },
      createProposal: (
        data: IIFrameCallData<{
          name: string;
          symbol: string;
          owner: EthereumAddress;
          enumerable: boolean;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.createProposal(
            data.data.name,
            data.data.symbol,
            data.data.owner,
            data.data.enumerable,
          );
        }, data.callId);
      },
      delegateVote: (
        data: IIFrameCallData<{
          delegateAddress: EthereumAddress;
          amount: number | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.delegateVote(
            data.data.delegateAddress,
            data.data.amount,
          );
        }, data.callId);
      },
      getProposalDetails: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.getProposalDetails(data.data);
        }, data.callId);
      },
      castVote: (
        data: IIFrameCallData<{
          proposalId: string;
          support: EProposalVoteSupport;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.castVote(data.data.proposalId, data.data.support);
        }, data.callId);
      },
      getProposalVotesReceipt: (
        data: IIFrameCallData<{
          proposalId: string;
          voterAddress: EthereumAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getProposalVotesReceipt(
            data.data.proposalId,
            data.data.voterAddress,
          );
        }, data.callId);
      },
      proposeRegistryEntry: (
        data: IIFrameCallData<{
          registryName: string;
          label: string;
          data: string;
          recipient: EthereumAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.proposeRegistryEntry(
            data.data.registryName,
            data.data.label,
            data.data.data,
            data.data.recipient,
          );
        }, data.callId);
      },
      getRegistries: (
        data: IIFrameCallData<{
          pageNumber: number;
          pageSize: number;
          reversedSorting: boolean;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getRegistries(
            data.data.pageNumber,
            data.data.pageSize,
            data.data.reversedSorting,
          );
        }, data.callId);
      },
      getRegistryByName: (data: IIFrameCallData<string[]>) => {
        this.returnForModel(() => {
          return this.core.getRegistryByName(data.data);
        }, data.callId);
      },
      getRegistryByAddress: (data: IIFrameCallData<EthereumAddress[]>) => {
        this.returnForModel(() => {
          return this.core.getRegistryByAddress(data.data);
        }, data.callId);
      },
      getRegistryEntriesTotalCount: (data: IIFrameCallData<string[]>) => {
        this.returnForModel(() => {
          return this.core.getRegistryEntriesTotalCount(data.data);
        }, data.callId);
      },
      getRegistryEntries: (
        data: IIFrameCallData<{
          registryName: string;
          pageNumber: number;
          pageSize: number;
          reversedSorting: boolean;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getRegistryEntries(
            data.data.registryName,
            data.data.pageNumber,
            data.data.pageSize,
            data.data.reversedSorting,
          );
        }, data.callId);
      },
      getRegistryEntryDetailByTokenId: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: number;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.getRegistryEntryDetailByTokenId(
            data.data.registryName,
            data.data.tokenId,
          );
        }, data.callId);
      },
      queueProposal: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.queueProposal(data.data);
        }, data.callId);
      },
      cancelProposal: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.cancelProposal(data.data);
        }, data.callId);
      },
      executeProposal: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.executeProposal(data.data);
        }, data.callId);
      },
      updateRegistryEntryTokenURI: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: number;
          registrationData: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.updateRegistryEntryTokenURI(
            data.data.registryName,
            data.data.tokenId,
            data.data.registrationData,
          );
        }, data.callId);
      },
      updateRegistryEntryLabel: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: number;
          label: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.updateRegistryEntryLabel(
            data.data.registryName,
            data.data.tokenId,
            data.data.label,
          );
        }, data.callId);
      },
      getProposalsCount: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getProposalsCount();
        }, data.callId);
      },
      getProposalThreshold: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getProposalThreshold();
        }, data.callId);
      },
      getVotingPower: (data: IIFrameCallData<EthereumAddress>) => {
        this.returnForModel(() => {
          return this.core.getVotingPower(data.data);
        }, data.callId);
      },
      getHyperTokenBalance: (data: IIFrameCallData<EthereumAddress>) => {
        this.returnForModel(() => {
          return this.core.getHyperTokenBalance(data.data);
        }, data.callId);
      },
      getNumberOfRegistries: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getNumberOfRegistries();
        }, data.callId);
      },
      updateRegistryParams: (data: IIFrameCallData<RegistryParams>) => {
        this.returnForModel(() => {
          return this.core.updateRegistryParams(data.data);
        }, data.callId);
      },
      createRegistryEntry: (
        data: IIFrameCallData<{
          registryName: string;
          label: string;
          recipientAddress: EthereumAddress;
          data: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.createRegistryEntry(
            data.data.registryName,
            data.data.label,
            data.data.recipientAddress,
            data.data.data,
          );
        }, data.callId);
      },
      transferRegistryEntry: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: number;
          transferToAddress: EthereumAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.transferRegistryEntry(
            data.data.registryName,
            data.data.tokenId,
            data.data.transferToAddress,
          );
        }, data.callId);
      },
      burnRegistryEntry: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: number;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.burnRegistryEntry(
            data.data.registryName,
            data.data.tokenId,
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
      console.log("Emitting onPushPaymentDelayed");
      parent.emit("onPushPaymentDelayed", val);
    });

    this.core.onPullPaymentDelayed.subscribe((val) => {
      parent.emit("onPullPaymentDelayed", val);
    });

    this.core.onBalancesChanged.subscribe((val) => {
      parent.emit("onBalancesChanged", val);
    });

    this.core.onCeramicAuthenticationStarted.subscribe(() => {
      parent.emit("onCeramicAuthenticationStarted");
    });

    this.core.onCeramicAuthenticationSucceeded.subscribe(() => {
      parent.emit("onCeramicAuthenticationSucceeded");
    });

    this.core.onCeramicFailed.subscribe((val) => {
      parent.emit("onCeramicFailed", val);
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

    this.core.onCoreIFrameDisplayRequested.subscribe(() => {
      console.log("in CoreListener, emiting onCoreIFrameDisplayRequested");
      parent.emit("onCoreIFrameDisplayRequested");
    });

    this.core.onCoreIFrameCloseRequested.subscribe(() => {
      parent.emit("onCoreIFrameCloseRequested");
    });

    this.core.onInitializationRequired.subscribe(() => {
      parent.emit("onInitializationRequired");
    });

    this.core.onPrivateCredentialsRequested.subscribe(() => {
      parent.emit("onPrivateCredentialsRequested");
    });

    this.core.onStateChannelCreated.subscribe((activeStateChannel) => {
      parent.emit("onStateChannelCreated", activeStateChannel);
    });

    this.core.onChainConnected.subscribe((chainId) => {
      parent.emit("onChainConnected", chainId);
    });

    this.core.onGovernanceChainConnected.subscribe((chainId) => {
      parent.emit("onGovernanceChainConnected", chainId);
    });
    this.core.onChainChanged.subscribe((chainId) => {
      parent.emit("onChainChanged", chainId);
    });

    this.core.onAccountChanged.subscribe((account) => {
      parent.emit("onAccountChanged", account);
    });

    this.core.onGovernanceChainChanged.subscribe((chainId) => {
      parent.emit("onGovernanceChainChanged", chainId);
    });

    this.core.onGovernanceAccountChanged.subscribe((account) => {
      parent.emit("onGovernanceAccountChanged", account);
    });

    this.core.onCeramicAuthenticationStarted.subscribe(() => {
      this.coreUIService.renderCeramicAuthenticationUI();
    });

    this.core.onCeramicFailed.subscribe((error) => {
      this.logUtils.error(
        error.message || "Something went wrong duting ceramic authentication!",
      );
      //this.coreUIService.renderCeramicFailureUI();
    });

    this.core.onCeramicAuthenticationSucceeded.subscribe(() => {
      this.coreUIService.renderCeramicAuthenticationSucceededUI();
    });
  }
}
