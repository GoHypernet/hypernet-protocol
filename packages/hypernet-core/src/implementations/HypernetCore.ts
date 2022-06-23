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
  IHypernetPayments,
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
  IHypernetGovernance,
  IHypernetRegistries,
  RegistryName,
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

import { RegistryUtils, StorageUtils } from "@implementations/data/utilities";
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
  RegistryFactoryContractFactory,
} from "@implementations/utilities/factory";
import { IRegistryUtils, IStorageUtils } from "@interfaces/data/utilities";
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
  IRegistryFactoryContractFactory,
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
  protected registryUtils: IRegistryUtils;
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
  protected registryFactoryContractFactory: IRegistryFactoryContractFactory;
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

    this.registryFactoryContractFactory = new RegistryFactoryContractFactory(
      this.contextProvider,
      this.blockchainProvider,
    );

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

    this.registryUtils = new RegistryUtils(
      this.registryFactoryContractFactory,
      this.contextProvider,
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
      this.registryUtils,
      this.gatewayConnectorProxyFactory,
      this.logUtils,
    );
    this.messagingRepository = new NatsMessagingRepository(
      this.messagingProvider,
      this.configProvider,
    );

    this.routerRepository = new RouterRepository(
      this.blockchainUtils,
      this.registryUtils,
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
      this.registryUtils,
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
    return this.contextProvider.getContext().andThen((context) => {
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      return ok(
        this._registriesInitialized.get(governanceChainId) === true ||
          this._paymentsInitialized.get(governanceChainId) === true ||
          this._governanceInitialized.get(governanceChainId) === true,
      );
    });
  }

  public waitInitialized(chainId?: ChainId): ResultAsync<void, never> {
    return this.contextProvider.getContext().andThen((context) => {
      const governanceChainId =
        chainId || context.governanceChainInformation.chainId;

      const registriesInitializePromise =
        this._registriesInitializePromise.get(governanceChainId);
      const governanceInitializePromise =
        this._governanceInitializePromise.get(governanceChainId);
      const paymentsInitializePromise =
        this._paymentsInitializePromise.get(governanceChainId);

      if (
        registriesInitializePromise == null ||
        governanceInitializePromise == null ||
        paymentsInitializePromise == null
      ) {
        throw new Error("Chain Id is not supported in chain config!");
      }

      return ResultUtils.race([
        ResultAsync.fromSafePromise<void, never>(registriesInitializePromise),
        ResultAsync.fromSafePromise<void, never>(governanceInitializePromise),
        ResultAsync.fromSafePromise<void, never>(paymentsInitializePromise),
      ]).map(() => {});
    });
  }

  /**
   * Initialize this instance of Hypernet Core
   */
  public initialize(
    chainId?: ChainId,
  ): ResultAsync<InitializeStatus, CoreInitializationErrors> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.registries.initializeRegistries(chainId),
    ]).andThen((vals) => {
      const [context] = vals;
      this.logUtils.debug(`Initializing Hypernet Protocol Core`);

      return ResultUtils.combine([
        this.governance.initializeGovernance(chainId),
        this.payments.initializePayments(chainId),
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

      return this.blockchainProvider
        .initialize(governanceChainId)
        .andThen(() => {
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

  public provideProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError> {
    return this.accountService.provideProviderId(providerId);
  }

  public rejectProviderIdRequest(): ResultAsync<void, never> {
    return this.blockchainProvider.rejectProviderIdRequest();
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
          initializerList.push(this.registries.initializeRegistries(chainId));
          break;
        }
      }
      for (let initializeStatus of context.initializeStatus.governanceInitialized.values()) {
        if (initializeStatus === true) {
          initializerList.push(this.governance.initializeGovernance(chainId));
          break;
        }
      }
      for (let initializeStatus of context.initializeStatus.paymentsInitialized.values()) {
        if (initializeStatus === true) {
          initializerList.push(this.payments.initializePayments(chainId));
          break;
        }
      }

      return ResultUtils.combine(initializerList)
        .andThen(() => {
          return this.switchProviderNetwork(chainId);
        })
        .map(() => {
          return this.localStorageUtils.setItem(
            "governanceChainId",
            chainId.toString(),
          );
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

  private initializeTokenInformation(
    context: HypernetContext,
  ): ResultAsync<
    void,
    NonFungibleRegistryContractError | RegistryFactoryContractError
  > {
    const paymentTokensName =
      context.governanceChainInformation.registryNames.paymentTokens;
    if (paymentTokensName == null) {
      throw new Error("paymentTokens name not found!");
    }

    return this.registryUtils
      .getRegistryNameAddress(paymentTokensName)
      .andThen((tokenRegistryAddress) => {
        return this.tokenInformationRepository.initialize(tokenRegistryAddress);
      });
  }

  public payments: IHypernetPayments = {
    paymentsInitialized: (chainId?: ChainId): ResultAsync<boolean, never> => {
      return this.contextProvider.getContext().map((context) => {
        const governanceChainId =
          chainId || context.governanceChainInformation.chainId;

        return this._paymentsInitialized.get(governanceChainId) === true;
      });
    },

    waitPaymentsInitialized: (chainId?: ChainId): ResultAsync<void, never> => {
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
    },

    initializePayments: (
      chainId?: ChainId,
    ): ResultAsync<InitializeStatus, CoreInitializationErrors> => {
      return ResultUtils.combine([
        this.configProvider.getConfig(),
        this.contextProvider.getContext(),
        this.initializeBlockchainProvider(chainId),
      ]).andThen((vals) => {
        const [config, context] = vals;
        const governanceChainId =
          chainId || context.governanceChainInformation.chainId;

        return this.registries
          .initializeRegistries(chainId)
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
            return this.ceramicUtils.initialize().orElse((e) => {
              this.logUtils.error(
                e.message || "Ceramic initialization failed!",
              );
              return okAsync(undefined);
            });
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
    },

    /**
     * Returns the (vector) pubId associated with this instance of HypernetCore.
     */
    getPublicIdentifier: (): ResultAsync<PublicIdentifier, never> => {
      return this.contextProvider
        .getInitializedContext()
        .map((context) => {
          return context.publicIdentifier;
        })
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    getActiveStateChannels: (): ResultAsync<
      ActiveStateChannel[],
      VectorError | BlockchainUnavailableError | PersistenceError
    > => {
      return this.accountService.getActiveStateChannels().mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
    },

    createStateChannel: (
      routerPublicIdentifiers: PublicIdentifier[],
      chainId: ChainId,
    ): ResultAsync<
      ActiveStateChannel,
      BlockchainUnavailableError | VectorError | PersistenceError
    > => {
      return this.accountService
        .createStateChannel(routerPublicIdentifiers, chainId)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    /**
     * Deposit funds into Hypernet Core.
     * @param assetAddress the Ethereum address of the token to deposit
     * @param amount the amount of the token to deposit
     */
    depositFunds: (
      channelAddress: EthereumContractAddress,
      assetAddress: EthereumContractAddress,
      amount: BigNumberString,
    ): ResultAsync<
      Balances,
      | BalancesUnavailableError
      | BlockchainUnavailableError
      | VectorError
      | Error
    > => {
      return this.accountService
        .depositFunds(channelAddress, assetAddress, amount)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    /**
     * Withdraw funds from Hypernet Core to a specified destination (Ethereum) address.
     * @param assetAddress the address of the token to withdraw
     * @param amount the amount of the token to withdraw
     * @param destinationAddress the (Ethereum) address to withdraw to
     */
    withdrawFunds: (
      channelAddress: EthereumContractAddress,
      assetAddress: EthereumContractAddress,
      amount: BigNumberString,
      destinationAddress: EthereumAccountAddress,
    ): ResultAsync<
      Balances,
      | BalancesUnavailableError
      | BlockchainUnavailableError
      | VectorError
      | Error
    > => {
      return this.accountService
        .withdrawFunds(channelAddress, assetAddress, amount, destinationAddress)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    /**
     * Returns the current balances for this instance of Hypernet Core.
     */
    getBalances: (): ResultAsync<
      Balances,
      BalancesUnavailableError | VectorError | BlockchainUnavailableError
    > => {
      return this.accountService.getBalances().mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
    },

    /**
     * Return all Hypernet Links.
     */
    getLinks: (): ResultAsync<HypernetLink[], VectorError | Error> => {
      return this.linkService.getLinks().mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
    },

    /**
     * Return all *active* Hypernet Links.
     */
    getActiveLinks: (): ResultAsync<HypernetLink[], VectorError | Error> => {
      return this.linkService.getLinks().mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
    },

    /**
     * Accepts the terms of a push payment, and puts up the stake/insurance transfer.
     * @param paymentId
     */
    acceptOffer: (
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
      | RegistryFactoryContractError
    > => {
      return this.paymentService.acceptOffer(paymentId).mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
    },

    /**
     * Pull funds for a given payment
     * @param paymentId the payment for which to pull funds from
     * @param amount the amount of funds to pull
     */
    pullFunds: (
      paymentId: PaymentId,
      amount: BigNumberString,
    ): ResultAsync<Payment, VectorError | Error> => {
      return this.paymentService.pullFunds(paymentId, amount).mapErr((e) => {
        this.logUtils.error(e);
        return e;
      });
    },

    /**
     * Finalize a pull-payment.
     */
    // TODO
    finalizePullPayment: (
      paymentId: PaymentId,
      finalAmount: BigNumberString,
    ): Promise<HypernetLink> => {
      throw new Error("Method not yet implemented.");
    },

    repairPayments: (
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
    > => {
      return this.paymentService.repairPayments(paymentIds).map(() => {});
    },

    /**
     * Mints the test token to the Ethereum address associated with the Core account.
     * @param amount the amount of test token to mint
     */
    mintTestToken: (
      amount: BigNumberString,
    ): ResultAsync<void, BlockchainUnavailableError> => {
      return this.contextProvider
        .getInitializedContext()
        .andThen((context) => {
          return this.developmentService.mintTestToken(amount, context.account);
        })
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    authorizeGateway: (
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
      | RegistryFactoryContractError
    > => {
      return this.gatewayConnectorService
        .authorizeGateway(gatewayUrl)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    deauthorizeGateway: (
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
      | RegistryFactoryContractError
    > => {
      return this.gatewayConnectorService
        .deauthorizeGateway(gatewayUrl)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    getAuthorizedGatewaysConnectorsStatus: (): ResultAsync<
      Map<GatewayUrl, boolean>,
      PersistenceError | VectorError | BlockchainUnavailableError
    > => {
      return this.gatewayConnectorService
        .getAuthorizedGatewaysConnectorsStatus()
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    getGatewayTokenInfo: (
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
      | RegistryFactoryContractError
    > => {
      return this.gatewayConnectorService
        .getGatewayTokenInfo(gatewayUrls)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    getGatewayRegistrationInfo: (
      filter?: GatewayRegistrationFilter,
    ): ResultAsync<GatewayRegistrationInfo[], PersistenceError> => {
      return this.gatewayConnectorService
        .getGatewayRegistrationInfo(filter)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    getGatewayEntryList: (): ResultAsync<
      Map<GatewayUrl, GatewayRegistrationInfo>,
      NonFungibleRegistryContractError | RegistryFactoryContractError
    > => {
      return this.gatewayRegistrationRepository.getGatewayEntryList();
    },

    getAuthorizedGateways: (): ResultAsync<
      Map<GatewayUrl, Signature>,
      PersistenceError | VectorError | BlockchainUnavailableError
    > => {
      return this.gatewayConnectorService
        .getAuthorizedGateways()
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    getTokenInformation: (): ResultAsync<TokenInformation[], never> => {
      return this.tokenInformationService.getTokenInformation();
    },

    getTokenInformationForChain: (
      chainId: ChainId,
    ): ResultAsync<TokenInformation[], never> => {
      return this.tokenInformationService.getTokenInformationForChain(chainId);
    },

    getTokenInformationByAddress: (
      tokenAddress: EthereumContractAddress,
    ): ResultAsync<TokenInformation | null, never> => {
      return this.tokenInformationService.getTokenInformationByAddress(
        tokenAddress,
      );
    },

    closeGatewayIFrame: (
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
      | RegistryFactoryContractError
    > => {
      return this.gatewayConnectorService
        .closeGatewayIFrame(gatewayUrl)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },

    displayGatewayIFrame: (
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
      | RegistryFactoryContractError
    > => {
      return this.gatewayConnectorService
        .displayGatewayIFrame(gatewayUrl)
        .mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
    },
  };

  public governance: IHypernetGovernance = {
    governanceInitialized: (chainId?: ChainId): ResultAsync<boolean, never> => {
      return this.contextProvider.getContext().map((context) => {
        const governanceChainId =
          chainId || context.governanceChainInformation.chainId;

        return this._governanceInitialized.get(governanceChainId) === true;
      });
    },

    waitGovernanceInitialized: (
      chainId?: ChainId,
    ): ResultAsync<void, never> => {
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
    },

    initializeGovernance: (
      chainId?: ChainId,
    ): ResultAsync<
      InitializeStatus,
      | GovernanceSignerUnavailableError
      | BlockchainUnavailableError
      | InvalidParametersError
      | IPFSUnavailableError
    > => {
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
    },

    getProposals: (
      pageNumber: number,
      pageSize: number,
    ): ResultAsync<Proposal[], HypernetGovernorContractError> => {
      return this.governanceService.getProposals(pageNumber, pageSize);
    },

    createProposal: (
      name: string,
      symbol: string,
      owner: EthereumAccountAddress,
      enumerable: boolean,
    ): ResultAsync<
      Proposal,
      IPFSUnavailableError | HypernetGovernorContractError
    > => {
      return this.governanceService.createProposal(
        name,
        symbol,
        owner,
        enumerable,
      );
    },

    delegateVote: (
      delegateAddress: EthereumAccountAddress,
      amount: number | null,
    ): ResultAsync<void, ERC20ContractError> => {
      return this.governanceService.delegateVote(delegateAddress, amount);
    },

    getProposalDetails: (
      proposalId: string,
    ): ResultAsync<Proposal, HypernetGovernorContractError> => {
      return this.governanceService.getProposalDetails(proposalId);
    },

    getProposalDescription: (
      descriptionHash: string,
    ): ResultAsync<
      string,
      IPFSUnavailableError | HypernetGovernorContractError
    > => {
      return this.governanceService.getProposalDescription(descriptionHash);
    },

    castVote: (
      proposalId: string,
      support: EProposalVoteSupport,
    ): ResultAsync<Proposal, HypernetGovernorContractError> => {
      return this.governanceService.castVote(proposalId, support);
    },

    getProposalVotesReceipt: (
      proposalId: string,
      voterAddress: EthereumAccountAddress,
    ): ResultAsync<ProposalVoteReceipt, HypernetGovernorContractError> => {
      return this.governanceService.getProposalVotesReceipt(
        proposalId,
        voterAddress,
      );
    },

    getProposalsCount: (): ResultAsync<
      number,
      HypernetGovernorContractError
    > => {
      return this.governanceService.getProposalsCount();
    },

    getProposalThreshold: (): ResultAsync<
      number,
      HypernetGovernorContractError
    > => {
      return this.governanceService.getProposalThreshold();
    },

    getVotingPower: (
      account: EthereumAccountAddress,
    ): ResultAsync<
      number,
      HypernetGovernorContractError | ERC20ContractError
    > => {
      return this.governanceService.getVotingPower(account);
    },

    getHyperTokenBalance: (
      account: EthereumAccountAddress,
    ): ResultAsync<number, ERC20ContractError> => {
      return this.governanceService.getHyperTokenBalance(account);
    },

    queueProposal: (
      proposalId: string,
    ): ResultAsync<Proposal, HypernetGovernorContractError> => {
      return this.governanceService.queueProposal(proposalId);
    },

    cancelProposal: (
      proposalId: string,
    ): ResultAsync<Proposal, HypernetGovernorContractError> => {
      return this.governanceService.cancelProposal(proposalId);
    },

    executeProposal: (
      proposalId: string,
    ): ResultAsync<Proposal, HypernetGovernorContractError> => {
      return this.governanceService.executeProposal(proposalId);
    },
  };

  public registries: IHypernetRegistries = {
    registriesInitialized: (chainId?: ChainId): ResultAsync<boolean, never> => {
      return this.contextProvider.getContext().map((context) => {
        const governanceChainId =
          chainId || context.governanceChainInformation.chainId;

        return this._registriesInitialized.get(governanceChainId) === true;
      });
    },

    waitRegistriesInitialized: (
      chainId?: ChainId,
    ): ResultAsync<void, never> => {
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
    },

    initializeRegistries: (
      chainId?: ChainId,
    ): ResultAsync<
      InitializeStatus,
      | GovernanceSignerUnavailableError
      | BlockchainUnavailableError
      | InvalidParametersError
      | IPFSUnavailableError
      | RegistryFactoryContractError
      | ProxyError
    > => {
      // Initialize registries contracts
      return this.initializeBlockchainProvider(chainId).andThen(() => {
        // It's important to retrieve the context after initializing blockchain provider
        return this.contextProvider.getContext().andThen((context) => {
          return ResultUtils.combine([
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
            this.registryUtils.initializeRegistryNameAddresses(),
            this.initializeTokenInformation(context).orElse((e) => {
              this.logUtils.error(e);
              return okAsync(undefined);
            }),
          ]).andThen(() => {
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
    },

    getRegistries: (
      pageNumber: number,
      pageSize: number,
      sortOrder: ERegistrySortOrder,
    ): ResultAsync<
      Registry[],
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistries(
        pageNumber,
        pageSize,
        sortOrder,
      );
    },

    getRegistryByName: (
      registryNames: RegistryName[],
    ): ResultAsync<
      Map<RegistryName, Registry>,
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistryByName(registryNames);
    },

    getRegistryByAddress: (
      registryAddresses: EthereumContractAddress[],
    ): ResultAsync<
      Map<EthereumContractAddress, Registry>,
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistryByAddress(registryAddresses);
    },

    getRegistryEntriesTotalCount: (
      registryNames: RegistryName[],
    ): ResultAsync<
      Map<RegistryName, number>,
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistryEntriesTotalCount(registryNames);
    },

    getRegistryEntries: (
      registryName: RegistryName,
      pageNumber: number,
      pageSize: number,
      sortOrder: ERegistrySortOrder,
    ): ResultAsync<
      RegistryEntry[],
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistryEntries(
        registryName,
        pageNumber,
        pageSize,
        sortOrder,
      );
    },

    getRegistryEntryDetailByTokenId: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
    ): ResultAsync<
      RegistryEntry,
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistryEntryDetailByTokenId(
        registryName,
        tokenId,
      );
    },

    updateRegistryEntryTokenURI: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
      registrationData: string,
    ): ResultAsync<
      RegistryEntry,
      | BlockchainUnavailableError
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | RegistryPermissionError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.updateRegistryEntryTokenURI(
        registryName,
        tokenId,
        registrationData,
      );
    },

    updateRegistryEntryLabel: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
      label: string,
    ): ResultAsync<
      RegistryEntry,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.updateRegistryEntryLabel(
        registryName,
        tokenId,
        label,
      );
    },

    getNumberOfRegistries: (): ResultAsync<
      number,
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getNumberOfRegistries();
    },

    updateRegistryParams: (
      registryParams: RegistryParams,
    ): ResultAsync<
      Registry,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.updateRegistryParams(registryParams);
    },

    createRegistryEntry: (
      registryName: RegistryName,
      newRegistryEntry: RegistryEntry,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | ERC20ContractError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.createRegistryEntry(
        registryName,
        newRegistryEntry,
      );
    },

    transferRegistryEntry: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
      transferToAddress: EthereumAccountAddress,
    ): ResultAsync<
      RegistryEntry,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.transferRegistryEntry(
        registryName,
        tokenId,
        transferToAddress,
      );
    },

    burnRegistryEntry: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.burnRegistryEntry(registryName, tokenId);
    },

    createRegistryByToken: (
      name: string,
      symbol: string,
      registrarAddress: EthereumAccountAddress,
      enumerable: boolean,
    ): ResultAsync<
      void,
      | RegistryFactoryContractError
      | ERC20ContractError
      | BlockchainUnavailableError
    > => {
      return this.registryService.createRegistryByToken(
        name,
        symbol,
        registrarAddress,
        enumerable,
      );
    },

    grantRegistrarRole: (
      registryName: RegistryName,
      address: EthereumAccountAddress | EthereumContractAddress,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.grantRegistrarRole(registryName, address);
    },

    revokeRegistrarRole: (
      registryName: RegistryName,
      address: EthereumAccountAddress | EthereumContractAddress,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.revokeRegistrarRole(registryName, address);
    },

    renounceRegistrarRole: (
      registryName: RegistryName,
      address: EthereumAccountAddress | EthereumContractAddress,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | GovernanceSignerUnavailableError
    > => {
      return this.registryService.renounceRegistrarRole(registryName, address);
    },

    getRegistryEntryByOwnerAddress: (
      registryName: RegistryName,
      ownerAddress: EthereumAccountAddress,
      index: number,
    ): ResultAsync<
      RegistryEntry | null,
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistryEntryByOwnerAddress(
        registryName,
        ownerAddress,
        index,
      );
    },

    getRegistryModules: (): ResultAsync<
      RegistryModule[],
      NonFungibleRegistryContractError | RegistryFactoryContractError
    > => {
      return this.registryService.getRegistryModules();
    },

    createBatchRegistryEntry: (
      registryName: RegistryName,
      newRegistryEntries: RegistryEntry[],
    ): ResultAsync<
      void,
      | BatchModuleContractError
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
    > => {
      return this.registryService.createBatchRegistryEntry(
        registryName,
        newRegistryEntries,
      );
    },

    getRegistryEntryListByOwnerAddress: (
      registryName: RegistryName,
      ownerAddress: EthereumAccountAddress,
    ): ResultAsync<
      RegistryEntry[],
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistryEntryListByOwnerAddress(
        registryName,
        ownerAddress,
      );
    },

    getRegistryEntryListByUsername: (
      registryName: RegistryName,
      username: EthereumAccountAddress,
    ): ResultAsync<
      RegistryEntry[],
      RegistryFactoryContractError | NonFungibleRegistryContractError
    > => {
      return this.registryService.getRegistryEntryListByUsername(
        registryName,
        username,
      );
    },

    submitLazyMintSignature: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
      chainId: Number,
      nonce: Number,
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
    > => {
      return this.registryService.submitLazyMintSignature(
        registryName,
        tokenId,
        chainId,
        nonce,
        ownerAddress,
        registrationData,
      );
    },

    retrieveLazyMintingSignatures: (): ResultAsync<
      LazyMintingSignature[],
      PersistenceError | BlockchainUnavailableError | VectorError
    > => {
      return this.registryService.retrieveLazyMintingSignatures();
    },

    executeLazyMint: (
      lazyMintingSignature: LazyMintingSignature,
    ): ResultAsync<
      void,
      | InvalidParametersError
      | PersistenceError
      | VectorError
      | BlockchainUnavailableError
      | LazyMintModuleContractError
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
    > => {
      return this.registryService.executeLazyMint(lazyMintingSignature);
    },

    revokeLazyMintSignature: (
      lazyMintingSignature: LazyMintingSignature,
    ): ResultAsync<
      void,
      PersistenceError | VectorError | BlockchainUnavailableError
    > => {
      return this.registryService.revokeLazyMintSignature(lazyMintingSignature);
    },
  };
}
