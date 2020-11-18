import { IHypernetCore } from "@interfaces/IHypernetCore";
import {
  HypernetLedger,
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
  Balances,
} from "@interfaces/objects";
import { EthersBlockchainProvider } from "@implementations/utilities/BlockchainProvider";
import { ConfigProvider } from "@implementations/utilities/ConfigProvider";
import { LinkService } from "@implementations/business/LinkService";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";
import { ILinkRepository } from "@interfaces/data";
import { VectorLinkRepository } from "@implementations/data/VectorLinkRepository";
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
import { IAccountService, ILinkService} from "@interfaces/business";
import { AccountService } from "./business/AccountService";

export class HypernetCore implements IHypernetCore {
  public onLinkUpdated: Subject<HypernetLedger>;
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
  protected accountService: IAccountService;

  protected _initialized: boolean;
  protected _inControl: boolean;

  constructor(config?: HypernetConfig) {
    this._initialized = false;
    this._inControl = false;

    this.onLinkUpdated = new Subject<HypernetLedger>();
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

    this.accountRepository = new AccountsRepository(this.blockchainProvider, this.vectorUtils, this.browserNodeProvider);
    this.linkRepository = new VectorLinkRepository(this.browserNodeProvider,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils);

    this.linkService = new LinkService(
      this.linkRepository,
      this.contextProvider,
      this.linkUtils,
    );

    this.accountService = new AccountService(this.accountRepository);
  }
  
  public initialized(): boolean {
    return this._initialized;
  }
  public inControl(): boolean {
    return this._inControl;
  }

  public async getEthereumAccounts(): Promise<EthereumAddress[]> {
    return this.accountService.getAccounts();
  }

  public async getPublicIdentifier(): Promise<PublicIdentifier> {
    const context = await this.contextProvider.getInitializedContext()

    return context.publicIdentifier;
  }

  public async depositFunds(assetAddress: string, amount: BigNumber): Promise<void> {
    return this.accountService.depositFunds(assetAddress, amount);
  }

  public async getBalances(): Promise<Balances> {
    throw new Error('Method not yet implemented.')
  }

  public async getLinks(): Promise<HypernetLedger[]> {
    return this.linkService.getActiveLinks();
  }

  public async openLink(
    consumerAccount: PublicIdentifier,
    allowedPaymentTokens: EthereumAddress[],
    stakeAmount: BigNumber, 
    stakeExpiration: number,
    disputeMediator: PublicKey
  ): Promise<HypernetLedger> {
    return this.linkService.openLink(consumerAccount,
      allowedPaymentTokens,
      stakeAmount,
      stakeExpiration,
      disputeMediator);
  }

public async acceptLink(linkId: string, 
  amount: BigNumber, 
  pullSettings: PullSettings | null): Promise<HypernetLedger> {
    throw new Error("Method not implemented");
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
