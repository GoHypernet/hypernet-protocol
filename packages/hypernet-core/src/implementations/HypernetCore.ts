import { IHypernetCore } from "@interfaces/IHypernetCore";
import {
  HypernetLink,
  BigNumber,
  Payment,
  EthereumAddress,
  PublicKey,
  ControlClaim,
  HypernetConfig,
  PublicIdentifier,
  Balances,
  PullPayment,
  PushPayment,
} from "@interfaces/objects";
import { VectorLinkRepository, PaymentRepository, AccountsRepository } from "@implementations/data";
import { Subject } from "rxjs";
import {
  IBlockchainProvider,
  IVectorUtils,
  IConfigProvider,
  IContextProvider,
  IPaymentUtils,
} from "@interfaces/utilities";
import { IAccountService, IDevelopmentService, ILinkService, IPaymentService } from "@interfaces/business";
import { AccountService, DevelopmentService, LinkService, PaymentService } from "@implementations/business";
import {
  PaymentUtils,
  LinkUtils,
  ContextProvider,
  ConfigProvider,
  EthersBlockchainProvider,
  BrowserNodeProvider,
  VectorUtils,
} from "@implementations/utilities";
import { IPaymentRepository, ILinkRepository, IAccountsRepository } from "@interfaces/data";
import { ILinkUtils, IBrowserNodeProvider } from "@interfaces/utilities";
import { Result } from "@connext/vector-types";
import { EBlockchainNetwork } from "@interfaces/types";

export class HypernetCore implements IHypernetCore {
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentProposed: Subject<PushPayment>;
  public onPullPaymentProposed: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentApproved: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;

  protected blockchainProvider: IBlockchainProvider;
  protected configProvider: IConfigProvider;
  protected contextProvider: IContextProvider;
  protected browserNodeProvider: IBrowserNodeProvider;
  protected vectorUtils: IVectorUtils;
  protected paymentUtils: IPaymentUtils;
  protected linkUtils: ILinkUtils;

  protected accountRepository: IAccountsRepository;
  protected linkRepository: ILinkRepository;
  protected paymentRepository: IPaymentRepository;

  protected accountService: IAccountService;
  protected paymentService: IPaymentService;
  protected linkService: ILinkService;
  protected developmentService: IDevelopmentService;

  protected _initializedPromise: Promise<void>;
  protected _initializeResolve: (() => void) | undefined;
  protected _inControl: boolean;

  constructor(network: EBlockchainNetwork = EBlockchainNetwork.Main, config?: HypernetConfig) {
    this._initializedPromise = new Promise((resolve) => {
      this._initializeResolve = resolve;
    });
    this._inControl = false;

    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentProposed = new Subject<PushPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentProposed = new Subject<PullPayment>();
    this.onPullPaymentApproved = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();

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
    this.configProvider = new ConfigProvider(network, config);

    this.paymentUtils = new PaymentUtils(this.configProvider);
    this.linkUtils = new LinkUtils();

    this.contextProvider = new ContextProvider(
      this.onControlClaimed,
      this.onControlYielded,
      this.onPushPaymentProposed,
      this.onPullPaymentProposed,
      this.onPushPaymentReceived,
      this.onPullPaymentApproved,
      this.onBalancesChanged,
    );

    this.browserNodeProvider = new BrowserNodeProvider(this.configProvider, this.contextProvider);
    this.vectorUtils = new VectorUtils(this.configProvider, this.contextProvider, this.browserNodeProvider);

    this.accountRepository = new AccountsRepository(
      this.blockchainProvider,
      this.vectorUtils,
      this.browserNodeProvider,
    );

    this.paymentRepository = new PaymentRepository(
      this.browserNodeProvider,
      this.vectorUtils,
      this.configProvider,
      this.contextProvider,
      this.paymentUtils,
    );

    this.linkRepository = new VectorLinkRepository(
      this.browserNodeProvider,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils,
      this.paymentUtils,
      this.linkUtils,
    );

    this.paymentService = new PaymentService(
      this.linkRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.paymentRepository,
    );

    this.accountService = new AccountService(this.accountRepository, this.contextProvider);
    this.linkService = new LinkService(this.linkRepository);
    this.developmentService = new DevelopmentService(this.accountRepository);
  }

  public initialized(): Promise<void> {
    return this._initializedPromise;
  }
  public inControl(): boolean {
    return this._inControl;
  }

  public async getEthereumAccounts(): Promise<EthereumAddress[]> {
    return this.accountService.getAccounts();
  }

  public async getPublicIdentifier(): Promise<PublicIdentifier> {
    const context = await this.contextProvider.getInitializedContext();

    return context.publicIdentifier;
  }

  public async depositFunds(assetAddress: string, amount: BigNumber): Promise<Balances> {
    console.log(`HypernetCore:depositFunds:assetAddress:${assetAddress}`)
    return this.accountService.depositFunds(assetAddress, amount);
  }

  public async withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): Promise<Balances> {
    return this.accountService.withdrawFunds(assetAddress, amount, destinationAddress);
  }

  public async getBalances(): Promise<Balances> {
    return this.accountService.getBalances();
  }

  public async getLinks(): Promise<HypernetLink[]> {
    return this.linkService.getLinks();
  }

  public async getActiveLinks(): Promise<HypernetLink[]> {
    return this.linkService.getLinks();
  }

  public async getLinkByCounterparty(counterPartyAccount: PublicIdentifier): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * sendsFunds sends funds on a provided link.
   * Internally, this is a three-step process. First, the consumer will notify the provider of the
   * proposed terms of the payment (amount, required stake, and payment token). If the provider
   * accepts these terms, they will create an insurance payment for the stake, and then the consumer
   * finishes by creating a parameterized payment for the amount. The provider can immediately finalize
   * the payment.
   * @param linkId
   * @param amount
   * @param requiredStake the amount of stake that the provider must put up as part of the insurancepayment
   * @param paymentToken
   */
  public async sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment> {
    // Send payment terms to provider & request provider make insurance payment
    const payment = await this.paymentService.sendFunds(
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      disputeMediator,
    );

    return payment;
  }

  /**
   * acceptsFunds will accept the terms of a push payment, and puts up
   * the stake or insurance transfer.
   * @param paymentId
   */
  public async acceptFunds(paymentIds: string[]): Promise<Result<Payment, Error>[]> {
    console.log(`HypernetCore:acceptFunds: attempting to accept funds for paymentIds: ${paymentIds}`)
    const results = await this.paymentService.acceptFunds(paymentIds);

    return results;
  }

  public async authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: moment.Moment,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): Promise<Payment> {
    throw new Error("Method not yet implemented.");
  }

  public async pullFunds(paymentId: string, amount: BigNumber): Promise<Payment> {
    throw new Error("Method not yet implemented.");
  }

  public async finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  public async initiateDispute(paymentId: string, metadata: string): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * @param account: the ethereum account. Not used.
   */
  public async initialize(account: string): Promise<void> {
    const context = await this.contextProvider.getContext();
    const publicIdentifier = await this.accountService.getPublicIdentifier();
    context.account = account;
    context.publicIdentifier = publicIdentifier;
    await this.contextProvider.setContext(context);

    // const messagingListener = this.messagingListener.initialize();

    // await Promise.all([messagingListener]);

    // This should always be the last thing we do, after everything else is initialized
    // await this.controlService.claimControl();

    // Set the status bit
    if (this._initializeResolve != null) {
      this._initializeResolve();
    }
  }

  public async mintTestToken(amount: BigNumber): Promise<void> {
    let account = (await this.contextProvider.getContext()).account

    if (account === null) {
      throw new Error('Need an account to send funds to!')
    }

    this.developmentService.mintTestToken(amount, account);
  }
}