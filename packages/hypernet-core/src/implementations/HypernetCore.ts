import {
  Balances,
  ControlClaim,
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
  AcceptPaymentError,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  InsufficientBalanceError,
  GatewayConnectorError,
  GatewayValidationError,
  PersistenceError,
  VectorError,
  InvalidParametersError,
  ProxyError,
  GatewayAuthorizationDeniedError,
  BigNumberString,
  MessagingError,
  RouterChannelUnknownError,
  ActiveStateChannel,
  ChainId,
  GatewayTokenInfo,
  GatewayRegistrationFilter,
  GatewayRegistrationInfo,
  Proposal,
  EProposalVoteSupport,
  ProposalVoteReceipt,
  Registry,
  RegistryEntry,
  RegistryParams,
  RegistryPermissionError,
  ERegistrySortOrder,
  NonFungibleRegistryContractError,
  RegistryFactoryContractError,
  HypernetGovernorContractError,
  ERC20ContractError,
  InvalidPaymentError,
  GatewayActivationError,
  InvalidPaymentIdError,
  GovernanceSignerUnavailableError,
  TransferResolutionError,
  TransferCreationError,
  PaymentStakeError,
  PaymentFinalizeError,
  EthereumAccountAddress,
  EthereumContractAddress,
  RegistryTokenId,
  PaymentCreationError,
  ProviderId,
  TokenInformation,
  InactiveGatewayError,
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
  ITimeUtils,
  TimeUtils,
} from "@hypernetlabs/utils";
import {
  BlockchainListener,
  GatewayConnectorListener,
  NatsMessagingListener,
  VectorAPIListener,
} from "@implementations/api";
import {
  AccountService,
  ControlService,
  DevelopmentService,
  LinkService,
  GatewayConnectorService,
  PaymentService,
  GovernanceService,
  RegistryService,
  TokenInformationService,
} from "@implementations/business";
import {
  AccountsRepository,
  GatewayConnectorRepository,
  NatsMessagingRepository,
  PaymentRepository,
  RouterRepository,
  LinkRepository,
  GovernanceRepository,
  RegistryRepository,
  GatewayRegistrationRepository,
  TokenInformationRepository,
} from "@implementations/data";
import {
  IBlockchainListener,
  IGatewayConnectorListener,
  IMessagingListener,
  IVectorListener,
} from "@interfaces/api";
import {
  IAccountService,
  IControlService,
  IDevelopmentService,
  ILinkService,
  IGatewayConnectorService,
  IPaymentService,
  IGovernanceService,
  IRegistryService,
  ITokenInformationService,
} from "@interfaces/business";
import {
  IAccountsRepository,
  ILinkRepository,
  IGatewayConnectorRepository,
  IMessagingRepository,
  IPaymentRepository,
  IRouterRepository,
  IGatewayRegistrationRepository,
  IGovernanceRepository,
  IRegistryRepository,
  ITokenInformationRepository,
} from "@interfaces/data";
import { HypernetConfig, HypernetContext } from "@interfaces/objects";
import { ok, okAsync, Result, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { StorageUtils } from "@implementations/data/utilities";
import {
  BrowserNodeProvider,
  ConfigProvider,
  ContextProvider,
  EthersBlockchainProvider,
  LinkUtils,
  PaymentUtils,
  PaymentIdUtils,
  VectorUtils,
  EthersBlockchainUtils,
  CeramicUtils,
  MessagingProvider,
  BlockchainTimeUtils,
} from "@implementations/utilities";
import {
  GatewayConnectorProxyFactory,
  BrowserNodeFactory,
  InternalProviderFactory,
  ContractFactory,
} from "@implementations/utilities/factory";
import { IStorageUtils } from "@interfaces/data/utilities";
import {
  IBlockchainProvider,
  IBlockchainUtils,
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  ILinkUtils,
  IPaymentIdUtils,
  IPaymentUtils,
  IVectorUtils,
  ICeramicUtils,
  IMessagingProvider,
  IBlockchainTimeUtils,
} from "@interfaces/utilities";
import {
  IBrowserNodeFactory,
  IInternalProviderFactory,
  IGatewayConnectorProxyFactory,
  IContractFactory,
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
  public onPushPaymentCanceled = new Subject<PushPayment>();
  public onPullPaymentCanceled = new Subject<PullPayment>();
  public onBalancesChanged: Subject<Balances>;
  public onCeramicAuthenticationStarted: Subject<void>;
  public onCeramicAuthenticationSucceeded: Subject<void>;
  public onCeramicFailed: Subject<Error>;
  public onGatewayAuthorized: Subject<GatewayUrl>;
  public onGatewayDeauthorizationStarted: Subject<GatewayUrl>;
  public onAuthorizedGatewayUpdated: Subject<GatewayUrl>;
  public onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>;
  public onGatewayIFrameDisplayRequested: Subject<GatewayUrl>;
  public onGatewayIFrameCloseRequested: Subject<GatewayUrl>;
  public onCoreIFrameDisplayRequested: Subject<void>;
  public onCoreIFrameCloseRequested: Subject<void>;
  public onInitializationRequired: Subject<void>;
  public onPrivateCredentialsRequested: Subject<void>;
  public onWalletConnectOptionsDisplayRequested: Subject<void>;
  public onStateChannelCreated: Subject<ActiveStateChannel>;
  public onChainConnected: Subject<ChainId>;
  public onGovernanceChainConnected: Subject<ChainId>;
  public onChainChanged: Subject<ChainId>;
  public onAccountChanged: Subject<EthereumAccountAddress>;
  public onGovernanceChainChanged: Subject<ChainId>;
  public onGovernanceAccountChanged: Subject<EthereumAccountAddress>;

  // Utils Layer Stuff
  protected timeUtils: ITimeUtils;
  protected blockchainTimeUtils: IBlockchainTimeUtils;
  protected blockchainProvider: IBlockchainProvider;
  protected configProvider: IConfigProvider;
  protected contextProvider: IContextProvider;
  protected linkUtils: ILinkUtils;
  protected paymentIdUtils: IPaymentIdUtils;
  protected logUtils: ILogUtils;
  protected ajaxUtils: IAjaxUtils;
  protected blockchainUtils: IBlockchainUtils;
  protected localStorageUtils: ILocalStorageUtils;
  protected validationUtils: IValidationUtils;
  protected storageUtils: IStorageUtils;
  protected messagingProvider: IMessagingProvider;

  // Dependent on the browser node
  protected browserNodeProvider: IBrowserNodeProvider;
  protected vectorUtils: IVectorUtils;
  protected paymentUtils: IPaymentUtils;
  protected ceramicUtils: ICeramicUtils;

  // Factories
  protected gatewayConnectorProxyFactory: IGatewayConnectorProxyFactory;
  protected browserNodeFactory: IBrowserNodeFactory;
  protected internalProviderFactory: IInternalProviderFactory;
  protected contractFactory: IContractFactory;

  // Data Layer Stuff
  protected accountRepository: IAccountsRepository;
  protected linkRepository: ILinkRepository;
  protected paymentRepository: IPaymentRepository;
  protected gatewayConnectorRepository: IGatewayConnectorRepository;
  protected gatewayRegistrationRepository: IGatewayRegistrationRepository;
  protected messagingRepository: IMessagingRepository;
  protected routerRepository: IRouterRepository;
  protected governanceRepository: IGovernanceRepository;
  protected tokenInformationRepository: ITokenInformationRepository;
  protected registryRepository: IRegistryRepository;

  // Business Layer Stuff
  protected accountService: IAccountService;
  protected controlService: IControlService;
  protected paymentService: IPaymentService;
  protected linkService: ILinkService;
  protected developmentService: IDevelopmentService;
  protected gatewayConnectorService: IGatewayConnectorService;
  protected governanceService: IGovernanceService;
  protected registryService: IRegistryService;
  protected tokenInformationService: ITokenInformationService;

  // API
  protected vectorAPIListener: IVectorListener;
  protected gatewayConnectorListener: IGatewayConnectorListener;
  protected messagingListener: IMessagingListener;
  protected blockchainListener: IBlockchainListener;

  protected _initializeResult: ResultAsync<
    void,
    | MessagingError
    | BlockchainUnavailableError
    | VectorError
    | RouterChannelUnknownError
    | GatewayConnectorError
    | GatewayValidationError
    | ProxyError
    | PersistenceError
    | InvalidPaymentError
    | InvalidParametersError
    | InvalidPaymentIdError
    | GovernanceSignerUnavailableError
    | TransferResolutionError
    | TransferCreationError
    | PaymentStakeError
    | PaymentFinalizeError
    | NonFungibleRegistryContractError
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
  constructor(config?: HypernetConfig) {
    this._inControl = false;

    this.onControlClaimed = new Subject();
    this.onControlYielded = new Subject();
    this.onPushPaymentSent = new Subject();
    this.onPushPaymentUpdated = new Subject();
    this.onPushPaymentReceived = new Subject();
    this.onPullPaymentSent = new Subject();
    this.onPullPaymentUpdated = new Subject();
    this.onPullPaymentReceived = new Subject();
    this.onPushPaymentDelayed = new Subject();
    this.onPullPaymentDelayed = new Subject();
    this.onPushPaymentCanceled = new Subject();
    this.onPullPaymentCanceled = new Subject();
    this.onBalancesChanged = new Subject();
    this.onCeramicAuthenticationStarted = new Subject();
    this.onCeramicAuthenticationSucceeded = new Subject();
    this.onCeramicFailed = new Subject();
    this.onGatewayAuthorized = new Subject();
    this.onGatewayDeauthorizationStarted = new Subject();
    this.onAuthorizedGatewayUpdated = new Subject();
    this.onAuthorizedGatewayActivationFailed = new Subject();
    this.onGatewayIFrameDisplayRequested = new Subject();
    this.onGatewayIFrameCloseRequested = new Subject();
    this.onCoreIFrameDisplayRequested = new Subject();
    this.onCoreIFrameCloseRequested = new Subject();
    this.onInitializationRequired = new Subject<void>();
    this.onPrivateCredentialsRequested = new Subject();
    this.onWalletConnectOptionsDisplayRequested = new Subject();
    this.onStateChannelCreated = new Subject();
    this.onChainConnected = new Subject();
    this.onGovernanceChainConnected = new Subject();
    this.onChainChanged = new Subject();
    this.onAccountChanged = new Subject();
    this.onGovernanceChainChanged = new Subject();
    this.onGovernanceAccountChanged = new Subject();

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
    this.timeUtils = new TimeUtils();
    this.localStorageUtils = new LocalStorageUtils();
    this.ajaxUtils = new AxiosAjaxUtils();
    this.validationUtils = new ValidationUtils();

    this.contextProvider = new ContextProvider(
      this.onControlClaimed,
      this.onControlYielded,
      this.onPushPaymentSent,
      this.onPullPaymentSent,
      this.onPushPaymentReceived,
      this.onPullPaymentReceived,
      this.onPushPaymentUpdated,
      this.onPullPaymentUpdated,
      this.onPushPaymentDelayed,
      this.onPullPaymentDelayed,
      this.onPushPaymentCanceled,
      this.onPullPaymentCanceled,
      this.onBalancesChanged,
      this.onCeramicAuthenticationStarted,
      this.onCeramicAuthenticationSucceeded,
      this.onCeramicFailed,
      this.onGatewayAuthorized,
      this.onGatewayDeauthorizationStarted,
      this.onAuthorizedGatewayUpdated,
      this.onAuthorizedGatewayActivationFailed,
      this.onGatewayIFrameDisplayRequested,
      this.onGatewayIFrameCloseRequested,
      this.onCoreIFrameDisplayRequested,
      this.onCoreIFrameCloseRequested,
      this.onInitializationRequired,
      this.onPrivateCredentialsRequested,
      this.onWalletConnectOptionsDisplayRequested,
      this.onStateChannelCreated,
      this.onChainConnected,
      this.onGovernanceChainConnected,
      this.onChainChanged,
      this.onAccountChanged,
      this.onGovernanceChainChanged,
      this.onGovernanceAccountChanged,
    );
    this.paymentIdUtils = new PaymentIdUtils();
    this.configProvider = new ConfigProvider(this.logUtils, config);
    this.linkUtils = new LinkUtils(this.contextProvider);
    this.internalProviderFactory = new InternalProviderFactory(
      this.configProvider,
    );
    this.gatewayConnectorProxyFactory = new GatewayConnectorProxyFactory(
      this.configProvider,
      this.contextProvider,
    );

    this.blockchainProvider = new EthersBlockchainProvider(
      this.contextProvider,
      this.configProvider,
      this.localStorageUtils,
      this.internalProviderFactory,
      this.logUtils,
    );

    this.contractFactory = new ContractFactory(this.blockchainProvider);

    this.browserNodeFactory = new BrowserNodeFactory(
      this.configProvider,
      this.logUtils,
    );

    this.blockchainTimeUtils = new BlockchainTimeUtils(
      this.blockchainProvider,
      this.timeUtils,
    );

    this.browserNodeProvider = new BrowserNodeProvider(
      this.configProvider,
      this.contextProvider,
      this.blockchainProvider,
      this.logUtils,
      this.localStorageUtils,
      this.browserNodeFactory,
    );

    this.ceramicUtils = new CeramicUtils(
      this.configProvider,
      this.contextProvider,
      this.browserNodeProvider,
      this.logUtils,
    );

    this.storageUtils = new StorageUtils(
      this.contextProvider,
      this.ceramicUtils,
      this.localStorageUtils,
      this.logUtils,
    );

    this.blockchainUtils = new EthersBlockchainUtils(
      this.blockchainProvider,
      this.configProvider,
    );
    this.vectorUtils = new VectorUtils(
      this.configProvider,
      this.contextProvider,
      this.browserNodeProvider,
      this.blockchainProvider,
      this.blockchainUtils,
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
      this.contextProvider,
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
      this.blockchainTimeUtils,
    );

    this.linkRepository = new LinkRepository(
      this.browserNodeProvider,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils,
      this.paymentUtils,
      this.linkUtils,
      this.timeUtils,
    );

    this.gatewayConnectorRepository = new GatewayConnectorRepository(
      this.storageUtils,
      this.gatewayConnectorProxyFactory,
      this.logUtils,
    );
    this.gatewayRegistrationRepository = new GatewayRegistrationRepository(
      this.blockchainProvider,
      this.ajaxUtils,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils,
      this.storageUtils,
      this.gatewayConnectorProxyFactory,
      this.logUtils,
    );
    this.messagingRepository = new NatsMessagingRepository(
      this.messagingProvider,
      this.configProvider,
    );

    this.routerRepository = new RouterRepository(
      this.blockchainUtils,
      this.blockchainProvider,
      this.configProvider,
    );

    this.governanceRepository = new GovernanceRepository(
      this.blockchainProvider,
      this.configProvider,
      this.logUtils,
    );

    this.registryRepository = new RegistryRepository(
      this.blockchainProvider,
      this.configProvider,
      this.logUtils,
    );

    this.tokenInformationRepository = new TokenInformationRepository(
      this.contractFactory,
      this.configProvider,
      this.logUtils,
    );

    this.paymentService = new PaymentService(
      this.linkRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.paymentRepository,
      this.gatewayConnectorRepository,
      this.gatewayRegistrationRepository,
      this.vectorUtils,
      this.paymentUtils,
      this.blockchainUtils,
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
    this.gatewayConnectorService = new GatewayConnectorService(
      this.gatewayConnectorRepository,
      this.gatewayRegistrationRepository,
      this.accountRepository,
      this.routerRepository,
      this.blockchainUtils,
      this.contextProvider,
      this.configProvider,
      this.blockchainProvider,
      this.logUtils,
    );
    this.governanceService = new GovernanceService(this.governanceRepository);
    this.registryService = new RegistryService(this.registryRepository);
    this.tokenInformationService = new TokenInformationService(
      this.tokenInformationRepository,
    );

    this.vectorAPIListener = new VectorAPIListener(
      this.browserNodeProvider,
      this.paymentService,
      this.vectorUtils,
      this.contextProvider,
      this.paymentUtils,
      this.logUtils,
    );

    this.gatewayConnectorListener = new GatewayConnectorListener(
      this.accountService,
      this.gatewayConnectorService,
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

    this.blockchainListener = new BlockchainListener(
      this.blockchainProvider,
      this.configProvider,
      this.contextProvider,
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
    EthereumAccountAddress[],
    BlockchainUnavailableError
  > {
    return this.accountService.getAccounts().mapErr((e) => {
      this.logUtils.error(e);
      return e;
    });
  }

  /**
   * Returns the (vector) pubId associated with this instance of HypernetCore.
   */
  public getPublicIdentifier(): ResultAsync<PublicIdentifier, never> {
    return this.contextProvider
      .getInitializedContext()
      .map((context) => {
        return context.publicIdentifier;
      })
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public getActiveStateChannels(): ResultAsync<
    ActiveStateChannel[],
    VectorError | BlockchainUnavailableError | PersistenceError
  > {
    return this.accountService.getActiveStateChannels().mapErr((e) => {
      this.logUtils.error(e);
      return e;
    });
  }

  public createStateChannel(
    routerPublicIdentifiers: PublicIdentifier[],
    chainId: ChainId,
  ): ResultAsync<
    ActiveStateChannel,
    BlockchainUnavailableError | VectorError | PersistenceError
  > {
    return this.accountService
      .createStateChannel(routerPublicIdentifiers, chainId)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  /**
   * Deposit funds into Hypernet Core.
   * @param assetAddress the Ethereum address of the token to deposit
   * @param amount the amount of the token to deposit
   */
  public depositFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  > {
    // console.log(`HypernetCore:depositFunds:assetAddress:${assetAddress}`)
    return this.accountService
      .depositFunds(channelAddress, assetAddress, amount)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  /**
   * Withdraw funds from Hypernet Core to a specified destination (Ethereum) address.
   * @param assetAddress the address of the token to withdraw
   * @param amount the amount of the token to withdraw
   * @param destinationAddress the (Ethereum) address to withdraw to
   */
  public withdrawFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAccountAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  > {
    return this.accountService
      .withdrawFunds(channelAddress, assetAddress, amount, destinationAddress)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  /**
   * Returns the current balances for this instance of Hypernet Core.
   */
  public getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | BlockchainUnavailableError
  > {
    return this.accountService.getBalances().mapErr((e) => {
      this.logUtils.error(e);
      return e;
    });
  }

  /**
   * Return all Hypernet Links.
   */
  public getLinks(): ResultAsync<HypernetLink[], VectorError | Error> {
    return this.linkService.getLinks().mapErr((e) => {
      this.logUtils.error(e);
      return e;
    });
  }

  /**
   * Return all *active* Hypernet Links.
   */
  public getActiveLinks(): ResultAsync<HypernetLink[], VectorError | Error> {
    return this.linkService.getLinks().mapErr((e) => {
      this.logUtils.error(e);
      return e;
    });
  }

  /**
   * Accepts the terms of a push payment, and puts up the stake/insurance transfer.
   * @param paymentId
   */
  public acceptOffer(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | TransferCreationError
    | VectorError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | PaymentStakeError
    | TransferResolutionError
    | AcceptPaymentError
    | InsufficientBalanceError
    | InvalidPaymentIdError
    | PaymentCreationError
    | NonFungibleRegistryContractError
  > {
    return this.paymentService.acceptOffer(paymentId).mapErr((e) => {
      this.logUtils.error(e);
      return e;
    });
  }

  /**
   * Pull funds for a given payment
   * @param paymentId the payment for which to pull funds from
   * @param amount the amount of funds to pull
   */
  public pullFunds(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<Payment, VectorError | Error> {
    return this.paymentService.pullFunds(paymentId, amount).mapErr((e) => {
      this.logUtils.error(e);
      return e;
    });
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
   * Initialize this instance of Hypernet Core
   * @param account: the ethereum account to initialize with
   */
  public initialize(): ResultAsync<
    void,
    | MessagingError
    | BlockchainUnavailableError
    | VectorError
    | RouterChannelUnknownError
    | GatewayConnectorError
    | GatewayValidationError
    | PersistenceError
    | ProxyError
    | InvalidPaymentError
    | InvalidParametersError
    | InvalidPaymentIdError
    | GovernanceSignerUnavailableError
    | TransferResolutionError
    | TransferCreationError
    | PaymentStakeError
    | PaymentFinalizeError
    | NonFungibleRegistryContractError
  > {
    if (this._initializeResult != null) {
      return this._initializeResult;
    }

    this.logUtils.debug(`Initializing Hypernet Protocol Core`);

    let context: HypernetContext;
    this._initializeResult = this.blockchainProvider
      .initialize()
      .andThen(() => {
        this.logUtils.debug("Getting Ethereum accounts");
        return ResultUtils.combine([
          this.contextProvider.getContext(),
          this.accountRepository.getAccounts(),
        ]);
      })
      .andThen((vals) => {
        context = vals[0];
        const accounts = vals[1];
        context.account = accounts[0];
        this.logUtils.debug(`Obtained accounts: ${accounts}`);
        return this.contextProvider.setContext(context);
      })
      .andThen(() => {
        return this.ceramicUtils.initialize();
      })
      .andThen(() => {
        return ResultUtils.combine([
          this.accountRepository.getPublicIdentifier(),
          this.accountRepository.getActiveStateChannels(),
          this.registryRepository.initializeReadOnly(),
          this.registryRepository.initializeForWrite(),
          this.governanceRepository.initializeReadOnly(),
          this.governanceRepository.initializeForWrite(),
          this.tokenInformationRepository.initialize(),
        ]);
      })
      .andThen((vals) => {
        const [publicIdentifier, activeStateChannels] = vals;

        this.logUtils.debug(
          `Obtained active state channels: ${activeStateChannels}`,
        );

        context.publicIdentifier = publicIdentifier;
        context.activeStateChannels = activeStateChannels;

        return this.contextProvider.setContext(context);
      })
      .andThen(() => {
        // By doing some active initialization, we can avoid whole categories
        // of errors occuring post-initialization (ie, runtime), which makes the
        // whole thing more reliable in operation.
        this.logUtils.debug("Initializing utilities");
        this.logUtils.debug("Initializing services");
        return this.gatewayConnectorService.initialize();
      })
      .andThen(() => {
        this.logUtils.debug("Initializing API listeners");
        // Initialize anything that wants an initialized context
        return ResultUtils.combine([
          this.vectorAPIListener.initialize(),
          this.gatewayConnectorListener.initialize(),
          this.messagingListener.initialize(),
          this.blockchainListener.initialize(),
        ]);
      })
      .andThen(() => {
        this.logUtils.debug("Initialized all internal services");
        return this.gatewayConnectorService.activateAuthorizedGateways();
      })
      // .andThen(() => {
      //   // Claim control
      //   return this.controlService.claimControl();
      // })
      .andThen(() => {
        // Get the config
        return this.configProvider.getConfig();
      })
      .andThen((config) => {
        // If we are in debug mode, we'll print the registered transfers out.
        if (config.debug) {
          return this.browserNodeProvider
            .getBrowserNode()
            .andThen((browserNode) => {
              return browserNode.getRegisteredTransfers(
                config.governanceChainId,
              );
            })
            .map((registeredTransfers) => {
              this.logUtils.debug("Registered Transfers");
              this.logUtils.debug(registeredTransfers);
            });
        }
        return okAsync(undefined);
      })
      .map(() => {
        if (this._initializePromiseResolve != null) {
          this._initializePromiseResolve();
        }
        this.logUtils.debug(`Hypernet Protocol core initialized successfully`);
        this._initialized = true;
      })
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
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
    return this.contextProvider
      .getInitializedContext()
      .andThen((context) => {
        return this.developmentService.mintTestToken(amount, context.account);
      })
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | PersistenceError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayAuthorizationDeniedError
    | GatewayActivationError
    | VectorError
    | NonFungibleRegistryContractError
  > {
    return this.gatewayConnectorService
      .authorizeGateway(gatewayUrl)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | PersistenceError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayActivationError
    | VectorError
    | GatewayValidationError
    | NonFungibleRegistryContractError
    | InactiveGatewayError
  > {
    return this.gatewayConnectorService
      .deauthorizeGateway(gatewayUrl)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.gatewayConnectorService
      .getAuthorizedGatewaysConnectorsStatus()
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public getGatewayTokenInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayTokenInfo[]>,
    | ProxyError
    | PersistenceError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayActivationError
    | VectorError
    | GatewayValidationError
    | NonFungibleRegistryContractError
    | InactiveGatewayError
  > {
    return this.gatewayConnectorService
      .getGatewayTokenInfo(gatewayUrls)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public getGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError> {
    return this.gatewayConnectorService
      .getGatewayRegistrationInfo(filter)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.gatewayConnectorService.getAuthorizedGateways().mapErr((e) => {
      this.logUtils.error(e);
      return e;
    });
  }

  public closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | GatewayConnectorError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | GatewayActivationError
    | GatewayValidationError
    | NonFungibleRegistryContractError
    | InactiveGatewayError
  > {
    return this.gatewayConnectorService
      .closeGatewayIFrame(gatewayUrl)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | GatewayConnectorError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | ProxyError
    | GatewayAuthorizationDeniedError
    | BalancesUnavailableError
    | GatewayActivationError
    | GatewayValidationError
    | NonFungibleRegistryContractError
    | InactiveGatewayError
  > {
    return this.gatewayConnectorService
      .displayGatewayIFrame(gatewayUrl)
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError> {
    return this.accountService
      .providePrivateCredentials(new PrivateCredentials(privateKey, mnemonic))
      .mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
  }

  public getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], HypernetGovernorContractError> {
    return this.governanceService.getProposals(pageNumber, pageSize);
  }

  public createProposal(
    name: string,
    symbol: string,
    owner: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceService.createProposal(
      name,
      symbol,
      owner,
      enumerable,
    );
  }

  public delegateVote(
    delegateAddress: EthereumAccountAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError> {
    return this.governanceService.delegateVote(delegateAddress, amount);
  }

  public getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceService.getProposalDetails(proposalId);
  }

  public castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceService.castVote(proposalId, support);
  }

  public getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAccountAddress,
  ): ResultAsync<ProposalVoteReceipt, HypernetGovernorContractError> {
    return this.governanceService.getProposalVotesReceipt(
      proposalId,
      voterAddress,
    );
  }

  public getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    Registry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistries(pageNumber, pageSize, sortOrder);
  }

  public getRegistryByName(
    registryNames: string[],
  ): ResultAsync<
    Map<string, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryByName(registryNames);
  }

  public getRegistryByAddress(
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryByAddress(registryAddresses);
  }

  public getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<
    Map<string, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryEntriesTotalCount(registryNames);
  }

  public getRegistryEntries(
    registryName: string,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryEntries(
      registryName,
      pageNumber,
      pageSize,
      sortOrder,
    );
  }

  public getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryEntryDetailByTokenId(
      registryName,
      tokenId,
    );
  }

  public queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceService.queueProposal(proposalId);
  }

  public cancelProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceService.cancelProposal(proposalId);
  }

  public executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceService.executeProposal(proposalId);
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: RegistryTokenId,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.updateRegistryEntryTokenURI(
      registryName,
      tokenId,
      registrationData,
    );
  }

  public updateRegistryEntryLabel(
    registryName: string,
    tokenId: RegistryTokenId,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.updateRegistryEntryLabel(
      registryName,
      tokenId,
      label,
    );
  }

  public getProposalsCount(): ResultAsync<
    number,
    HypernetGovernorContractError
  > {
    return this.governanceService.getProposalsCount();
  }

  public getProposalThreshold(): ResultAsync<
    number,
    HypernetGovernorContractError
  > {
    return this.governanceService.getProposalThreshold();
  }

  public getVotingPower(
    account: EthereumAccountAddress,
  ): ResultAsync<number, HypernetGovernorContractError | ERC20ContractError> {
    return this.governanceService.getVotingPower(account);
  }

  public getHyperTokenBalance(
    account: EthereumAccountAddress,
  ): ResultAsync<number, ERC20ContractError> {
    return this.governanceService.getHyperTokenBalance(account);
  }

  public getNumberOfRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getNumberOfRegistries();
  }

  public updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.updateRegistryParams(registryParams);
  }

  public createRegistryEntry(
    registryName: string,
    label: string,
    recipientAddress: EthereumAccountAddress,
    data: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ERC20ContractError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.createRegistryEntry(
      registryName,
      label,
      recipientAddress,
      data,
      tokenId,
    );
  }

  public transferRegistryEntry(
    registryName: string,
    tokenId: RegistryTokenId,
    transferToAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.transferRegistryEntry(
      registryName,
      tokenId,
      transferToAddress,
    );
  }

  public burnRegistryEntry(
    registryName: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.burnRegistryEntry(registryName, tokenId);
  }

  public createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError | ERC20ContractError> {
    return this.registryService.createRegistryByToken(
      name,
      symbol,
      registrarAddress,
      enumerable,
    );
  }

  public grantRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.grantRegistrarRole(registryName, address);
  }

  public revokeRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.revokeRegistrarRole(registryName, address);
  }

  public renounceRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryService.renounceRegistrarRole(registryName, address);
  }

  public provideProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError> {
    return this.accountService.provideProviderId(providerId);
  }
  
  public getTokenInformation(): ResultAsync<TokenInformation[], never> {
    return this.tokenInformationService.getTokenInformation();
  }

  public getTokenInformationForChain(
    chainId: ChainId,
  ): ResultAsync<TokenInformation[], never> {
    return this.tokenInformationService.getTokenInformationForChain(chainId);
  }

  public getTokenInformationByAddress(
    tokenAddress: EthereumContractAddress,
  ): ResultAsync<TokenInformation | null, never> {
    return this.tokenInformationService.getTokenInformationByAddress(
      tokenAddress,
    );
  }

  public getGovernanceChainId(): ResultAsync<ChainId, never> {
    return this.configProvider.getConfig().map((config) => {
      return config.governanceChainId;
    });
  }

  public getRegistryEntryByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
    index: number,
  ): ResultAsync<
    RegistryEntry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryEntryByOwnerAddress(
      registryName,
      ownerAddress,
      index,
    );
  }
}
