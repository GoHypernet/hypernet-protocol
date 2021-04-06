import {
  AccountService,
  DevelopmentService,
  LinkService,
  MerchantService,
  PaymentService,
} from "@implementations/business";
import {
  AccountsRepository,
  MerchantConnectorRepository,
  PaymentRepository,
  VectorLinkRepository,
} from "@implementations/data";
import {
  BrowserNodeProvider,
  ConfigProvider,
  ContextProvider,
  EthersBlockchainProvider,
  LinkUtils,
  LogUtils,
  PaymentUtils,
  PaymentIdUtils,
  TimeUtils,
  VectorUtils,
  EthersBlockchainUtils,
} from "@implementations/utilities";
import { VectorAPIListener } from "@implementations/api";
import {
  IAccountService,
  IDevelopmentService,
  ILinkService,
  IMerchantService,
  IPaymentService,
} from "@interfaces/business";
import {
  IAccountsRepository,
  ILinkRepository,
  IMerchantConnectorRepository,
  IPaymentRepository,
} from "@interfaces/data";
import {
  Balances,
  ControlClaim,
  EthereumAddress,
  ExternalProvider,
  HexString,
  HypernetConfig,
  HypernetContext,
  HypernetLink,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  IHypernetCore,
  PaymentId,
} from "@hypernetlabs/objects";
import {
  AcceptPaymentError,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  CoreUninitializedError,
  InsufficientBalanceError,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
  RouterChannelUnknownError,
  VectorError,
} from "@hypernetlabs/objects";
import { EBlockchainNetwork } from "@hypernetlabs/objects";
import {
  IBlockchainProvider,
  IBlockchainUtils,
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  ILinkUtils,
  ILogUtils,
  IPaymentIdUtils,
  IPaymentUtils,
  ITimeUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { IVectorListener } from "@interfaces/api";
import { Subject } from "rxjs";
import { ok, Result, ResultAsync } from "neverthrow";
import { AxiosAjaxUtils, IAjaxUtils, ResultUtils, ILocalStorageUtils, LocalStorageUtils } from "@hypernetlabs/utils";
import { IBrowserNodeFactory, IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";
import { MerchantConnectorProxyFactory, BrowserNodeFactory } from "@implementations/utilities/factory";
import { BigNumber } from "ethers";

/**
 * The top-level class-definition for Hypernet Core.
 */
export class HypernetCore implements IHypernetCore {
  // RXJS Observables
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentSent: Subject<PushPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentSent: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onPullPaymentReceived: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;
  public onMerchantAuthorized: Subject<string>;
  public onAuthorizedMerchantUpdated: Subject<string>;
  public onAuthorizedMerchantActivationFailed: Subject<string>;
  public onMerchantIFrameDisplayRequested: Subject<string>;
  public onMerchantIFrameCloseRequested: Subject<string>;

  // Utils Layer Stuff
  protected timeUtils: ITimeUtils;
  protected blockchainProvider: IBlockchainProvider;
  protected configProvider: IConfigProvider;
  protected contextProvider: IContextProvider;
  protected browserNodeProvider: IBrowserNodeProvider;
  protected vectorUtils: IVectorUtils;
  protected paymentUtils: IPaymentUtils;
  protected linkUtils: ILinkUtils;
  protected paymentIdUtils: IPaymentIdUtils;
  protected logUtils: ILogUtils;
  protected ajaxUtils: IAjaxUtils;
  protected blockchainUtils: IBlockchainUtils;
  protected localStorageUtils: ILocalStorageUtils;

  // Factories
  protected merchantConnectorProxyFactory: IMerchantConnectorProxyFactory;
  protected browserNodeFactory: IBrowserNodeFactory;

  // Data Layer Stuff
  protected accountRepository: IAccountsRepository;
  protected linkRepository: ILinkRepository;
  protected paymentRepository: IPaymentRepository;
  protected merchantConnectorRepository: IMerchantConnectorRepository;

  // Business Layer Stuff
  protected accountService: IAccountService;
  //protected controlService: IControlService;
  protected paymentService: IPaymentService;
  protected linkService: ILinkService;
  protected developmentService: IDevelopmentService;
  protected merchantService: IMerchantService;

  // API
  protected vectorAPIListener: IVectorListener;

  protected _initializeResult: ResultAsync<void, LogicalError> | null;
  protected _initialized: boolean;
  protected _initializePromise: Promise<void>;
  protected _initializePromiseResolve: (() => void) | null;
  protected _inControl: boolean;

  /**
   * Returns an instance of HypernetCore.
   * @param network the network to attach to
   * @param config optional config, defaults to localhost/dev config
   */
  constructor(
    network: EBlockchainNetwork = EBlockchainNetwork.Main,
    config?: HypernetConfig,
    externalProvider?: ExternalProvider,
  ) {
    this._inControl = false;

    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentSent = new Subject<PushPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentSent = new Subject<PullPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onPullPaymentReceived = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();
    this.onMerchantAuthorized = new Subject<string>();
    this.onAuthorizedMerchantUpdated = new Subject<string>();
    this.onAuthorizedMerchantActivationFailed = new Subject<string>();
    this.onMerchantIFrameDisplayRequested = new Subject<string>();
    this.onMerchantIFrameCloseRequested = new Subject<string>();

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

    this.logUtils = new LogUtils();
    this.localStorageUtils = new LocalStorageUtils();
    this.contextProvider = new ContextProvider(
      this.onControlClaimed,
      this.onControlYielded,
      this.onPushPaymentSent,
      this.onPullPaymentSent,
      this.onPushPaymentReceived,
      this.onPullPaymentReceived,
      this.onPushPaymentUpdated,
      this.onPullPaymentUpdated,
      this.onBalancesChanged,
      this.onMerchantAuthorized,
      this.onAuthorizedMerchantUpdated,
      this.onAuthorizedMerchantActivationFailed,
      this.onMerchantIFrameDisplayRequested,
      this.onMerchantIFrameCloseRequested,
    );
    this.blockchainProvider = new EthersBlockchainProvider(externalProvider);
    this.timeUtils = new TimeUtils(this.blockchainProvider);
    this.paymentIdUtils = new PaymentIdUtils();
    this.configProvider = new ConfigProvider(network, this.logUtils, config);
    this.linkUtils = new LinkUtils(this.contextProvider);

    this.merchantConnectorProxyFactory = new MerchantConnectorProxyFactory(this.configProvider, this.contextProvider);
    this.browserNodeFactory = new BrowserNodeFactory(this.configProvider, this.logUtils);

    this.browserNodeProvider = new BrowserNodeProvider(
      this.configProvider,
      this.contextProvider,
      this.blockchainProvider,
      this.logUtils,
      this.localStorageUtils,
      this.browserNodeFactory,
    );
    this.vectorUtils = new VectorUtils(
      this.configProvider,
      this.contextProvider,
      this.browserNodeProvider,
      this.blockchainProvider,
      this.paymentIdUtils,
      this.logUtils,
      this.timeUtils,
    );
    this.paymentUtils = new PaymentUtils(
      this.configProvider,
      this.logUtils,
      this.paymentIdUtils,
      this.vectorUtils,
      this.browserNodeProvider,
      this.timeUtils,
    );
    this.ajaxUtils = new AxiosAjaxUtils();
    this.blockchainUtils = new EthersBlockchainUtils(this.blockchainProvider);

    this.accountRepository = new AccountsRepository(
      this.blockchainProvider,
      this.vectorUtils,
      this.browserNodeProvider,
      this.logUtils,
      this.blockchainUtils,
    );

    this.paymentRepository = new PaymentRepository(
      this.browserNodeProvider,
      this.vectorUtils,
      this.configProvider,
      this.contextProvider,
      this.paymentUtils,
      this.logUtils,
      this.timeUtils,
    );

    this.linkRepository = new VectorLinkRepository(
      this.browserNodeProvider,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils,
      this.paymentUtils,
      this.linkUtils,
      this.timeUtils,
    );

    this.merchantConnectorRepository = new MerchantConnectorRepository(
      this.blockchainProvider,
      this.ajaxUtils,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils,
      this.localStorageUtils,
      this.merchantConnectorProxyFactory,
      this.blockchainUtils,
    );

    this.paymentService = new PaymentService(
      this.linkRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.paymentRepository,
      this.merchantConnectorRepository,
      this.logUtils,
    );

    this.accountService = new AccountService(this.accountRepository, this.contextProvider, this.logUtils);
    //this.controlService = new ControlService(this.contextProvider, this.threeboxMessagingRepository);
    this.linkService = new LinkService(this.linkRepository);
    this.developmentService = new DevelopmentService(this.accountRepository);
    this.merchantService = new MerchantService(this.merchantConnectorRepository, this.contextProvider, this.logUtils);

    this.vectorAPIListener = new VectorAPIListener(
      this.browserNodeProvider,
      this.paymentService,
      this.vectorUtils,
      this.contextProvider,
      this.paymentUtils,
      this.logUtils,
    );

    // This whole rigamarole is to make sure it can only be initialized a single time, and that you can call waitInitialized()
    // before the call to initialize() is made
    this._initializeResult = null;
    this._initializePromiseResolve = null;
    this._initialized = false;
    this._initializePromise = new Promise((resolve) => {
      this._initializePromiseResolve = resolve;
    });
  }

  /**
   * Returns the initialized status of this instance of Hypernet Core.
   */
  public initialized(): Result<boolean, LogicalError> {
    return ok(this._initialized);
  }

  public waitInitialized(): ResultAsync<void, LogicalError> {
    return ResultAsync.fromPromise(this._initializePromise, (e) => {
      return e as LogicalError;
    });
  }

  /**
   * Whether or not this instance of Hypernet Core is currently the one in control.
   */
  public inControl(): Result<boolean, LogicalError> {
    return ok(this._inControl);
  }

  /**
   * Returns a list of Ethereum accounts associated with this instance of Hypernet Core.
   */
  public getEthereumAccounts(): ResultAsync<EthereumAddress[], BlockchainUnavailableError> {
    return this.accountService.getAccounts();
  }

  /**
   * Returns the (vector) pubId associated with this instance of HypernetCore.
   */
  public getPublicIdentifier(): ResultAsync<PublicIdentifier, CoreUninitializedError> {
    return this.contextProvider.getInitializedContext().map((context) => {
      return context.publicIdentifier;
    });
  }

  /**
   * Deposit funds into Hypernet Core.
   * @param assetAddress the Ethereum address of the token to deposit
   * @param amount the amount of the token to deposit
   */
  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | VectorError | Error
  > {
    // console.log(`HypernetCore:depositFunds:assetAddress:${assetAddress}`)
    return this.accountService.depositFunds(assetAddress, amount);
  }

  /**
   * Withdraw funds from Hypernet Core to a specified destination (Ethereum) address.
   * @param assetAddress the address of the token to withdraw
   * @param amount the amount of the token to withdraw
   * @param destinationAddress the (Ethereum) address to withdraw to
   */
  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | VectorError | Error
  > {
    return this.accountService.withdrawFunds(assetAddress, amount, destinationAddress);
  }

  /**
   * Returns the current balances for this instance of Hypernet Core.
   */
  public getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError> {
    return this.accountService.getBalances();
  }

  /**
   * Return all Hypernet Links.
   */
  public getLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    return this.linkService.getLinks();
  }

  /**
   * Return all *active* Hypernet Links.
   */
  public getActiveLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    return this.linkService.getLinks();
  }

  /**
   * Returns all links with a specified counterparty.
   * @param counterPartyAccount
   */
  public async getLinkByCounterparty(counterPartyAccount: PublicIdentifier): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Sends funds to a counterparty.
   * Internally, this is a three-step process. First, the consumer will notify the provider of the
   * proposed terms of the payment (amount, required stake, and payment token). If the provider
   * accepts these terms, they will create an insurance payment for the stake, and then the consumer
   * finishes by creating a parameterized payment for the amount. The provider can immediately finalize
   * the payment.
   * @param linkId
   * @param amount
   * @param requiredStake the amount of stake that the provider must put up as part of the insurancepayment
   * @param paymentToken
   * @param merchantURL the registered URL for the merchant that will resolve any disputes.
   */
  public sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: number,
    requiredStake: string,
    paymentToken: EthereumAddress,
    merchantUrl: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    // Send payment terms to provider & request provider make insurance payment
    return this.paymentService.sendFunds(
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      merchantUrl,
    );
  }

  /**
   * Accepts the terms of a push payment, and puts up the stake/insurance transfer.
   * @param paymentId
   */
  public acceptOffers(
    paymentIds: PaymentId[],
  ): ResultAsync<Result<Payment, AcceptPaymentError>[], InsufficientBalanceError | AcceptPaymentError> {
    return this.paymentService.acceptOffers(paymentIds);
  }

  /**
   * Authorizes funds to a specified counterparty, with an amount, rate, & expiration date.
   * @param counterPartyAccount the public identifier of the counterparty to authorize funds to
   * @param totalAuthorized the total amount the counterparty is allowed to "pull"
   * @param expirationDate the latest time in which the counterparty can pull funds
   * @param requiredStake the amount of stake the counterparyt must put up as insurance
   * @param paymentToken the (Ethereum) address of the payment token
   * @param merchantUrl the registered URL for the merchant that will resolve any disputes.
   */
  public authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: number,
    deltaAmount: string,
    deltaTime: number,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    merchantUrl: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    return this.paymentService.authorizeFunds(
      counterPartyAccount,
      totalAuthorized,
      expirationDate,
      deltaAmount,
      deltaTime,
      requiredStake,
      paymentToken,
      merchantUrl,
    );
  }

  /**
   * Pull funds for a given payment
   * @param paymentId the payment for which to pull funds from
   * @param amount the amount of funds to pull
   */
  public pullFunds(
    paymentId: PaymentId,
    amount: BigNumber,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    return this.paymentService.pullFunds(paymentId, amount);
  }

  /**
   * Finalize a pull-payment.
   */
  public async finalizePullPayment(paymentId: string, finalAmount: BigNumber): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Initiate a dispute for a particular payment.
   * @param paymentId the payment for which to dispute
   * @param metadata the data provided to the dispute mediator about this dispute
   */
  public initiateDispute(paymentId: PaymentId): ResultAsync<Payment, CoreUninitializedError> {
    return this.paymentService.initiateDispute(paymentId);
  }

  /**
   * Initialize this instance of Hypernet Core
   * @param account: the ethereum account to initialize with
   */
  public initialize(account: EthereumAddress): ResultAsync<void, LogicalError> {
    if (this._initializeResult != null) {
      return this._initializeResult;
    }

    let context: HypernetContext;
    this._initializeResult = this.contextProvider
      .getContext()
      .andThen((val) => {
        context = val;
        context.account = account;
        return this.contextProvider.setContext(context);
      })
      .andThen(() => {
        return this.accountService.getPublicIdentifier();
      })
      .andThen((publicIdentifier) => {
        context.publicIdentifier = publicIdentifier;
        return this.contextProvider.setContext(context);
      })
      .andThen(() => {
        // Initialize anything that wants an initialized context
        return ResultUtils.combine([
          this.vectorAPIListener.setup(),
          this.merchantService.activateAuthorizedMerchants(),
        ]); // , this.threeboxMessagingListener.initialize()]);
      })
      // .andThen(() => {
      //   // Claim control
      //   return this.controlService.claimControl();
      // })
      .andThen(() => {
        // Get all the existing payments and try to catch them up
        return this.linkService.getLinks();
      })
      .andThen((links) => {
        const paymentIds = new Array<PaymentId>();
        for (const link of links) {
          for (const payment of link.payments) {
            paymentIds.push(payment.id);
          }
        }
        return this.paymentService.advancePayments(paymentIds);
      })
      .map(() => {
        if (this._initializePromiseResolve != null) {
          this._initializePromiseResolve();
        }

        this._initialized = true;
      });

    return this._initializeResult;
  }

  /**
   * Mints the test token to the Ethereum address associated with the Core account.
   * @param amount the amount of test token to mint
   */
  public mintTestToken(amount: BigNumber): ResultAsync<void, CoreUninitializedError> {
    return this.contextProvider.getInitializedContext().andThen((context) => {
      return this.developmentService.mintTestToken(amount, context.account);
    });
  }

  public authorizeMerchant(merchantUrl: string): ResultAsync<void, CoreUninitializedError | MerchantValidationError> {
    return this.merchantService.authorizeMerchant(merchantUrl);
  }

  public getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError> {
    return this.merchantService.getAuthorizedMerchants();
  }

  public closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    return this.merchantService.closeMerchantIFrame(merchantUrl);
  }

  public displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    return this.merchantService.displayMerchantIFrame(merchantUrl);
  }
}
