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
import { ContextProvider } from "./utilities/ContextProvider";
import { IAccountsRepository } from "@interfaces/data/IAccountsRepository";
import { AccountsRepository } from "./data/AccountsRepository";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";

export class HypernetCore implements IHypernetCore {
  protected web3Provider: IWeb3Provider;
  protected configProvider: IConfigProvider;
  protected contextProvider: IContextProvider;
  protected boxUtils: IThreeBoxUtils;
  protected channelClientProvider: IChannelClientProvider;

  protected stateChannelRepository: IStateChannelRepository;
  protected persistenceRepository: IPersistenceRepository;
  protected messagingRepository: IMessagingRepository;
  protected accountRepository: IAccountsRepository;

  protected linkService: ILinkService;
  protected messageService: IMessageService;

  protected stateChannelListener: IStateChannelListener;
  protected messagingListener: IMessagingListener;
  protected initialized: boolean;

  constructor() {
    this.initialized = false;
    this.web3Provider = new Web3Provider();
    this.configProvider = new ConfigProvider();
    this.contextProvider = new ContextProvider();
    this.boxUtils = new ThreeBoxUtils(this.web3Provider, this.contextProvider);
    this.channelClientProvider = new ChannelClientProvider();

    this.stateChannelRepository = new StateChannelsRepository(this.channelClientProvider);
    this.persistenceRepository = new ThreeBoxPersistenceRepository(this.boxUtils, this.configProvider);
    this.messagingRepository = new ThreeBoxMessagingRepository(this.boxUtils);
    this.accountRepository = new AccountsRepository(this.web3Provider);

    this.linkService = new LinkService(
      this.stateChannelRepository,
      this.persistenceRepository,
      this.messagingRepository,
    );
    this.messageService = new MessageService(
      this.persistenceRepository,
      this.messagingRepository,
      this.stateChannelRepository,
    );

    this.stateChannelListener = new StateChannelListener(this.channelClientProvider, this.messageService);
    this.messagingListener = new ThreeBoxMessagingListener(
      this.linkService,
      this.messageService,
      this.boxUtils,
      this.configProvider,
    );
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
  ): Promise<import("../interfaces/objects").Withdrawal> {
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
    this.initialized = true;
  }
}
