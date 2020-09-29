import { IHypernetCore } from "@interfaces/IHypernetCore";
import {
  HypernetLink,
  Deposit,
  PullSettings,
  BigNumber,
  Stake,
  Payment,
  LinkFinalResult,
  EthereumAddress,
  PublicKey,
  EstablishLinkRequest,
  EstablishLinkRequestWithApproval,
  Withdrawal,
  ControlClaim,
  HypernetConfig,
} from "@interfaces/objects";
import { ThreeBoxUtils } from "@implementations/utilities/3BoxUtils";
import { Web3Provider } from "@implementations/utilities/Web3Provider";
import { ConfigProvider } from "@implementations/utilities/ConfigProvider";
import { ChannelClientProvider } from "@implementations/utilities/ChannelClientProvider";
import { StateChannelsRepository } from "@implementations/data/StateChannelsRepository";
import { ThreeBoxPersistenceRepository } from "@implementations/data/3BoxPersistenceRepository";
import { ThreeBoxMessagingRepository } from "@implementations/data/3BoxMessagingRepository";
import { LinkService } from "@implementations/business/LinkService";
import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { IStateChannelRepository, IPersistenceRepository, IMessagingRepository } from "@interfaces/data";
import { ILinkService } from "@interfaces/business/ILinkService";
import { IStateChannelListener } from "@interfaces/api/IStateChannelListener";
import { IMessagingListener } from "@interfaces/api/IMessagingListener";
import { StateChannelListener } from "@implementations/api/StateChannelListener";
import { ThreeBoxMessagingListener } from "@implementations/api/ThreeBoxMessagingListener";
import { MessageService } from "@implementations/business/MessageService";
import { IMessageService } from "@interfaces/business/IMessageService";
import { ContextProvider } from "@implementations/utilities/ContextProvider";
import { IAccountsRepository } from "@interfaces/data/IAccountsRepository";
import { AccountsRepository } from "@implementations/data/AccountsRepository";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";
import { LinkUtils } from "@implementations/utilities/LinkUtils";
import { Subject } from "rxjs";
import { ControlService } from "@implementations/business/ControlService";
import { IControlService } from "@interfaces/business/IControlService";

export class HypernetCore implements IHypernetCore {
  public onLinkUpdated: Subject<HypernetLink>;
  public onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>;
  public onLinkRejected: Subject<EstablishLinkRequest>;
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;

  protected web3Provider: IWeb3Provider;
  protected configProvider: IConfigProvider;
  protected contextProvider: IContextProvider;
  protected boxUtils: IThreeBoxUtils;
  protected channelClientProvider: IChannelClientProvider;
  protected linkUtils: ILinkUtils;

  protected stateChannelRepository: IStateChannelRepository;
  protected persistenceRepository: IPersistenceRepository;
  protected messagingRepository: IMessagingRepository;
  protected accountRepository: IAccountsRepository;

  protected linkService: ILinkService;
  protected messageService: IMessageService;
  protected controlService: IControlService;

  protected stateChannelListener: IStateChannelListener;
  protected messagingListener: IMessagingListener;
  protected _initialized: boolean;
  protected _inControl: boolean;

  constructor(config?: HypernetConfig) {
    this._initialized = false;
    this._inControl = false;

    this.onLinkUpdated = new Subject<HypernetLink>();
    this.onLinkRequestReceived = new Subject<EstablishLinkRequestWithApproval>();
    this.onLinkRejected = new Subject<EstablishLinkRequest>();
    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();

    this.onControlClaimed.subscribe({
      next: () => {
        this._inControl = true;
      },
    });

    this.onControlYielded.subscribe({
      next: () => {
        this._inControl = false;
      },
    });

    this.web3Provider = new Web3Provider();
    this.configProvider = new ConfigProvider(config);
    this.contextProvider = new ContextProvider(
      this.onLinkUpdated,
      this.onLinkRequestReceived,
      this.onLinkRejected,
      this.onControlClaimed,
      this.onControlYielded,
    );
    this.boxUtils = new ThreeBoxUtils(this.web3Provider, this.contextProvider, this.configProvider);
    this.channelClientProvider = new ChannelClientProvider();
    this.linkUtils = new LinkUtils();

    this.stateChannelRepository = new StateChannelsRepository(this.channelClientProvider, this.configProvider);
    this.persistenceRepository = new ThreeBoxPersistenceRepository(this.boxUtils, this.configProvider);
    this.messagingRepository = new ThreeBoxMessagingRepository(
      this.boxUtils,
      this.contextProvider,
      this.configProvider,
    );
    this.accountRepository = new AccountsRepository(this.web3Provider);

    this.linkService = new LinkService(
      this.stateChannelRepository,
      this.persistenceRepository,
      this.messagingRepository,
      this.contextProvider,
      this.linkUtils,
    );
    this.messageService = new MessageService(
      this.persistenceRepository,
      this.messagingRepository,
      this.stateChannelRepository,
      this.contextProvider,
    );
    this.controlService = new ControlService(this.messagingRepository, this.contextProvider);

    this.stateChannelListener = new StateChannelListener(this.channelClientProvider, this.messageService);
    this.messagingListener = new ThreeBoxMessagingListener(
      this.linkService,
      this.messageService,
      this.controlService,
      this.boxUtils,
      this.configProvider,
      this.contextProvider,
    );
  }

  public initialized(): boolean {
    return this._initialized;
  }
  public inControl(): boolean {
    return this._inControl;
  }

  public async getAccounts(): Promise<string[]> {
    return this.accountRepository.getAccounts();
  }

  public async getLinks(): Promise<HypernetLink[]> {
    return this.linkService.getActiveLinks();
  }
  public async openLink(
    consumerWallet: EthereumAddress,
    providerWallet: EthereumAddress,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink> {
    return this.linkService.openLink(consumerWallet, providerWallet, paymentToken, disputeMediator, pullSettings);
  }
  public async stakeIntoLink(linkId: string, amount: BigNumber): Promise<Stake> {
    throw new Error("Method not implemented.");
  }
  public async depositIntoLink(linkId: string, amount: BigNumber): Promise<Deposit> {
    throw new Error("Method not implemented.");
  }
  public async sendFunds(linkId: string, amount: BigNumber): Promise<Payment> {
    throw new Error("Method not implemented.");
  }
  public async pullFunds(linkId: string, amount: BigNumber): Promise<Payment> {
    throw new Error("Method not implemented.");
  }
  public async withdrawFunds(
    linkId: string,
    amount: BigNumber,
    destinationAddress: string | null,
  ): Promise<Withdrawal> {
    throw new Error("Method not implemented.");
  }
  public async withdrawStake(linkId: string, destinationAddress: string | null): Promise<Stake> {
    throw new Error("Method not implemented.");
  }
  public async initiateDispute(linkId: string): Promise<LinkFinalResult> {
    throw new Error("Method not implemented.");
  }
  public async closeLink(linkId: string): Promise<LinkFinalResult> {
    throw new Error("Method not implemented.");
  }

  public async initialize(account: string): Promise<void> {
    const context = await this.contextProvider.getContext();
    context.account = account;
    await this.contextProvider.setContext(context);
    await this.messagingListener.initialize();
    await this.stateChannelListener.initialize();
    await this.stateChannelRepository.initialize();

    // This should always be the last thing we do, after everything else is initialized
    await this.controlService.claimControl();

    // Set the status bit
    this._initialized = true;
  }

  // DEBUG ONLY
  public async clearLinks(): Promise<void> {
    await this.linkService.clearLinks();
  }
}
