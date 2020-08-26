import { IHypernetCore } from "@interfaces/IHypernetCore";
import { HypernetLink, Deposit, PullSettings, BigNumber } from "@interfaces/objects";
import { ThreeBoxUtils } from "./utilities/3BoxUtils";
import { Web3Provider } from "./utilities/Web3Provider";
import { ConfigProvider } from "./utilities/ConfigProvider";
import { ChannelClientProvider } from "./utilities/ChannelClientProvider";
import { StateChannelsRepository } from "./data/StateChannelsRepository";
import { ThreeBoxPersistenceRepository } from "./data/3BoxPersistenceRepository";
import { ThreeBoxMessagingRepository } from "./data/3BoxMessagingRepository";
import { LinkService } from "./business/LinkService";
import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { IStateChannelRepository, IPersistenceRepository, IMessagingRepository } from "@interfaces/data";
import { ILinkService } from "@interfaces/business/ILinkService";
import { IStateChannelListener } from "@interfaces/api/IStateChannelListener";
import { IMessagingListener } from "@interfaces/api/IMessagingListener";
import { StateChannelListener } from "./api/StateChannelListener";
import { ThreeBoxMessagingListener } from "./api/ThreeBoxMessagingListener";
import { MessageService } from "./business/MessageService";
import { IMessageService } from "@interfaces/business/IMessageService";

export class HypernetCore implements IHypernetCore {
  protected web3Provider: IWeb3Provider | undefined;
  protected configProvider: IConfigProvider | undefined;
  protected boxUtils: IThreeBoxUtils | undefined;
  protected channelClientProvider: IChannelClientProvider | undefined;

  protected stateChannelRepository: IStateChannelRepository | undefined;
  protected persistenceRepository: IPersistenceRepository | undefined;
  protected messagingRepository: IMessagingRepository | undefined;

  protected linkService: ILinkService | undefined;
  protected messageService: IMessageService | undefined;

  protected stateChannelListener: IStateChannelListener | undefined;
  protected messagingListener: IMessagingListener | undefined;
  protected initialized: boolean;

  constructor() {
    this.initialized= false;
  }
  getLinks(): Promise<HypernetLink[]> {
    throw new Error("Method not implemented.");
  }
  openHypernetLinks(consumerWallet: string, providerWallet: string, paymentToken: string, disputeMediator: string, pullSettings: PullSettings): Promise<HypernetLink> {
    throw new Error("Method not implemented.");
  }
  stakeIntoLink(linkId: string, amount: BigNumber): Promise<import("../interfaces/objects").Stake> {
    throw new Error("Method not implemented.");
  }
  depositIntoLink(linkId: string, amount: BigNumber): Promise<Deposit> {
    throw new Error("Method not implemented.");
  }
  sendFunds(linkId: string, amount: BigNumber): Promise<import("../interfaces/objects").Payment> {
    throw new Error("Method not implemented.");
  }
  pullFunds(linkId: string, amount: BigNumber): Promise<import("../interfaces/objects").Payment> {
    throw new Error("Method not implemented.");
  }
  withdrawFunds(linkId: string, amount: BigNumber, destinationAddress: string | null): Promise<import("../interfaces/objects").Withdrawal> {
    throw new Error("Method not implemented.");
  }
  closeHypernetLink(linkId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  withdrawStake(linkId: string, destinationAddress: string | null): Promise<import("../interfaces/objects").Stake> {
    throw new Error("Method not implemented.");
  }
  initiateDispute(linkId: string): Promise<import("../interfaces/objects").LinkFinalResult> {
    throw new Error("Method not implemented.");
  }
  closeLink(linkId: string): Promise<import("../interfaces/objects").LinkFinalResult> {
    throw new Error("Method not implemented.");
  }

  public async initialize(consumerWallet: string): Promise<void> {
    this.web3Provider = new Web3Provider();
    this.configProvider = new ConfigProvider();
    this.boxUtils = new ThreeBoxUtils(this.web3Provider);
    this.channelClientProvider = new ChannelClientProvider();

    this.stateChannelRepository = new StateChannelsRepository(this.channelClientProvider);
    this.persistenceRepository = new ThreeBoxPersistenceRepository(this.boxUtils, this.configProvider);
    this.messagingRepository = new ThreeBoxMessagingRepository(this.boxUtils);

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
    this.messagingListener = new ThreeBoxMessagingListener(this.linkService, this.messageService, this.boxUtils, this.configProvider);

    this.initialized = true;
  }
}
