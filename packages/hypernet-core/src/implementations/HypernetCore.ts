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
  PublicIdentifier,
} from "@interfaces/objects";
import { EthersBlockchainProvider } from "@implementations/utilities/BlockchainProvider";
import { ConfigProvider } from "@implementations/utilities/ConfigProvider";
import { LinkService } from "@implementations/business/LinkService";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";
import { ILinkRepository } from "@interfaces/data";
import { VectorLinkRepository } from "@implementations/data/VectorLinkRepository";
import { ILinkService } from "@interfaces/business/ILinkService";
import { ContextProvider } from "@implementations/utilities/ContextProvider";
import { IAccountsRepository } from "@interfaces/data/IAccountsRepository";
import { AccountsRepository } from "@implementations/data/AccountsRepository";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { LinkUtils } from "@implementations/utilities/LinkUtils";
import { Subject } from "rxjs";
import { IBrowserNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { BrowserNodeProvider } from "@implementations/utilities/BrowserNodeProvider";
import { IVectorUtils, ILinkUtils, IConfigProvider } from "@interfaces/utilities";
import { VectorUtils } from "./utilities/VectorUtils";

export class HypernetCore implements IHypernetCore {
  public onLinkUpdated: Subject<HypernetLink>;
  public onLinkRequestReceived: Subject<EstablishLinkRequestWithApproval>;
  public onLinkRejected: Subject<EstablishLinkRequest>;
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;

  protected blockchainProvider: IBlockchainProvider;
  protected configProvider: IConfigProvider;
  protected contextProvider: IContextProvider;
  protected browserNodeProvider: IBrowserNodeProvider;
  protected linkUtils: ILinkUtils;
  protected vectorUtils: IVectorUtils;

  protected accountRepository: IAccountsRepository;
  protected linkRepository: ILinkRepository;

  protected linkService: ILinkService;

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

    this.blockchainProvider = new EthersBlockchainProvider();
    this.configProvider = new ConfigProvider(config);
    this.contextProvider = new ContextProvider(
      this.onLinkUpdated,
      this.onLinkRequestReceived,
      this.onLinkRejected,
      this.onControlClaimed,
      this.onControlYielded,
    );
    this.browserNodeProvider = new BrowserNodeProvider(this.configProvider, this.contextProvider);
    this.linkUtils = new LinkUtils();
    this.vectorUtils = new VectorUtils(this.configProvider, this.contextProvider, this.browserNodeProvider);

    this.accountRepository = new AccountsRepository(this.blockchainProvider);
    this.linkRepository = new VectorLinkRepository(this.browserNodeProvider,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils);

    this.linkService = new LinkService(
      this.linkRepository,
      this.contextProvider,
      this.linkUtils,
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

  public async getPublicIdentifier(): Promise<PublicIdentifier> {
    const context = await this.contextProvider.getInitializedContext()

    return context.publicIdentifier;
  }

  public async getLinks(): Promise<HypernetLink[]> {
    return this.linkService.getActiveLinks();
  }

  public async openLink(
    consumer: PublicIdentifier,
    paymentToken: EthereumAddress,
    amount: BigNumber,
    disputeMediator: PublicKey,
    pullSettings: PullSettings | null,
  ): Promise<HypernetLink> {
    return this.linkService.openLink(consumer,
      paymentToken,
      amount,
      disputeMediator,
      pullSettings);
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

  /**
   * @param privateKey this is just for temporary usage.
   */
  public async initialize(account: string, privateKey: string): Promise<void> {
    const context = await this.contextProvider.getContext();
    context.account = account;
    context.privateKey = privateKey;
    await this.contextProvider.setContext(context);

    // const messagingListener = this.messagingListener.initialize();

    // await Promise.all([messagingListener]);

    // This should always be the last thing we do, after everything else is initialized
    // await this.controlService.claimControl();

    // Set the status bit
    this._initialized = true;
  }

  // DEBUG ONLY
  public async clearLinks(): Promise<void> {
    await this.linkService.clearLinks();
  }
}
