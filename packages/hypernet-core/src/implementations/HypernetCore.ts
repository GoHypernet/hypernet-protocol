import { IHypernetCore } from "@interfaces/IHypernetCore";
import { HypernetChannel, Deposit } from "@interfaces/objects";
import { ThreeBoxUtils } from "./utilities/3BoxUtils";
import { Web3Provider } from "./utilities/Web3Provider";
import { ConfigProvider } from "./utilities/ConfigProvider";
import { ChannelClientProvider } from "./utilities/ChannelClientProvider";
import { StateChannelsRepository } from "./data/StateChannelsRepository";
import { ThreeBoxPersistenceRepository } from "./data/3BoxPersistenceRepository";
import { ThreeBoxMessagingRepository } from "./data/3BoxMessagingRepository";
import { ChannelService } from "./business/ChannelService";
import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { IStateChannelRepository, IPersistenceRepository, IMessagingRepository } from "@interfaces/data";
import { IChannelService } from "@interfaces/business/IChannelService";
import { IStateChannelListener } from "@interfaces/api/IStateChannelListener";
import { IMessagingListener } from "@interfaces/api/IMessagingListener";
import { StateChannelListener } from "./api/StateChannelListener";
import { ThreeBoxMessagingListener } from "./api/ThreeBoxMessagingListener";

export class HypernetCore implements IHypernetCore {
  protected web3Provider: IWeb3Provider | undefined;
  protected configProvider: IConfigProvider | undefined;
  protected boxUtils: IThreeBoxUtils | undefined;
  protected channelClientProvider: IChannelClientProvider | undefined;

  protected stateChannelRepository: IStateChannelRepository | undefined;
  protected persistenceRepository: IPersistenceRepository | undefined;
  protected messagingRepository: IMessagingRepository | undefined;

  protected channelService: IChannelService | undefined;

  protected stateChannelListener: IStateChannelListener | undefined;
  protected messagingListener: IMessagingListener | undefined;

  constructor() {}

  public async initialize(consumerWallet: string): Promise<void> {
    this.web3Provider = new Web3Provider();
    this.configProvider = new ConfigProvider();
    this.boxUtils = new ThreeBoxUtils(this.web3Provider);
    this.channelClientProvider = new ChannelClientProvider();

    this.stateChannelRepository = new StateChannelsRepository(this.channelClientProvider);
    this.persistenceRepository = new ThreeBoxPersistenceRepository(this.boxUtils, this.configProvider);
    this.messagingRepository = new ThreeBoxMessagingRepository();

    this.channelService = new ChannelService(this.stateChannelRepository, this.persistenceRepository);

    this.stateChannelListener = new StateChannelListener(this.channelClientProvider);
    this.messagingListener = new ThreeBoxMessagingListener(this.channelService,this.boxUtils, this.configProvider);
  }

  openChannel(consumerWallet: string, providerWallet: string): Promise<HypernetChannel> {
    throw new Error("Method not implemented.");
  }
  depositIntoChannel(channelId: any, amount: any): Promise<Deposit> {
    throw new Error("Method not implemented.");
  }

  sendFunds(channelId: number, amount: BigNumber): Promise<Payment>;
}
