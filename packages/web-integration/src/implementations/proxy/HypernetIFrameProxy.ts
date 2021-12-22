import {
  Balances,
  ControlClaim,
  HypernetLink,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  Payment,
  PaymentId,
  GatewayUrl,
  Signature,
  AcceptPaymentError,
  BlockchainUnavailableError,
  VectorError,
  BalancesUnavailableError,
  InsufficientBalanceError,
  GatewayValidationError,
  PersistenceError,
  GatewayConnectorError,
  ProxyError,
  InvalidParametersError,
  IHypernetCore,
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
  RegistryFactoryContractError,
  NonFungibleRegistryContractError,
  HypernetGovernorContractError,
  ERC20ContractError,
  InvalidPaymentError,
  TransferCreationError,
  PaymentStakeError,
  TransferResolutionError,
  EthereumAccountAddress,
  EthereumContractAddress,
  ProviderId,
  TokenInformation,
  RegistryModule,
  BatchModuleContractError,
  InvalidPaymentIdError,
  InitializeStatus,
} from "@hypernetlabs/objects";
import { ParentProxy } from "@hypernetlabs/utils";
import { Result, ResultAsync, ok, okAsync } from "neverthrow";
import { Subject } from "rxjs";

export default class HypernetIFrameProxy
  extends ParentProxy
  implements IHypernetCore
{
  protected coreInitialized = false;
  protected isInControl = false;
  protected waitInitializedPromise: Promise<void>;
  protected _handshakePromise: Promise<void> | null;
  protected coreGovernanceInitialized = false;
  protected waitGovernanceInitializedPromise: Promise<void>;
  protected governanceInitializePromiseResolve: (() => void) | null;
  protected corePaymentsInitialized = false;
  protected waitPaymentsInitializedPromise: Promise<void>;
  protected paymentsInitializePromiseResolve: (() => void) | null;

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected iframeName: string,
  ) {
    super(element, iframeUrl, iframeName);

    this._handshakePromise = null;

    this.onControlClaimed = new Subject();
    this.onControlYielded = new Subject();
    this.onPushPaymentSent = new Subject();
    this.onPullPaymentSent = new Subject();
    this.onPushPaymentReceived = new Subject();
    this.onPullPaymentReceived = new Subject();
    this.onPushPaymentUpdated = new Subject();
    this.onPullPaymentUpdated = new Subject();
    this.onPushPaymentDelayed = new Subject();
    this.onPullPaymentDelayed = new Subject();
    this.onPushPaymentCanceled = new Subject();
    this.onPullPaymentCanceled = new Subject();
    this.onBalancesChanged = new Subject<Balances>();
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
    this.onInitializationRequired = new Subject();
    this.onPrivateCredentialsRequested = new Subject();
    this.onWalletConnectOptionsDisplayRequested = new Subject();
    this.onStateChannelCreated = new Subject();
    this.onChainConnected = new Subject();
    this.onGovernanceChainConnected = new Subject();
    this.onChainChanged = new Subject();
    this.onAccountChanged = new Subject();
    this.onGovernanceChainChanged = new Subject();
    this.onGovernanceAccountChanged = new Subject();

    this.governanceInitializePromiseResolve = null;
    this.waitGovernanceInitializedPromise = new Promise((resolve) => {
      this.governanceInitializePromiseResolve = resolve;
    });

    this.paymentsInitializePromiseResolve = null;
    this.waitPaymentsInitializedPromise = new Promise((resolve) => {
      this.paymentsInitializePromiseResolve = resolve;
    });

    // Initialize the promise that we'll use to monitor the core
    // initialization status. The iframe will emit an event "initialized"
    // once the core is initialized, we'll use that to resolve this promise.
    this.waitInitializedPromise = new Promise<void>((resolve) => {
      this._handshakePromise = this.handshake.then((child) => {
        // Subscribe to the message streams from the iframe,
        // and convert them back to RXJS Subjects.
        child.on("onControlClaimed", (data: ControlClaim) => {
          this.isInControl = true;
          this.onControlClaimed.next(data);
        });

        child.on("onControlYielded", (data: ControlClaim) => {
          this.isInControl = false;
          this.onControlYielded.next(data);
        });

        child.on("onPushPaymentSent", (data: PushPayment) => {
          this.onPushPaymentSent.next(data);
        });

        child.on("onPullPaymentSent", (data: PullPayment) => {
          this.onPullPaymentSent.next(data);
        });

        child.on("onPushPaymentReceived", (data: PushPayment) => {
          this.onPushPaymentReceived.next(data);
        });

        child.on("onPullPaymentReceived", (data: PullPayment) => {
          this.onPullPaymentReceived.next(data);
        });

        child.on("onPushPaymentUpdated", (data: PushPayment) => {
          this.onPushPaymentUpdated.next(data);
        });

        child.on("onPullPaymentUpdated", (data: PullPayment) => {
          this.onPullPaymentUpdated.next(data);
        });

        child.on("onPushPaymentDelayed", (data: PushPayment) => {
          this.onPushPaymentDelayed.next(data);
        });

        child.on("onPullPaymentDelayed", (data: PullPayment) => {
          this.onPullPaymentDelayed.next(data);
        });

        child.on("onPushPaymentCanceled", (data: PushPayment) => {
          this.onPushPaymentCanceled.next(data);
        });

        child.on("onPullPaymentCanceled", (data: PullPayment) => {
          this.onPullPaymentCanceled.next(data);
        });

        child.on("onBalancesChanged", (data: Balances) => {
          this.onBalancesChanged.next(data);
        });

        child.on("onCeramicAuthenticationStarted", () => {
          this._displayCoreIFrame();

          this.onCeramicAuthenticationStarted.next();
        });

        child.on("onCeramicAuthenticationSucceeded", () => {
          this._closeCoreIFrame();

          this.onCeramicAuthenticationSucceeded.next();
        });

        child.on("onCeramicFailed", () => {
          this.onCeramicFailed.next();
        });

        child.on("onGatewayAuthorized", (data: GatewayUrl) => {
          this.onGatewayAuthorized.next(data);
        });

        child.on("onGatewayDeauthorizationStarted", (data: GatewayUrl) => {
          this.onGatewayDeauthorizationStarted.next(data);
        });

        child.on("onAuthorizedGatewayUpdated", (data: GatewayUrl) => {
          this.onAuthorizedGatewayUpdated.next(data);
        });

        child.on("onAuthorizedGatewayActivationFailed", (data: GatewayUrl) => {
          this.onAuthorizedGatewayActivationFailed.next(data);
        });

        child.on("onStateChannelCreated", (data: ActiveStateChannel) => {
          this.onStateChannelCreated.next(data);
        });

        child.on("onChainConnected", (data: ChainId) => {
          this.onChainConnected.next(data);
        });

        child.on("onGovernanceChainConnected", (data: ChainId) => {
          this.onGovernanceChainConnected.next(data);
        });

        child.on("onChainChanged", (data: ChainId) => {
          this.onChainChanged.next(data);
        });

        child.on("onAccountChanged", (data: EthereumAccountAddress) => {
          this.onAccountChanged.next(data);
        });

        child.on("onGovernanceChainChanged", (data: ChainId) => {
          this.onGovernanceChainChanged.next(data);
        });

        child.on(
          "onGovernanceAccountChanged",
          (data: EthereumAccountAddress) => {
            this.onGovernanceAccountChanged.next(data);
          },
        );

        // Setup a listener for the "initialized" event.
        child.on("initialized", () => {
          // Resolve waitInitialized
          resolve();

          // And mark us as initialized
          this.coreInitialized = true;
        });

        // Setup a listener for the "governanceInitialized" event.
        child.on("governanceInitialized", () => {
          // Resolve waitGovernanceInitialized
          if (this.governanceInitializePromiseResolve != null) {
            this.governanceInitializePromiseResolve();
          }

          // And mark us as governance initialized
          this.coreGovernanceInitialized = true;
        });

        // Setup a listener for the "paymentsInitialized" event.
        child.on("paymentsInitialized", () => {
          // Resolve waitGovernanceInitialized
          if (this.paymentsInitializePromiseResolve != null) {
            this.paymentsInitializePromiseResolve();
          }

          // And mark us as payments initialized
          this.corePaymentsInitialized = true;
        });

        child.on("onGatewayIFrameDisplayRequested", (data: GatewayUrl) => {
          this._displayCoreIFrame();

          this.onGatewayIFrameDisplayRequested.next(data);
        });

        child.on("onGatewayIFrameCloseRequested", (data: GatewayUrl) => {
          this._closeCoreIFrame();

          this.onGatewayIFrameCloseRequested.next(data);
        });

        child.on("onCoreIFrameDisplayRequested", () => {
          this._displayCoreIFrame();

          this.onCoreIFrameDisplayRequested.next();
        });

        child.on("onCoreIFrameCloseRequested", () => {
          this._closeCoreIFrame();

          this.onCoreIFrameCloseRequested.next();
        });

        child.on("onInitializationRequired", () => {
          this.onInitializationRequired.next();
        });

        child.on("onPrivateCredentialsRequested", () => {
          this.onPrivateCredentialsRequested.next();
        });

        child.on("onWalletConnectOptionsDisplayRequested", () => {
          this.onWalletConnectOptionsDisplayRequested.next();
        });
      });
    });
  }

  public finalizePullPayment(
    _paymentId: PaymentId,
    _finalAmount: BigNumberString,
  ): Promise<HypernetLink> {
    throw new Error("Method not implemented.");
  }

  public initialized(): ResultAsync<boolean, never> {
    // If the child is not initialized, there is no way the core can be.
    if (this.child == null) {
      return okAsync(false);
    }

    // Return the current known status of coreInitialized. We request this
    // information as soon as the child is up.
    return okAsync(this.coreInitialized);
  }

  public waitInitialized(): ResultAsync<void, never> {
    return ResultAsync.fromSafePromise(this.waitInitializedPromise);
  }

  public governanceInitialized(): Result<boolean, never> {
    if (this.child == null) {
      return ok(false);
    }

    return ok(this.coreGovernanceInitialized);
  }

  public waitGovernanceInitialized(): ResultAsync<void, never> {
    return ResultAsync.fromSafePromise(this.waitGovernanceInitializedPromise);
  }

  public paymentsInitialized(): Result<boolean, never> {
    if (this.child == null) {
      return ok(false);
    }

    return ok(this.corePaymentsInitialized);
  }

  public waitPaymentsInitialized(): ResultAsync<void, never> {
    return ResultAsync.fromSafePromise(this.waitPaymentsInitializedPromise);
  }

  public inControl(): Result<boolean, never> {
    // If the child is not initialized, there is no way the core can be.
    if (this.child == null) {
      return ok(false);
    }

    // Return the current known status of inControl.
    return ok(this.isInControl);
  }

  public getEthereumAccounts(): ResultAsync<
    EthereumAccountAddress[],
    BlockchainUnavailableError | ProxyError
  > {
    return this._createCall("getEthereumAccounts", null);
  }

  public initialize(): ResultAsync<
    InitializeStatus,
    | MessagingError
    | BlockchainUnavailableError
    | VectorError
    | RouterChannelUnknownError
    | GatewayConnectorError
    | GatewayValidationError
    | ProxyError
  > {
    return this._createCall("initialize", null);
  }

  public getPublicIdentifier(): ResultAsync<PublicIdentifier, ProxyError> {
    return this._createCall("getPublicIdentifier", null);
  }

  public getActiveStateChannels(): ResultAsync<
    ActiveStateChannel[],
    VectorError | BlockchainUnavailableError | PersistenceError | ProxyError
  > {
    return this._createCall("getActiveStateChannels", null);
  }

  public createStateChannel(
    routerPublicIdentifiers: PublicIdentifier[],
    chainId: ChainId,
  ): ResultAsync<
    ActiveStateChannel,
    VectorError | BlockchainUnavailableError | PersistenceError | ProxyError
  > {
    return this._createCall("createStateChannel", {
      routerPublicIdentifiers,
      chainId,
    });
  }

  public depositFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  > {
    return this._createCall("depositFunds", {
      channelAddress,
      assetAddress,
      amount: amount,
    });
  }

  public withdrawFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAccountAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  > {
    return this._createCall("withdrawFunds", {
      channelAddress,
      assetAddress,
      amount: amount,
      destinationAddress,
    });
  }

  public getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | ProxyError
  > {
    return this._createCall("getBalances", null);
  }

  public getLinks(): ResultAsync<HypernetLink[], VectorError | Error> {
    return this._createCall("getLinks", null);
  }

  public getActiveLinks(): ResultAsync<HypernetLink[], VectorError | Error> {
    return this._createCall("getActiveLinks", null);
  }

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
    | ProxyError
  > {
    return this._createCall("acceptFunds", paymentId);
  }

  public pullFunds(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<Payment, VectorError | Error> {
    return this._createCall("pullFunds", {
      paymentId,
      amount: amount,
    });
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
    return this._createCall("repairPayments", paymentIds);
  }

  public mintTestToken(
    amount: BigNumberString,
  ): ResultAsync<void, BlockchainUnavailableError | ProxyError> {
    return this._createCall("mintTestToken", amount);
  }

  public authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    GatewayValidationError | PersistenceError | VectorError | ProxyError
  > {
    return this._createCall("authorizeGateway", gatewayUrl);
  }

  public deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
  > {
    return this._createCall("deauthorizeGateway", gatewayUrl);
  }

  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError | VectorError | ProxyError
  > {
    return this._createCall("getAuthorizedGateways", null);
  }

  public getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError | VectorError | ProxyError
  > {
    return this._createCall("getAuthorizedGatewaysConnectorsStatus", null);
  }

  public getGatewayTokenInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayTokenInfo[]>,
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
  > {
    return this._createCall("getGatewayTokenInfo", gatewayUrls);
  }

  public getGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<
    GatewayRegistrationInfo[],
    PersistenceError | VectorError | ProxyError
  > {
    return this._createCall("getGatewayRegistrationInfo", filter);
  }

  public displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    GatewayConnectorError | PersistenceError | VectorError | ProxyError
  > {
    return this.getAuthorizedGatewaysConnectorsStatus().andThen(
      (gatewaysMap) => {
        if (gatewaysMap.get(gatewayUrl) == true) {
          this._displayCoreIFrame();

          return this._createCall<GatewayUrl, GatewayConnectorError, void>(
            "displayGatewayIFrame",
            gatewayUrl,
          );
        } else {
          alert(
            `Gateway ${gatewayUrl} is not activated at the moment, try again later`,
          );
          return okAsync(undefined);
        }
      },
    );
  }

  public closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    GatewayConnectorError | PersistenceError | VectorError | ProxyError
  > {
    this._closeCoreIFrame();

    return this._createCall("closeGatewayIFrame", gatewayUrl);
  }

  public providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError | ProxyError> {
    return this._createCall("providePrivateCredentials", {
      privateKey,
      mnemonic,
    });
  }

  public getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], HypernetGovernorContractError | ProxyError> {
    return this._createCall("getProposals", {
      pageNumber,
      pageSize,
    });
  }

  public createProposal(
    name: string,
    symbol: string,
    owner: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> {
    return this._createCall("createProposal", {
      name,
      symbol,
      owner,
      enumerable,
    });
  }

  public delegateVote(
    delegateAddress: EthereumAccountAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError | ProxyError> {
    return this._createCall("delegateVote", {
      delegateAddress,
      amount,
    });
  }

  public getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> {
    return this._createCall("getProposalDetails", proposalId);
  }

  public castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> {
    return this._createCall("castVote", {
      proposalId,
      support,
    });
  }

  public getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAccountAddress,
  ): ResultAsync<
    ProposalVoteReceipt,
    HypernetGovernorContractError | ProxyError
  > {
    return this._createCall("getProposalVotesReceipt", {
      proposalId,
      voterAddress,
    });
  }

  public getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    Registry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistries", {
      pageNumber,
      pageSize,
      sortOrder,
    });
  }

  public getRegistryByName(
    registryNames: string[],
  ): ResultAsync<
    Map<string, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistryByName", registryNames);
  }

  public getRegistryByAddress(
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistryByAddress", registryAddresses);
  }

  public getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<
    Map<string, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistryEntriesTotalCount", registryNames);
  }

  public getRegistryEntries(
    registryName: string,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistryEntries", {
      registryName,
      pageNumber,
      pageSize,
      sortOrder,
    });
  }

  public getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: number,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistryEntryDetailByTokenId", {
      registryName,
      tokenId,
    });
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
    | ProxyError
  > {
    return this._createCall("updateRegistryEntryTokenURI", {
      registryName,
      tokenId,
      registrationData,
    });
  }

  public updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
    | ProxyError
  > {
    return this._createCall("updateRegistryEntryLabel", {
      registryName,
      tokenId,
      label,
    });
  }

  public queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> {
    return this._createCall("queueProposal", proposalId);
  }

  public cancelProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> {
    return this._createCall("cancelProposal", proposalId);
  }

  public executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> {
    return this._createCall("executeProposal", proposalId);
  }

  public getBlockNumber(): ResultAsync<
    number,
    BlockchainUnavailableError | ProxyError
  > {
    return this._createCall("getBlockNumber", null);
  }

  public getProposalsCount(): ResultAsync<
    number,
    HypernetGovernorContractError | ProxyError
  > {
    return this._createCall("getProposalsCount", null);
  }

  public getProposalThreshold(): ResultAsync<
    number,
    HypernetGovernorContractError | ProxyError
  > {
    return this._createCall("getProposalThreshold", null);
  }

  public getVotingPower(
    account: EthereumAccountAddress,
  ): ResultAsync<
    number,
    HypernetGovernorContractError | ERC20ContractError | ProxyError
  > {
    return this._createCall("getVotingPower", account);
  }

  public getHyperTokenBalance(
    account: EthereumAccountAddress,
  ): ResultAsync<number, ERC20ContractError | ProxyError> {
    return this._createCall("getHyperTokenBalance", account);
  }

  public getNumberOfRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getNumberOfRegistries", null);
  }

  public updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
  > {
    return this._createCall("updateRegistryParams", registryParams);
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
    | ProxyError
  > {
    return this._createCall("createRegistryEntry", {
      registryName,
      newRegistryEntry,
    });
  }

  public transferRegistryEntry(
    registryName: string,
    tokenId: number,
    transferToAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
  > {
    return this._createCall("transferRegistryEntry", {
      registryName,
      tokenId,
      transferToAddress,
    });
  }

  public burnRegistryEntry(
    registryName: string,
    tokenId: number,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
  > {
    return this._createCall("burnRegistryEntry", {
      registryName,
      tokenId,
    });
  }

  public createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    void,
    RegistryFactoryContractError | ERC20ContractError | ProxyError
  > {
    return this._createCall("createRegistryByToken", {
      name,
      symbol,
      registrarAddress,
      enumerable,
    });
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
    | ProxyError
  > {
    return this._createCall("grantRegistrarRole", {
      registryName,
      address,
    });
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
    | ProxyError
  > {
    return this._createCall("revokeRegistrarRole", {
      registryName,
      address,
    });
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
    | ProxyError
  > {
    return this._createCall("renounceRegistrarRole", {
      registryName,
      address,
    });
  }

  public provideProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError | ProxyError> {
    return this._createCall("provideProviderId", providerId);
  }

  public getTokenInformation(): ResultAsync<TokenInformation[], ProxyError> {
    return this._createCall("getTokenInformation", null);
  }

  public getTokenInformationForChain(
    chainId: ChainId,
  ): ResultAsync<TokenInformation[], ProxyError> {
    return this._createCall("getTokenInformationForChain", chainId);
  }

  public getTokenInformationByAddress(
    tokenAddress: EthereumContractAddress,
  ): ResultAsync<TokenInformation | null, ProxyError> {
    return this._createCall("getTokenInformationByAddress", tokenAddress);
  }

  public getRegistryEntryByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
    index: number,
  ): ResultAsync<
    RegistryEntry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistryEntryByOwnerAddress", {
      registryName,
      ownerAddress,
      index,
    });
  }

  public getRegistryModules(): ResultAsync<
    RegistryModule[],
    RegistryFactoryContractError | ProxyError
  > {
    return this._createCall("getRegistryModules", null);
  }

  public createBatchRegistryEntry(
    registryName: string,
    newRegistryEntries: RegistryEntry[],
  ): ResultAsync<
    void,
    | BatchModuleContractError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | ProxyError
  > {
    return this._createCall("createBatchRegistryEntry", {
      registryName,
      newRegistryEntries,
    });
  }

  public getRegistryEntryListByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistryEntryListByOwnerAddress", {
      registryName,
      ownerAddress,
    });
  }

  public getRegistryEntryListByUsername(
    registryName: string,
    username: string,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  > {
    return this._createCall("getRegistryEntryListByUsername", {
      registryName,
      username,
    });
  }

  private _displayCoreIFrame(): void {
    // Show core iframe
    if (this.child != null) {
      this.child.frame.style.display = "block";
    }

    // Show core iframe container
    if (this.element != null) {
      this.element.style.display = "block";
    }
  }

  private _closeCoreIFrame(): void {
    // Hide core iframe
    if (this.child != null) {
      this.child.frame.style.display = "none";
    }

    // Hide core iframe container
    if (this.element != null) {
      this.element.style.display = "none";
    }
  }

  /**
   * Observables for seeing what's going on
   */
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentSent: Subject<PushPayment>;
  public onPullPaymentSent: Subject<PullPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentReceived: Subject<PullPayment>;
  public onPushPaymentDelayed: Subject<PushPayment>;
  public onPullPaymentDelayed: Subject<PullPayment>;
  public onPushPaymentCanceled: Subject<PushPayment>;
  public onPullPaymentCanceled: Subject<PullPayment>;
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
}
