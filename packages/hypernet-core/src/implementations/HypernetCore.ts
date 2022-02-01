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
  RegistryModule,
  BatchModuleContractError,
  LazyMintModuleContractError,
  InitializeStatus,
  CoreInitializationErrors,
  LazyMintingSignature,
  IPFSUnavailableError,
  ChainInformation,
  chainConfig,
  GovernanceChainInformation,
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
  InjectedProviderService,
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
} from "@implementations/data";
import {
  TokenInformationRepository,
  ITokenInformationRepository,
} from "@hypernetlabs/common-repositories";
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
  IInjectedProviderService,
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
} from "@interfaces/data";
import { HypernetConfig, HypernetContext } from "@interfaces/objects";
import { errAsync, ok, okAsync, Result, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { StorageUtils } from "@implementations/data/utilities";
import {
  BrowserNodeProvider,
  ConfigProvider,
  ContextProvider,
  BlockchainProvider,
  LinkUtils,
  PaymentUtils,
  PaymentIdUtils,
  VectorUtils,
  EthersBlockchainUtils,
  CeramicUtils,
  MessagingProvider,
  BlockchainTimeUtils,
  DIDDataStoreProvider,
  IPFSUtils,
} from "@implementations/utilities";
import {
  GatewayConnectorProxyFactory,
  BrowserNodeFactory,
  InternalProviderFactory,
  NonFungibleRegistryContractFactory,
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
  IDIDDataStoreProvider,
  IIPFSUtils,
} from "@interfaces/utilities";
import {
  IBrowserNodeFactory,
  IInternalProviderFactory,
  IGatewayConnectorProxyFactory,
  INonFungibleRegistryContractFactory,
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
  public onGovernanceSignerUnavailable: Subject<GovernanceSignerUnavailableError>;

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
  protected ipfsUtils: IIPFSUtils;

  // Factories
  protected gatewayConnectorProxyFactory: IGatewayConnectorProxyFactory;
  protected browserNodeFactory: IBrowserNodeFactory;
  protected internalProviderFactory: IInternalProviderFactory;
  protected nonFungibleRegistryContractFactory: INonFungibleRegistryContractFactory;
  protected didDataStoreProvider: IDIDDataStoreProvider;

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
  protected injectedProviderService: IInjectedProviderService;

  // API
  protected vectorAPIListener: IVectorListener;
  protected gatewayConnectorListener: IGatewayConnectorListener;
  protected messagingListener: IMessagingListener;
  protected blockchainListener: IBlockchainListener;

  protected _registriesInitialized: Map<ChainId, boolean> = new Map();
  protected _registriesInitializePromise: Map<ChainId, Promise<void>> =
    new Map();
  protected _registriesInitializePromiseResolve: Map<ChainId, () => void> =
    new Map();

  protected _governanceInitialized: Map<ChainId, boolean> = new Map();
  protected _governanceInitializePromise: Map<ChainId, Promise<void>> =
    new Map();
  protected _governanceInitializePromiseResolve: Map<ChainId, () => void> =
    new Map();

  protected _paymentsInitialized: Map<ChainId, boolean> = new Map();
  protected _paymentsInitializePromise: Map<ChainId, Promise<void>> = new Map();
  protected _paymentsInitializePromiseResolve: Map<ChainId, () => void> =
    new Map();

  protected _inControl: boolean;

  /**
   * Returns an instance of HypernetCore.
   * @param network the network to attach to
   * @param config optional config, defaults to localhost/dev config
   */
  constructor(config?: Partial<HypernetConfig>) {
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
    this.onGovernanceSignerUnavailable = new Subject();

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
      this.onGovernanceSignerUnavailable,
      config?.defaultGovernanceChainId,
    );
    this.paymentIdUtils = new PaymentIdUtils();
    this.configProvider = new ConfigProvider(this.logUtils, config);
    this.linkUtils = new LinkUtils(this.contextProvider);
    this.internalProviderFactory = new InternalProviderFactory(
      this.contextProvider,
    );
    this.gatewayConnectorProxyFactory = new GatewayConnectorProxyFactory(
      this.configProvider,
      this.contextProvider,
    );

    this.blockchainProvider = new BlockchainProvider(
      this.contextProvider,
      this.configProvider,
      this.localStorageUtils,
      this.internalProviderFactory,
      this.logUtils,
    );

    this.nonFungibleRegistryContractFactory =
      new NonFungibleRegistryContractFactory(this.blockchainProvider);

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

    this.didDataStoreProvider = new DIDDataStoreProvider(
      this.configProvider,
      this.contextProvider,
      this.browserNodeProvider,
      this.logUtils,
    );

    this.ceramicUtils = new CeramicUtils(
      this.contextProvider,
      this.didDataStoreProvider,
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

    this.ipfsUtils = new IPFSUtils(
      this.configProvider,
      this.localStorageUtils,
      this.logUtils,
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
      this.contextProvider,
    );

    this.governanceRepository = new GovernanceRepository(
      this.blockchainProvider,
      this.contextProvider,
      this.logUtils,
      this.ipfsUtils,
    );

    this.registryRepository = new RegistryRepository(
      this.blockchainProvider,
      this.contextProvider,
      this.didDataStoreProvider,
      this.logUtils,
    );

    this.tokenInformationRepository = new TokenInformationRepository(
      this.nonFungibleRegistryContractFactory,
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
      this.blockchainTimeUtils,
      this.validationUtils,
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
    this.injectedProviderService = new InjectedProviderService(
      this.blockchainProvider,
      this.localStorageUtils,
      this.configProvider,
      this.contextProvider,
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
    chainConfig.forEach((chainInformation, chainId) => {
      this._registriesInitializePromise.set(
        chainId,
        new Promise((resolve) => {
          this._registriesInitializePromiseResolve.set(chainId, resolve);
        }),
      );

      this._governanceInitializePromise.set(
        chainId,
        new Promise((resolve) => {
          this._governanceInitializePromiseResolve.set(chainId, resolve);
        }),
      );

      this._paymentsInitializePromise.set(
        chainId,
        new Promise((resolve) => {
          this._paymentsInitializePromiseResolve.set(chainId, resolve);
        }),
      );
    });
  }

  /**
   * Returns the initialized status of this instance of Hypernet Core.
   */
  public initialized(chainId?: ChainId): ResultAsync<boolean, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen((vals) => {
      const [config, context] = vals;
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      if (
        config.governanceRequired == true &&
        config.paymentsRequired == true
      ) {
        return ok(
          this._governanceInitialized.get(governanceChainId) === true &&
            this._paymentsInitialized.get(governanceChainId) === true,
        );
      } else {
        return ok(
          this._governanceInitialized.get(governanceChainId) === true ||
            this._paymentsInitialized.get(governanceChainId) === true,
        );
      }
    });
  }

  public waitInitialized(chainId?: ChainId): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen((vals) => {
      const [config, context] = vals;
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      const governanceInitializePromise =
        this._governanceInitializePromise.get(governanceChainId);
      const paymentsInitializePromise =
        this._paymentsInitializePromise.get(governanceChainId);

      if (
        governanceInitializePromise == null ||
        paymentsInitializePromise == null
      ) {
        throw new Error("Chain Id is not supported in chain config!");
      }

      if (
        config.governanceRequired == true &&
        config.paymentsRequired == true
      ) {
        return ResultUtils.combine([
          ResultAsync.fromSafePromise<void, never>(governanceInitializePromise),
          ResultAsync.fromSafePromise<void, never>(paymentsInitializePromise),
        ]).map(() => {});
      } else {
        return ResultUtils.race([
          ResultAsync.fromSafePromise<void, never>(governanceInitializePromise),
          ResultAsync.fromSafePromise<void, never>(paymentsInitializePromise),
        ]).map(() => {});
      }
    });
  }

  public registriesInitialized(chainId?: ChainId): ResultAsync<boolean, never> {
    return this.contextProvider.getContext().map((context) => {
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      return this._registriesInitialized.get(governanceChainId) === true;
    });
  }

  public waitRegistriesInitialized(
    chainId?: ChainId,
  ): ResultAsync<void, never> {
    return this.contextProvider.getContext().andThen((context) => {
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      const registriesInitializePromise =
        this._registriesInitializePromise.get(governanceChainId);

      if (registriesInitializePromise == null) {
        throw new Error("Chain Id is not supported in chain config!");
      }

      return ResultAsync.fromSafePromise<void, never>(
        registriesInitializePromise,
      );
    });
  }

  public governanceInitialized(chainId?: ChainId): ResultAsync<boolean, never> {
    return this.contextProvider.getContext().map((context) => {
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      return this._governanceInitialized.get(governanceChainId) === true;
    });
  }

  public waitGovernanceInitialized(
    chainId?: ChainId,
  ): ResultAsync<void, never> {
    return this.contextProvider.getContext().andThen((context) => {
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      const governanceInitializePromise =
        this._governanceInitializePromise.get(governanceChainId);

      if (governanceInitializePromise == null) {
        throw new Error("Chain Id is not supported in chain config!");
      }

      return ResultAsync.fromSafePromise<void, never>(
        governanceInitializePromise,
      );
    });
  }

  public paymentsInitialized(chainId?: ChainId): ResultAsync<boolean, never> {
    return this.contextProvider.getContext().map((context) => {
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      return this._paymentsInitialized.get(governanceChainId) === true;
    });
  }

  public waitPaymentsInitialized(chainId?: ChainId): ResultAsync<void, never> {
    return this.contextProvider.getContext().andThen((context) => {
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      const paymentsInitializePromise =
        this._paymentsInitializePromise.get(governanceChainId);

      if (paymentsInitializePromise == null) {
        throw new Error("Chain Id is not supported in chain config!");
      }

      return ResultAsync.fromSafePromise<void, never>(
        paymentsInitializePromise,
      );
    });
  }

  /**
   * Initialize this instance of Hypernet Core
   */
  public initialize(
    chainId?: ChainId,
  ): ResultAsync<InitializeStatus, CoreInitializationErrors> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.initializeRegistries(chainId),
    ]).andThen((vals) => {
      const [config, context] = vals;
      this.logUtils.debug(`Initializing Hypernet Protocol Core`);

      return ResultUtils.combine([
        this.initializeGovernance(chainId).orElse((e) => {
          this.logUtils.error(e);
          if (config.governanceRequired === true) {
            return errAsync(e);
          } else {
            return okAsync(context.initializeStatus);
          }
        }),
        this.initializePayments(chainId).orElse((e) => {
          this.logUtils.error(e);
          if (config.paymentsRequired === true) {
            return errAsync(e);
          } else {
            return okAsync(context.initializeStatus);
          }
        }),
      ]).andThen(() => {
        return okAsync(context.initializeStatus);
      });
    });
  }

  private initializeBlockchainProvider(
    chainId?: ChainId,
  ): ResultAsync<void, BlockchainUnavailableError | InvalidParametersError> {
    // Initialize blockchain provider
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen((vals) => {
      const [context, config] = vals;
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      return this.blockchainProvider.initialize(chainId).andThen(() => {
        context.initializeStatus.blockchainProviderInitialized.set(
          governanceChainId,
          true,
        );

        if (chainId != null) {
          const chainInfo = config.chainInformation.get(chainId);

          if (!(chainInfo instanceof GovernanceChainInformation)) {
            return errAsync(
              new InvalidParametersError(
                "Provided Chain Id does not have chain information object",
              ),
            );
          }

          context.governanceChainInformation = chainInfo;
          context.onGovernanceChainChanged.next(governanceChainId);
        }

        return this.contextProvider
          .setContext(context)
          .andThen(() => {
            // Make sure that main provider network is set to the correct governance chain id
            return this.switchProviderNetwork(governanceChainId);
          })
          .andThen(() => {
            return this.blockchainListener.initialize();
          });
      });
    });
  }

  public initializeRegistries(
    chainId?: ChainId,
  ): ResultAsync<
    InitializeStatus,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
    | IPFSUnavailableError
  > {
    // Initialize registries contracts
    return this.initializeBlockchainProvider(chainId).andThen(() => {
      // It's important to retrieve the context after initializing blockchain provider
      return this.contextProvider.getContext().andThen((context) => {
        return ResultUtils.combine([
          this.configProvider.getConfig(),
          this.registryRepository.initializeReadOnly(),
          this.registryRepository.initializeForWrite().orElse((e) => {
            context.onGovernanceSignerUnavailable.next(
              new GovernanceSignerUnavailableError(
                e?.message || "Signer is not available",
                e,
              ),
            );
            return okAsync(undefined);
          }),
          this.initializeGovernance(chainId),
          this.tokenInformationRepository
            .initialize(context.governanceChainInformation.tokenRegistryAddress)
            .orElse((e) => {
              this.logUtils.error(e);
              return okAsync(undefined);
            }),
        ]).andThen((vals) => {
          const [config] = vals;
          const governanceChainId =
            chainId || context.governanceChainInformation.chainId;
          const registriesInitializePromiseResolve =
            this._registriesInitializePromiseResolve.get(governanceChainId);
          if (registriesInitializePromiseResolve != null) {
            registriesInitializePromiseResolve();
          }

          context.initializeStatus.registriesInitialized.set(
            governanceChainId,
            true,
          );
          this._registriesInitialized.set(governanceChainId, true);

          return this.contextProvider.setContext(context).andThen(() => {
            return okAsync(context.initializeStatus);
          });
        });
      });
    });
  }

  public initializeGovernance(
    chainId?: ChainId,
  ): ResultAsync<
    InitializeStatus,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
    | IPFSUnavailableError
  > {
    // Initialize governance contracts
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.initializeBlockchainProvider(chainId),
    ]).andThen((vals) => {
      const [context] = vals;
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      return ResultUtils.combine([
        this.ipfsUtils.initialize(),
        this.governanceRepository.initializeReadOnly(),
        this.governanceRepository.initializeForWrite().orElse((e) => {
          context.onGovernanceSignerUnavailable.next(
            new GovernanceSignerUnavailableError(
              e?.message || "Signer is not available",
              e,
            ),
          );
          return okAsync(undefined);
        }),
      ])
        .andThen(() => {
          const governanceInitializePromiseResolve =
            this._governanceInitializePromiseResolve.get(governanceChainId);
          if (governanceInitializePromiseResolve != null) {
            governanceInitializePromiseResolve();
          }

          context.initializeStatus.governanceInitialized.set(
            governanceChainId,
            true,
          );
          this._governanceInitialized.set(governanceChainId, true);

          return this.contextProvider.setContext(context);
        })
        .andThen(() => {
          return okAsync(context.initializeStatus);
        });
    });
  }

  public initializePayments(
    chainId?: ChainId,
  ): ResultAsync<InitializeStatus, CoreInitializationErrors> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.initializeBlockchainProvider(chainId),
    ]).andThen((vals) => {
      const [config, context] = vals;
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      return this.initializeRegistries(chainId)
        .andThen(() => {
          this.logUtils.debug("Getting Ethereum accounts");
          return this.accountRepository.getAccounts();
        })
        .andThen((accounts) => {
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
          this.logUtils.debug("Initializing payments utilities");
          this.logUtils.debug("Initializing payments services");
          return this.gatewayConnectorService.initialize();
        })
        .andThen(() => {
          this.logUtils.debug("Initializing API listeners");
          // Initialize anything that wants an initialized context
          return ResultUtils.combine([
            this.vectorAPIListener.initialize(),
            this.gatewayConnectorListener.initialize(),
            this.messagingListener.initialize(),
          ]);
        })
        .andThen(() => {
          this.logUtils.debug("Initialized all internal services");
          return this.gatewayConnectorService.activateAuthorizedGateways();
        })

        .andThen(() => {
          // If we are in debug mode, we'll print the registered transfers out.
          if (config.debug) {
            return this.browserNodeProvider
              .getBrowserNode()
              .andThen((browserNode) => {
                return browserNode.getRegisteredTransfers(
                  context.governanceChainInformation.chainId,
                );
              })
              .map((registeredTransfers) => {
                this.logUtils.debug("Registered Transfers");
                this.logUtils.debug(registeredTransfers);
              });
          }
          return okAsync(undefined);
        })
        .andThen(() => {
          const paymentsInitializePromiseResolve =
            this._paymentsInitializePromiseResolve.get(governanceChainId);
          if (paymentsInitializePromiseResolve != null) {
            paymentsInitializePromiseResolve();
          }

          context.initializeStatus.paymentsInitialized.set(
            governanceChainId,
            true,
          );
          this._paymentsInitialized.set(governanceChainId, true);

          return this.contextProvider.setContext(context);
        })
        .andThen(() => {
          return okAsync(context.initializeStatus);
        });
    });
  }

  public getInitializationStatus(): ResultAsync<InitializeStatus, never> {
    return this.contextProvider.getContext().map((context) => {
      return context.initializeStatus;
    });
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
  // TODO
  public async finalizePullPayment(
    paymentId: PaymentId,
    finalAmount: BigNumberString,
  ): Promise<HypernetLink> {
    throw new Error("Method not yet implemented.");
  }

  public repairPayments(
    paymentIds: PaymentId[],
  ): ResultAsync<
    void,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
    | InvalidPaymentIdError
    | ProxyError
  > {
    return this.paymentService.repairPayments(paymentIds).map(() => {});
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

  public getGatewayEntryList(): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    NonFungibleRegistryContractError
  > {
    return this.gatewayRegistrationRepository.getGatewayEntryList();
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

  public getBlockNumber(): ResultAsync<number, BlockchainUnavailableError> {
    return this.blockchainProvider.getLatestBlock().map((block) => {
      return block.number;
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
  ): ResultAsync<
    Proposal,
    IPFSUnavailableError | HypernetGovernorContractError
  > {
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

  public getProposalDescription(
    descriptionHash: string,
  ): ResultAsync<string, IPFSUnavailableError | HypernetGovernorContractError> {
    return this.governanceService.getProposalDescription(descriptionHash);
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
    newRegistryEntry: RegistryEntry,
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
      newRegistryEntry,
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
  ): ResultAsync<
    void,
    | RegistryFactoryContractError
    | ERC20ContractError
    | BlockchainUnavailableError
  > {
    return this.registryService.createRegistryByToken(
      name,
      symbol,
      registrarAddress,
      enumerable,
    );
  }

  public grantRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
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
    address: EthereumAccountAddress | EthereumContractAddress,
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
    address: EthereumAccountAddress | EthereumContractAddress,
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

  public getRegistryModules(): ResultAsync<
    RegistryModule[],
    NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryModules();
  }

  public createBatchRegistryEntry(
    registryName: string,
    newRegistryEntries: RegistryEntry[],
  ): ResultAsync<
    void,
    | BatchModuleContractError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
  > {
    return this.registryService.createBatchRegistryEntry(
      registryName,
      newRegistryEntries,
    );
  }

  public getRegistryEntryListByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryEntryListByOwnerAddress(
      registryName,
      ownerAddress,
    );
  }

  public getRegistryEntryListByUsername(
    registryName: string,
    username: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryService.getRegistryEntryListByUsername(
      registryName,
      username,
    );
  }

  public submitLazyMintSignature(
    registryName: string,
    tokenId: RegistryTokenId,
    ownerAddress: EthereumAccountAddress,
    registrationData: string,
  ): ResultAsync<
    void,
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | PersistenceError
    | VectorError
  > {
    return this.registryService.submitLazyMintSignature(
      registryName,
      tokenId,
      ownerAddress,
      registrationData,
    );
  }

  public retrieveLazyMintingSignatures(): ResultAsync<
    LazyMintingSignature[],
    PersistenceError | BlockchainUnavailableError | VectorError
  > {
    return this.registryService.retrieveLazyMintingSignatures();
  }

  public executeLazyMint(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    | InvalidParametersError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | LazyMintModuleContractError
    | NonFungibleRegistryContractError
  > {
    return this.registryService.executeLazyMint(lazyMintingSignature);
  }

  public revokeLazyMintSignature(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.registryService.revokeLazyMintSignature(lazyMintingSignature);
  }

  public retrieveChainInformationList(): ResultAsync<
    Map<ChainId, ChainInformation>,
    never
  > {
    return this.configProvider.getConfig().map((config) => {
      return config.chainInformation;
    });
  }

  public retrieveGovernanceChainInformation(): ResultAsync<
    ChainInformation,
    never
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map((vals) => {
      const [config, context] = vals;
      const governanceChainId =
        context.governanceChainInformation.chainId ||
        config.defaultGovernanceChainId;

      return config.chainInformation.get(governanceChainId) as ChainInformation;
    });
  }

  public initializeForChainId(
    chainId: ChainId,
  ): ResultAsync<void, CoreInitializationErrors> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen((vals) => {
      const [config, context] = vals;
      if (config.chainInformation.get(chainId) == null) {
        return errAsync(
          new InvalidParametersError(
            "Provided Chain Id does not have chain information object",
          ),
        );
      }

      let initializerList: ResultAsync<
        InitializeStatus,
        CoreInitializationErrors
      >[] = [];

      // Check if any of registries, governance or payments is initialized for the requested chain
      for (let initializeStatus of context.initializeStatus.registriesInitialized.values()) {
        if (initializeStatus === true) {
          initializerList.push(this.initializeRegistries(chainId));
          break;
        }
      }
      for (let initializeStatus of context.initializeStatus.governanceInitialized.values()) {
        if (initializeStatus === true) {
          initializerList.push(this.initializeGovernance(chainId));
          break;
        }
      }
      for (let initializeStatus of context.initializeStatus.paymentsInitialized.values()) {
        if (initializeStatus === true) {
          initializerList.push(this.initializePayments(chainId));
          break;
        }
      }

      return ResultUtils.combine(initializerList).andThen(() => {
        return this.switchProviderNetwork(chainId);
      });
    });
  }

  public switchProviderNetwork(
    chainId: ChainId,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this.contextProvider.getContext().andThen((context) => {
      return this.injectedProviderService
        .switchNetwork(chainId)
        .andThen(() => {
          console.log("network switchedddd");
          return this.blockchainProvider.setGovernanceSigner(chainId);
        })
        .orElse((e) => {
          const errorMessage =
            "Could not set Governance signer, switch to the correct network!";
          this.logUtils.error(errorMessage);
          context.onGovernanceSignerUnavailable.next(
            new GovernanceSignerUnavailableError(e?.message || errorMessage, e),
          );
          return okAsync(undefined);
        });
    });
  }

  public getMainProviderChainId(): ResultAsync<
    ChainId,
    BlockchainUnavailableError
  > {
    return this.blockchainProvider.getMainProviderChainId();
  }
}
