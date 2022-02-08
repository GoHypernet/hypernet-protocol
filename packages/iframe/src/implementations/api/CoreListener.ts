import { ICoreListener } from "@core-iframe/interfaces/api";
import {
  ICoreUIService,
  ICoreUIServiceType,
} from "@core-iframe/interfaces/business";
import {
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
  ERegistrySortOrder,
  EthereumContractAddress,
  EthereumAccountAddress,
  RegistryTokenId,
  ProviderId,
  RegistryEntry,
  LazyMintingSignature,
  IpfsCID,
} from "@hypernetlabs/objects";
import {
  IIFrameCallData,
  ChildProxy,
  ILogUtils,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import Postmate from "postmate";

@injectable()
export class CoreListener extends ChildProxy implements ICoreListener {
  constructor(
    @inject(IHypernetCoreType) protected core: IHypernetCore,
    @inject(ICoreUIServiceType) protected coreUIService: ICoreUIService,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    protected defaultGovernanceChainId: ChainId,
  ) {
    super();
  }

  protected getModel(): Postmate.Model {
    // Fire up the Postmate model, and wrap up the core as the model
    return new Postmate.Model({
      initialize: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.initialize(data.data);
        }, data.callId);
      },
      initializeRegistries: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.registries.initializeRegistries(data.data);
        }, data.callId);
      },
      initializeGovernance: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.governance.initializeGovernance(data.data);
        }, data.callId);
      },
      initializePayments: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.payments.initializePayments(data.data);
        }, data.callId);
      },
      getInitializationStatus: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getInitializationStatus();
        }, data.callId);
      },
      waitInitialized: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.waitInitialized();
        }, data.callId);
      },
      waitRegistriesInitialized: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.registries.waitRegistriesInitialized(data.data);
        }, data.callId);
      },
      waitGovernanceInitialized: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.governance.waitGovernanceInitialized(data.data);
        }, data.callId);
      },
      waitPaymentsInitialized: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.payments.waitPaymentsInitialized(data.data);
        }, data.callId);
      },
      getEthereumAccounts: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getEthereumAccounts();
        }, data.callId);
      },
      getPublicIdentifier: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getPublicIdentifier();
        }, data.callId);
      },
      getActiveStateChannels: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getActiveStateChannels();
        }, data.callId);
      },
      createStateChannel: (
        data: IIFrameCallData<{
          routerPublicIdentifiers: PublicIdentifier[];
          chainId: ChainId;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.payments.createStateChannel(
            data.data.routerPublicIdentifiers,
            data.data.chainId,
          );
        }, data.callId);
      },
      depositFunds: (
        data: IIFrameCallData<{
          channelAddress: EthereumContractAddress;
          assetAddress: EthereumContractAddress;
          amount: BigNumberString;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.payments.depositFunds(
            data.data.channelAddress,
            data.data.assetAddress,
            data.data.amount,
          );
        }, data.callId);
      },

      withdrawFunds: (
        data: IIFrameCallData<{
          channelAddress: EthereumContractAddress;
          assetAddress: EthereumContractAddress;
          amount: BigNumberString;
          destinationAddress: EthereumAccountAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.payments.withdrawFunds(
            data.data.channelAddress,
            data.data.assetAddress,
            data.data.amount,
            data.data.destinationAddress,
          );
        }, data.callId);
      },

      getBalances: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getBalances();
        }, data.callId);
      },
      getLinks: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getLinks();
        }, data.callId);
      },
      getActiveLinks: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getActiveLinks();
        }, data.callId);
      },
      acceptFunds: (data: IIFrameCallData<PaymentId>) => {
        this.returnForModel(() => {
          return this.core.payments.acceptOffer(data.data);
        }, data.callId);
      },
      repairPayments: (data: IIFrameCallData<PaymentId[]>) => {
        this.returnForModel(() => {
          return this.core.payments.repairPayments(data.data);
        }, data.callId);
      },
      authorizeGateway: (data: IIFrameCallData<GatewayUrl>) => {
        this.returnForModel(() => {
          return this.core.payments.authorizeGateway(data.data);
        }, data.callId);
      },
      deauthorizeGateway: (data: IIFrameCallData<GatewayUrl>) => {
        this.returnForModel(() => {
          return this.core.payments.deauthorizeGateway(data.data);
        }, data.callId);
      },
      closeGatewayIFrame: (data: IIFrameCallData<GatewayUrl>) => {
        this.core.payments.closeGatewayIFrame(data.data);
      },
      displayGatewayIFrame: (data: IIFrameCallData<GatewayUrl>) => {
        this.core.payments.displayGatewayIFrame(data.data);
      },

      //   pullFunds(paymentId: string, amount: BigNumber): Promise<Payment>;

      // finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink>;

      // finalizePushPayment(paymentId: string): Promise<void>;

      mintTestToken: (data: IIFrameCallData<BigNumberString>) => {
        this.returnForModel(() => {
          return this.core.payments.mintTestToken(data.data);
        }, data.callId);
      },
      getAuthorizedGateways: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getAuthorizedGateways();
        }, data.callId);
      },
      getAuthorizedGatewaysConnectorsStatus: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getAuthorizedGatewaysConnectorsStatus();
        }, data.callId);
      },
      getGatewayTokenInfo: (data: IIFrameCallData<GatewayUrl[]>) => {
        this.returnForModel(() => {
          return this.core.payments.getGatewayTokenInfo(data.data);
        }, data.callId);
      },
      getGatewayRegistrationInfo: (
        data: IIFrameCallData<GatewayRegistrationFilter>,
      ) => {
        this.returnForModel(() => {
          return this.core.payments.getGatewayRegistrationInfo(data.data);
        }, data.callId);
      },
      getGatewayEntryList: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getGatewayEntryList();
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
          return this.core.governance.getProposals(
            data.data.pageNumber,
            data.data.pageSize,
          );
        }, data.callId);
      },
      createProposal: (
        data: IIFrameCallData<{
          name: string;
          symbol: string;
          owner: EthereumAccountAddress;
          enumerable: boolean;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.governance.createProposal(
            data.data.name,
            data.data.symbol,
            data.data.owner,
            data.data.enumerable,
          );
        }, data.callId);
      },
      delegateVote: (
        data: IIFrameCallData<{
          delegateAddress: EthereumAccountAddress;
          amount: number | null;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.governance.delegateVote(
            data.data.delegateAddress,
            data.data.amount,
          );
        }, data.callId);
      },
      getProposalDetails: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.governance.getProposalDetails(data.data);
        }, data.callId);
      },
      getProposalDescription: (data: IIFrameCallData<IpfsCID>) => {
        this.returnForModel(() => {
          return this.core.governance.getProposalDescription(data.data);
        }, data.callId);
      },
      castVote: (
        data: IIFrameCallData<{
          proposalId: string;
          support: EProposalVoteSupport;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.governance.castVote(
            data.data.proposalId,
            data.data.support,
          );
        }, data.callId);
      },
      getProposalVotesReceipt: (
        data: IIFrameCallData<{
          proposalId: string;
          voterAddress: EthereumAccountAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.governance.getProposalVotesReceipt(
            data.data.proposalId,
            data.data.voterAddress,
          );
        }, data.callId);
      },
      getRegistries: (
        data: IIFrameCallData<{
          pageNumber: number;
          pageSize: number;
          sortOrder: ERegistrySortOrder;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistries(
            data.data.pageNumber,
            data.data.pageSize,
            data.data.sortOrder,
          );
        }, data.callId);
      },
      getRegistryByName: (data: IIFrameCallData<string[]>) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryByName(data.data);
        }, data.callId);
      },
      getRegistryByAddress: (
        data: IIFrameCallData<EthereumContractAddress[]>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryByAddress(data.data);
        }, data.callId);
      },
      getRegistryEntriesTotalCount: (data: IIFrameCallData<string[]>) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryEntriesTotalCount(data.data);
        }, data.callId);
      },
      getRegistryEntries: (
        data: IIFrameCallData<{
          registryName: string;
          pageNumber: number;
          pageSize: number;
          sortOrder: ERegistrySortOrder;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryEntries(
            data.data.registryName,
            data.data.pageNumber,
            data.data.pageSize,
            data.data.sortOrder,
          );
        }, data.callId);
      },
      getRegistryEntryDetailByTokenId: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: RegistryTokenId;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryEntryDetailByTokenId(
            data.data.registryName,
            data.data.tokenId,
          );
        }, data.callId);
      },
      queueProposal: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.governance.queueProposal(data.data);
        }, data.callId);
      },
      cancelProposal: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.governance.cancelProposal(data.data);
        }, data.callId);
      },
      executeProposal: (data: IIFrameCallData<string>) => {
        this.returnForModel(() => {
          return this.core.governance.executeProposal(data.data);
        }, data.callId);
      },
      updateRegistryEntryTokenURI: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: RegistryTokenId;
          registrationData: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.updateRegistryEntryTokenURI(
            data.data.registryName,
            data.data.tokenId,
            data.data.registrationData,
          );
        }, data.callId);
      },
      updateRegistryEntryLabel: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: RegistryTokenId;
          label: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.updateRegistryEntryLabel(
            data.data.registryName,
            data.data.tokenId,
            data.data.label,
          );
        }, data.callId);
      },
      getProposalsCount: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.governance.getProposalsCount();
        }, data.callId);
      },
      getProposalThreshold: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.governance.getProposalThreshold();
        }, data.callId);
      },
      getVotingPower: (data: IIFrameCallData<EthereumAccountAddress>) => {
        this.returnForModel(() => {
          return this.core.governance.getVotingPower(data.data);
        }, data.callId);
      },
      getHyperTokenBalance: (data: IIFrameCallData<EthereumAccountAddress>) => {
        this.returnForModel(() => {
          return this.core.governance.getHyperTokenBalance(data.data);
        }, data.callId);
      },
      getNumberOfRegistries: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.registries.getNumberOfRegistries();
        }, data.callId);
      },
      updateRegistryParams: (data: IIFrameCallData<RegistryParams>) => {
        this.returnForModel(() => {
          return this.core.registries.updateRegistryParams(data.data);
        }, data.callId);
      },
      createRegistryEntry: (
        data: IIFrameCallData<{
          registryName: string;
          newRegistryEntry: RegistryEntry;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.createRegistryEntry(
            data.data.registryName,
            data.data.newRegistryEntry,
          );
        }, data.callId);
      },
      transferRegistryEntry: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: RegistryTokenId;
          transferToAddress: EthereumAccountAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.transferRegistryEntry(
            data.data.registryName,
            data.data.tokenId,
            data.data.transferToAddress,
          );
        }, data.callId);
      },
      burnRegistryEntry: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: RegistryTokenId;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.burnRegistryEntry(
            data.data.registryName,
            data.data.tokenId,
          );
        }, data.callId);
      },
      createRegistryByToken: (
        data: IIFrameCallData<{
          name: string;
          symbol: string;
          registrarAddress: EthereumAccountAddress;
          enumerable: boolean;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.createRegistryByToken(
            data.data.name,
            data.data.symbol,
            data.data.registrarAddress,
            data.data.enumerable,
          );
        }, data.callId);
      },
      grantRegistrarRole: (
        data: IIFrameCallData<{
          registryName: string;
          address: EthereumAccountAddress | EthereumContractAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.grantRegistrarRole(
            data.data.registryName,
            data.data.address,
          );
        }, data.callId);
      },
      revokeRegistrarRole: (
        data: IIFrameCallData<{
          registryName: string;
          address: EthereumAccountAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.revokeRegistrarRole(
            data.data.registryName,
            data.data.address,
          );
        }, data.callId);
      },
      renounceRegistrarRole: (
        data: IIFrameCallData<{
          registryName: string;
          address: EthereumAccountAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.renounceRegistrarRole(
            data.data.registryName,
            data.data.address,
          );
        }, data.callId);
      },
      provideProviderId: (data: IIFrameCallData<ProviderId>) => {
        this.returnForModel(() => {
          return this.core.provideProviderId(data.data);
        }, data.callId);
      },
      rejectProviderIdRequest: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.rejectProviderIdRequest();
        }, data.callId);
      },
      getTokenInformation: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.payments.getTokenInformation();
        }, data.callId);
      },
      getTokenInformationForChain: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.payments.getTokenInformationForChain(data.data);
        }, data.callId);
      },
      getTokenInformationByAddress: (
        data: IIFrameCallData<EthereumContractAddress>,
      ) => {
        this.returnForModel(() => {
          return this.core.payments.getTokenInformationByAddress(data.data);
        }, data.callId);
      },
      getRegistryEntryByOwnerAddress: (
        data: IIFrameCallData<{
          registryName: string;
          ownerAddress: EthereumAccountAddress;
          index: number;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryEntryByOwnerAddress(
            data.data.registryName,
            data.data.ownerAddress,
            data.data.index,
          );
        }, data.callId);
      },
      getRegistryModules: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryModules();
        }, data.callId);
      },
      createBatchRegistryEntry: (
        data: IIFrameCallData<{
          registryName: string;
          newRegistryEntries: RegistryEntry[];
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.createBatchRegistryEntry(
            data.data.registryName,
            data.data.newRegistryEntries,
          );
        }, data.callId);
      },
      getRegistryEntryListByOwnerAddress: (
        data: IIFrameCallData<{
          registryName: string;
          ownerAddress: EthereumAccountAddress;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryEntryListByOwnerAddress(
            data.data.registryName,
            data.data.ownerAddress,
          );
        }, data.callId);
      },
      getBlockNumber: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getBlockNumber();
        }, data.callId);
      },
      getRegistryEntryListByUsername: (
        data: IIFrameCallData<{
          registryName: string;
          username: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.getRegistryEntryListByUsername(
            data.data.registryName,
            data.data.username,
          );
        }, data.callId);
      },
      submitLazyMintSignature: (
        data: IIFrameCallData<{
          registryName: string;
          tokenId: RegistryTokenId;
          ownerAddress: EthereumAccountAddress;
          registrationData: string;
        }>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.submitLazyMintSignature(
            data.data.registryName,
            data.data.tokenId,
            data.data.ownerAddress,
            data.data.registrationData,
          );
        }, data.callId);
      },
      retrieveLazyMintingSignatures: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.registries.retrieveLazyMintingSignatures();
        }, data.callId);
      },
      executeLazyMint: (data: IIFrameCallData<LazyMintingSignature>) => {
        this.returnForModel(() => {
          return this.core.registries.executeLazyMint(data.data);
        }, data.callId);
      },
      revokeLazyMintSignature: (
        data: IIFrameCallData<LazyMintingSignature>,
      ) => {
        this.returnForModel(() => {
          return this.core.registries.revokeLazyMintSignature(data.data);
        }, data.callId);
      },
      retrieveChainInformationList: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.retrieveChainInformationList();
        }, data.callId);
      },
      retrieveGovernanceChainInformation: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.retrieveGovernanceChainInformation();
        }, data.callId);
      },
      initializeForChainId: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.initializeForChainId(data.data);
        }, data.callId);
      },
      switchProviderNetwork: (data: IIFrameCallData<ChainId>) => {
        this.returnForModel(() => {
          return this.core.switchProviderNetwork(data.data);
        }, data.callId);
      },
      getMainProviderChainId: (data: IIFrameCallData<void>) => {
        this.returnForModel(() => {
          return this.core.getMainProviderChainId();
        }, data.callId);
      },
    });
  }

  protected onModelActivated(parent: Postmate.ChildAPI): void {
    // We are going to just call waitInitialized() on the core, and emit an event
    // to the parent when it is initialized; combining a few functions.
    this.core.waitInitialized(this.defaultGovernanceChainId).map(() => {
      parent.emit("initialized", this.defaultGovernanceChainId);
    });

    this.core.registries
      .waitRegistriesInitialized(this.defaultGovernanceChainId)
      .map(() => {
        parent.emit("registriesInitialized", this.defaultGovernanceChainId);
      });

    this.core.governance
      .waitGovernanceInitialized(this.defaultGovernanceChainId)
      .map(() => {
        parent.emit("governanceInitialized", this.defaultGovernanceChainId);
      });

    this.core.payments
      .waitPaymentsInitialized(this.defaultGovernanceChainId)
      .map(() => {
        parent.emit("paymentsInitialized", this.defaultGovernanceChainId);
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

    this.core.onWalletConnectOptionsDisplayRequested.subscribe(() => {
      console.log(
        "in CoreListener, emiting onWalletConnectOptionsDisplayRequested",
      );
      parent.emit("onWalletConnectOptionsDisplayRequested");
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
      this.logUtils.info("Ceramic authentication started!");
      //this.coreUIService.renderCeramicAuthenticationUI();
    });

    this.core.onCeramicFailed.subscribe((error) => {
      this.logUtils.error(
        error.message || "Something went wrong duting ceramic authentication!",
      );
      //this.coreUIService.renderCeramicFailureUI();
    });

    this.core.onCeramicAuthenticationSucceeded.subscribe(() => {
      this.logUtils.info("Ceramic authentication succeeded!");
      //this.coreUIService.renderCeramicAuthenticationSucceededUI();
    });

    this.core.onGovernanceSignerUnavailable.subscribe((error) => {
      parent.emit("onGovernanceSignerUnavailable", error);
    });
  }
}
