import {
  Balances,
  ControlClaim,
  EthereumAddress,
  HypernetConfig,
  HypernetLink,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  PaymentId,
  GatewayUrl,
  IHypernetCore,
  Signature,
  PrivateCredentials,
  EBlockchainNetwork,
  AssetInfo,
  AcceptPaymentError,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  InsufficientBalanceError,
  LogicalError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
  RouterChannelUnknownError,
  VectorError,
  InvalidPaymentError,
  InvalidParametersError,
  TransferResolutionError,
  ProxyError,
  MerchantAuthorizationDeniedError,
  BigNumberString,
  UnixTimestamp,
  MessagingError,
} from "@hypernetlabs/objects";
import {
  AxiosAjaxUtils,
  IAjaxUtils,
  ResultUtils,
  ILocalStorageUtils,
  LocalStorageUtils,
  ILogUtils,
  LogUtils,
  IValidationUtils,
  ValidationUtils,
} from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { ok, Result, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import {
  MerchantConnectorListener,
  NatsMessagingListener,
  VectorAPIListener,
} from "@implementations/api";
import {
  AccountService,
  ControlService,
  DevelopmentService,
  LinkService,
  MerchantConnectorService,
  PaymentService,
} from "@implementations/business";
import {
  AccountsRepository,
  MerchantConnectorRepository,
  NatsMessagingRepository,
  PaymentRepository,
  VectorLinkRepository,
} from "@implementations/data";
import { StorageUtils } from "@implementations/data/utilities";
import {
  BrowserNodeProvider,
  ConfigProvider,
  ContextProvider,
  EthersBlockchainProvider,
  LinkUtils,
  PaymentUtils,
  PaymentIdUtils,
  TimeUtils,
  VectorUtils,
  EthersBlockchainUtils,
  CeramicUtils,
  MetamaskUtils,
  MessagingProvider,
} from "@implementations/utilities";
import {
  MerchantConnectorProxyFactory,
  BrowserNodeFactory,
  InternalProviderFactory,
} from "@implementations/utilities/factory";
import {
  IMerchantConnectorListener,
  IMessagingListener,
  IVectorListener,
} from "@interfaces/api";
import {
  IAccountService,
  IControlService,
  IDevelopmentService,
  ILinkService,
  IMerchantConnectorService,
  IPaymentService,
} from "@interfaces/business";
import {
  IAccountsRepository,
  ILinkRepository,
  IMerchantConnectorRepository,
  IMessagingRepository,
  IPaymentRepository,
} from "@interfaces/data";
import { IStorageUtils } from "@interfaces/data/utilities";
import { HypernetContext } from "@interfaces/objects";
import {
  IBlockchainProvider,
  IBlockchainUtils,
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  ILinkUtils,
  IPaymentIdUtils,
  IPaymentUtils,
  ITimeUtils,
  IVectorUtils,
  ICeramicUtils,
  IMetamaskUtils,
  IMessagingProvider,
} from "@interfaces/utilities";
import {
  IBrowserNodeFactory,
  IInternalProviderFactory,
  IMerchantConnectorProxyFactory,
} from "@interfaces/utilities/factory";

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
  public onPushPaymentDelayed: Subject<PushPayment>;
  public onPullPaymentDelayed: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;
  public onDeStorageAuthenticationStarted: Subject<void>;
  public onDeStorageAuthenticationSucceeded: Subject<void>;
  public onDeStorageAuthenticationFailed: Subject<void>;
  public onMerchantAuthorized: Subject<GatewayUrl>;
  public onMerchantDeauthorizationStarted: Subject<GatewayUrl>;
  public onAuthorizedMerchantUpdated: Subject<GatewayUrl>;
  public onAuthorizedMerchantActivationFailed: Subject<GatewayUrl>;
  public onMerchantIFrameDisplayRequested: Subject<GatewayUrl>;
  public onMerchantIFrameCloseRequested: Subject<GatewayUrl>;
  public onInitializationRequired: Subject<void>;
  public onPrivateCredentialsRequested: Subject<void>;

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
  protected ceramicUtils: ICeramicUtils;
  protected validationUtils: IValidationUtils;
  protected storageUtils: IStorageUtils;
  protected metamaskUtils: IMetamaskUtils;
  protected messagingProvider: IMessagingProvider;

  // Factories
  protected merchantConnectorProxyFactory: IMerchantConnectorProxyFactory;
  protected browserNodeFactory: IBrowserNodeFactory;
  protected internalProviderFactory: IInternalProviderFactory;

  // Data Layer Stuff
  protected accountRepository: IAccountsRepository;
  protected linkRepository: ILinkRepository;
  protected paymentRepository: IPaymentRepository;
  protected merchantConnectorRepository: IMerchantConnectorRepository;
  protected messagingRepository: IMessagingRepository;

  // Business Layer Stuff
  protected accountService: IAccountService;
  protected controlService: IControlService;
  protected paymentService: IPaymentService;
  protected linkService: ILinkService;
  protected developmentService: IDevelopmentService;
  protected merchantConnectorService: IMerchantConnectorService;

  // API
  protected vectorAPIListener: IVectorListener;
  protected merchantConnectorListener: IMerchantConnectorListener;
  protected messagingListener: IMessagingListener;

  protected _initializeResult: ResultAsync<
    void,
    LogicalError | MessagingError
  > | null;
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
    this.onPushPaymentDelayed = new Subject<PushPayment>();
    this.onPullPaymentDelayed = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();
    this.onDeStorageAuthenticationStarted = new Subject<void>();
    this.onDeStorageAuthenticationSucceeded = new Subject<void>();
    this.onDeStorageAuthenticationFailed = new Subject<void>();
    this.onMerchantAuthorized = new Subject<GatewayUrl>();
    this.onMerchantDeauthorizationStarted = new Subject<GatewayUrl>();
    this.onAuthorizedMerchantUpdated = new Subject<GatewayUrl>();
    this.onAuthorizedMerchantActivationFailed = new Subject<GatewayUrl>();
    this.onMerchantIFrameDisplayRequested = new Subject<GatewayUrl>();
    this.onMerchantIFrameCloseRequested = new Subject<GatewayUrl>();
    this.onInitializationRequired = new Subject<void>();
    this.onPrivateCredentialsRequested = new Subject<void>();

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
      this.onPushPaymentDelayed,
      this.onPullPaymentDelayed,
      this.onPushPaymentUpdated,
      this.onPullPaymentUpdated,
      this.onBalancesChanged,
      this.onDeStorageAuthenticationStarted,
      this.onDeStorageAuthenticationSucceeded,
      this.onDeStorageAuthenticationFailed,
      this.onMerchantAuthorized,
      this.onMerchantDeauthorizationStarted,
      this.onAuthorizedMerchantUpdated,
      this.onAuthorizedMerchantActivationFailed,
      this.onMerchantIFrameDisplayRequested,
      this.onMerchantIFrameCloseRequested,
      this.onInitializationRequired,
      this.onPrivateCredentialsRequested,
    );
    this.paymentIdUtils = new PaymentIdUtils();
    this.configProvider = new ConfigProvider(this.logUtils, config);
    this.linkUtils = new LinkUtils(this.contextProvider);

    this.merchantConnectorProxyFactory = new MerchantConnectorProxyFactory(
      this.configProvider,
      this.contextProvider,
    );
    this.browserNodeFactory = new BrowserNodeFactory(
      this.configProvider,
      this.logUtils,
    );
    this.internalProviderFactory = new InternalProviderFactory(
      this.configProvider,
    );

    // TODO: This could work on Ethers provider and BlockchainUtils might be a good place for it
    this.metamaskUtils = new MetamaskUtils(
      this.configProvider,
      this.localStorageUtils,
      this.logUtils,
    );

    this.blockchainProvider = new EthersBlockchainProvider(
      this.contextProvider,
      this.configProvider,
      this.metamaskUtils,
      this.internalProviderFactory,
      this.logUtils,
    );
    this.timeUtils = new TimeUtils(this.blockchainProvider);

    this.ceramicUtils = new CeramicUtils(
      this.configProvider,
      this.contextProvider,
      this.blockchainProvider,
      this.logUtils,
    );

    this.storageUtils = new StorageUtils(
      this.contextProvider,
      this.ceramicUtils,
      this.localStorageUtils,
      this.logUtils,
    );

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
    this.validationUtils = new ValidationUtils();
    this.messagingProvider = new MessagingProvider(
      this.configProvider,
      this.contextProvider,
      this.browserNodeProvider,
      this.ajaxUtils,
    );

    this.accountRepository = new AccountsRepository(
      this.blockchainProvider,
      this.vectorUtils,
      this.browserNodeProvider,
      this.blockchainUtils,
      this.storageUtils,
      this.logUtils,
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
      this.storageUtils,
      this.merchantConnectorProxyFactory,
      this.blockchainUtils,
      this.logUtils,
    );
    this.messagingRepository = new NatsMessagingRepository(
      this.messagingProvider,
      this.configProvider,
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

    this.accountService = new AccountService(
      this.accountRepository,
      this.contextProvider,
      this.blockchainProvider,
      this.logUtils,
    );
    this.controlService = new ControlService(
      this.messagingRepository,
      this.contextProvider,
      this.timeUtils,
    );
    this.linkService = new LinkService(this.linkRepository);
    this.developmentService = new DevelopmentService(this.accountRepository);
    this.merchantConnectorService = new MerchantConnectorService(
      this.merchantConnectorRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.logUtils,
    );

    this.vectorAPIListener = new VectorAPIListener(
      this.browserNodeProvider,
      this.paymentService,
      this.vectorUtils,
      this.contextProvider,
      this.paymentUtils,
      this.logUtils,
    );

    this.merchantConnectorListener = new MerchantConnectorListener(
      this.accountService,
      this.paymentService,
      this.linkService,
      this.contextProvider,
      this.logUtils,
      this.validationUtils,
    );
    this.messagingListener = new NatsMessagingListener(
      this.controlService,
      this.messagingProvider,
      this.configProvider,
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
  public initialized(): Result<boolean, never> {
    return ok(this._initialized);
  }

  public waitInitialized(): ResultAsync<void, never> {
    return ResultAsync.fromSafePromise(this._initializePromise);
  }

  /**
   * Whether or not this instance of Hypernet Core is currently the one in control.
   */
  public inControl(): Result<boolean, never> {
    return ok(this._inControl);
  }

  /**
   * Returns a list of Ethereum accounts associated with this instance of Hypernet Core.
   */
  public getEthereumAccounts(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this.accountService.getAccounts();
  }

  /**
   * Returns the (vector) pubId associated with this instance of HypernetCore.
   */
  public getPublicIdentifier(): ResultAsync<PublicIdentifier, never> {
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
    amount: BigNumberString,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
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
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  > {
    return this.accountService.withdrawFunds(
      assetAddress,
      amount,
      destinationAddress,
    );
  }

  /**
   * Returns the current balances for this instance of Hypernet Core.
   */
  public getBalances(): ResultAsync<Balances, BalancesUnavailableError> {
    return this.accountService.getBalances();
  }

  /**
   * Return all Hypernet Links.
   */
  public getLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | VectorError | Error
  > {
    return this.linkService.getLinks();
  }

  /**
   * Return all *active* Hypernet Links.
   */
  public getActiveLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | VectorError | Error
  > {
    return this.linkService.getLinks();
  }

  /**
   * Returns all links with a specified counterparty.
   * @param counterPartyAccount
   */
  public async getLinkByCounterparty(
    counterPartyAccount: PublicIdentifier,
  ): Promise<HypernetLink> {
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
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumAddress,
    merchantUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error> {
    // Send payment terms to provider & request provider make insurance payment
    return this.paymentService.sendFunds(
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      merchantUrl,
      metadata,
    );
  }

  /**
   * Accepts the terms of a push payment, and puts up the stake/insurance transfer.
   * @param paymentId
   */
  public acceptOffers(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Result<Payment, AcceptPaymentError>[],
    InsufficientBalanceError | AcceptPaymentError
  > {
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
    totalAuthorized: BigNumberString,
    expirationDate: UnixTimestamp,
    deltaAmount: BigNumberString,
    deltaTime: number,
    requiredStake: BigNumberString,
    paymentToken: EthereumAddress,
    merchantUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error> {
    return this.paymentService.authorizeFunds(
      counterPartyAccount,
      totalAuthorized,
      expirationDate,
      deltaAmount,
      deltaTime,
      requiredStake,
      paymentToken,
      merchantUrl,
      metadata,
    );
  }

  /**
   * Pull funds for a given payment
   * @param paymentId the payment for which to pull funds from
   * @param amount the amount of funds to pull
   */
  public pullFunds(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<Payment, RouterChannelUnknownError | VectorError | Error> {
    return this.paymentService.pullFunds(paymentId, amount);
  }

  /**
   * Finalize a pull-payment.
   */
  public async finalizePullPayment(
    paymentId: PaymentId,
    finalAmount: BigNumberString,
  ): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  /**
   * Initiate a dispute for a particular payment.
   * @param paymentId the payment for which to dispute
   * @param metadata the data provided to the dispute mediator about this dispute
   */
  public initiateDispute(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | MerchantConnectorError
    | MerchantValidationError
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
  > {
    return this.paymentService.initiateDispute(paymentId);
  }

  public resolveInsurance(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
  > {
    return this.paymentService.resolveInsurance(paymentId);
  }

  /**
   * Initialize this instance of Hypernet Core
   * @param account: the ethereum account to initialize with
   */
  public initialize(
    account: EthereumAddress,
  ): ResultAsync<void, LogicalError | MessagingError> {
    if (this._initializeResult != null) {
      return this._initializeResult;
    }

    this.logUtils.debug(
      `Initializing Hypernet Protocol Core with account ${account}`,
    );

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
          this.merchantConnectorListener.setup(),
          this.merchantConnectorService.initialize(),
          this.messagingListener.setup(),
        ]); // , this.threeboxMessagingListener.initialize()]);
      })
      .andThen(() => {
        return this.merchantConnectorService.activateAuthorizedMerchants();
      })
      // .andThen(() => {
      //   // Claim control
      //   return this.controlService.claimControl();
      // })
      .map(() => {
        if (this._initializePromiseResolve != null) {
          this._initializePromiseResolve();
        }
        this.logUtils.debug(`Hypernet Protocol core initialized successfully`);
        this._initialized = true;
      });

    return this._initializeResult;
  }

  /**
   * Mints the test token to the Ethereum address associated with the Core account.
   * @param amount the amount of test token to mint
   */
  public mintTestToken(
    amount: BigNumberString,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this.contextProvider.getInitializedContext().andThen((context) => {
      return this.developmentService.mintTestToken(amount, context.account);
    });
  }

  public authorizeMerchant(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantValidationError> {
    return this.merchantConnectorService.authorizeMerchant(merchantUrl);
  }

  public deauthorizeMerchant(
    merchantUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | MerchantAuthorizationDeniedError
  > {
    return this.merchantConnectorService.deauthorizeMerchant(merchantUrl);
  }

  public getAuthorizedMerchantsConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
  > {
    return this.merchantConnectorService.getAuthorizedMerchantsConnectorsStatus();
  }

  public getAuthorizedMerchants(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError
  > {
    return this.merchantConnectorService.getAuthorizedMerchants();
  }

  public closeMerchantIFrame(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorService.closeMerchantIFrame(merchantUrl);
  }

  public displayMerchantIFrame(
    merchantUrl: GatewayUrl,
  ): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorService.displayMerchantIFrame(merchantUrl);
  }

  public providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError> {
    return this.accountService.providePrivateCredentials(
      new PrivateCredentials(privateKey, mnemonic),
    );
  }

  public setPreferredPaymentToken(
    tokenAddress: EthereumAddress,
  ): ResultAsync<void, PersistenceError> {
    return this.accountService.setPreferredPaymentToken(tokenAddress);
  }

  public getPreferredPaymentToken(): ResultAsync<
    AssetInfo,
    BlockchainUnavailableError | PersistenceError
  > {
    return this.accountService.getPreferredPaymentToken();
  }
}
