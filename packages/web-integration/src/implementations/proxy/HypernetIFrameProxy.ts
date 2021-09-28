import {
  Balances,
  ControlClaim,
  EthereumAddress,
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
  EVoteSupport,
  ProposalVoteReceipt,
  Registry,
  RegistryEntry,
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

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected iframeName: string,
  ) {
    super(element, iframeUrl, iframeName);

    this._handshakePromise = null;

    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentSent = new Subject<PushPayment>();
    this.onPullPaymentSent = new Subject<PullPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentReceived = new Subject<PullPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onPushPaymentDelayed = new Subject<PushPayment>();
    this.onPullPaymentDelayed = new Subject<PullPayment>();
    this.onPushPaymentCanceled = new Subject<PushPayment>();
    this.onPullPaymentCanceled = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();
    this.onDeStorageAuthenticationStarted = new Subject<void>();
    this.onDeStorageAuthenticationSucceeded = new Subject<void>();
    this.onDeStorageAuthenticationFailed = new Subject<void>();
    this.onGatewayAuthorized = new Subject<GatewayUrl>();
    this.onGatewayDeauthorizationStarted = new Subject<GatewayUrl>();
    this.onAuthorizedGatewayUpdated = new Subject<GatewayUrl>();
    this.onAuthorizedGatewayActivationFailed = new Subject<GatewayUrl>();
    this.onGatewayIFrameDisplayRequested = new Subject<GatewayUrl>();
    this.onGatewayIFrameCloseRequested = new Subject<GatewayUrl>();
    this.onCoreIFrameDisplayRequested = new Subject();
    this.onCoreIFrameCloseRequested = new Subject();
    this.onInitializationRequired = new Subject<void>();
    this.onPrivateCredentialsRequested = new Subject<void>();
    this.onStateChannelCreated = new Subject();
    this.onChainConnected = new Subject();
    this.onGovernanceChainConnected = new Subject();
    this.onChainChanged = new Subject();
    this.onAccountChanged = new Subject();
    this.onGovernanceChainChanged = new Subject();
    this.onGovernanceAccountChanged = new Subject();

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

        child.on("onDeStorageAuthenticationStarted", () => {
          this._displayCoreIFrame();

          this.onDeStorageAuthenticationStarted.next();
        });

        child.on("onDeStorageAuthenticationSucceeded", () => {
          this._closeCoreIFrame();

          this.onDeStorageAuthenticationSucceeded.next();
        });

        child.on("onDeStorageAuthenticationFailed", () => {
          this.onDeStorageAuthenticationFailed.next();
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

        child.on("onAccountChanged", (data: EthereumAddress) => {
          this.onAccountChanged.next(data);
        });

        child.on("onGovernanceChainChanged", (data: ChainId) => {
          this.onGovernanceChainChanged.next(data);
        });

        child.on("onGovernanceAccountChanged", (data: EthereumAddress) => {
          this.onGovernanceAccountChanged.next(data);
        });

        // Setup a listener for the "initialized" event.
        child.on("initialized", () => {
          // Resolve waitInitialized
          resolve();

          // And mark us as initialized
          this.coreInitialized = true;
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
          console.log(
            "recieved onCoreIFrameDisplayRequested in HypernetIFrameProxy",
          );
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
      });
    });
  }

  public finalizePullPayment(
    _paymentId: PaymentId,
    _finalAmount: BigNumberString,
  ): Promise<HypernetLink> {
    throw new Error("Method not implemented.");
  }

  public initialized(): Result<boolean, never> {
    // If the child is not initialized, there is no way the core can be.
    if (this.child == null) {
      return ok(false);
    }

    // Return the current known status of coreInitialized. We request this
    // information as soon as the child is up.
    return ok(this.coreInitialized);
  }

  public waitInitialized(): ResultAsync<void, never> {
    return ResultAsync.fromSafePromise(this.waitInitializedPromise);
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
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this._createCall("getEthereumAccounts", null);
  }

  public initialize(): ResultAsync<
    void,
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
    VectorError | BlockchainUnavailableError | PersistenceError
  > {
    return this._createCall("getActiveStateChannels", null);
  }

  public createStateChannel(
    routerPublicIdentifiers: PublicIdentifier[],
    chainId: ChainId,
  ): ResultAsync<
    ActiveStateChannel,
    VectorError | BlockchainUnavailableError | PersistenceError
  > {
    return this._createCall("createStateChannel", {
      routerPublicIdentifiers,
      chainId,
    });
  }

  public depositFunds(
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
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
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
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

  public getBalances(): ResultAsync<Balances, BalancesUnavailableError> {
    return this._createCall("getBalances", null);
  }

  public getLinks(): ResultAsync<HypernetLink[], VectorError | Error> {
    return this._createCall("getLinks", null);
  }

  public getActiveLinks(): ResultAsync<HypernetLink[], VectorError | Error> {
    return this._createCall("getActiveLinks", null);
  }

  public getLinkByCounterparty(
    _counterPartyAccount: PublicIdentifier,
  ): Promise<HypernetLink> {
    throw new Error("Unimplemented");
  }

  public acceptOffer(
    paymentId: PaymentId,
  ): ResultAsync<Payment, InsufficientBalanceError | AcceptPaymentError> {
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

  public mintTestToken(
    amount: BigNumberString,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this._createCall("mintTestToken", amount);
  }

  public authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayValidationError> {
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
    PersistenceError
  > {
    return this._createCall("getAuthorizedGateways", null);
  }

  public getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError
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
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError> {
    return this._createCall("getGatewayRegistrationInfo", filter);
  }

  public displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError> {
    return this.getAuthorizedGatewaysConnectorsStatus().andThen(
      (gatewaysMap) => {
        if (gatewaysMap.get(gatewayUrl) == true) {
          this._displayCoreIFrame();

          return this._createCall("displayGatewayIFrame", gatewayUrl);
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
  ): ResultAsync<void, GatewayConnectorError> {
    this._closeCoreIFrame();

    return this._createCall("closeGatewayIFrame", gatewayUrl);
  }

  public providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError> {
    return this._createCall("providePrivateCredentials", {
      privateKey,
      mnemonic,
    });
  }

  public getProposals(
    _proposalsNumberArr?: number[],
  ): ResultAsync<Proposal[], BlockchainUnavailableError> {
    return this._createCall("getProposals", _proposalsNumberArr);
  }

  public createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this._createCall("createProposal", {
      name,
      symbol,
      owner,
    });
  }

  public delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this._createCall("delegateVote", {
      delegateAddress,
      amount,
    });
  }

  public getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this._createCall("getProposalDetails", proposalId);
  }

  public castVote(
    proposalId: string,
    support: EVoteSupport,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this._createCall("castVote", {
      proposalId,
      support,
    });
  }

  public getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<ProposalVoteReceipt, BlockchainUnavailableError> {
    return this._createCall("getProposalVotesReceipt", {
      proposalId,
      voterAddress,
    });
  }

  public proposeRegistryEntry(
    registryName: string,
    label: string,
    data: string,
    recipient: EthereumAddress,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this._createCall("proposeRegistryEntry", {
      registryName,
      label,
      data,
      recipient,
    });
  }

  public getRegistries(
    numberOfRegistries: number,
  ): ResultAsync<Registry[], BlockchainUnavailableError> {
    return this._createCall("getRegistries", numberOfRegistries);
  }

  public getRegistryByName(
    registryName: string,
  ): ResultAsync<Registry, BlockchainUnavailableError> {
    return this._createCall("getRegistryByName", registryName);
  }

  public getRegistryByAddress(
    registryAddress: EthereumAddress,
  ): ResultAsync<Registry, BlockchainUnavailableError> {
    return this._createCall("getRegistryByAddress", registryAddress);
  }

  public getRegistryEntriesTotalCount(
    registryName: string,
  ): ResultAsync<number, BlockchainUnavailableError> {
    return this._createCall("getRegistryEntriesTotalCount", registryName);
  }

  public getRegistryEntries(
    registryName: string,
    _registryEntriesNumberArr?: number[],
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError> {
    return this._createCall("getRegistryEntries", {
      registryName,
      _registryEntriesNumberArr,
    });
  }

  public getRegistryEntryByLabel(
    registryName: string,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this._createCall("getRegistryEntryByLabel", {
      registryName,
      label,
    });
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
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
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this._createCall("updateRegistryEntryLabel", {
      registryName,
      tokenId,
      label,
    });
  }

  public queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this._createCall("queueProposal", proposalId);
  }

  public executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this._createCall("executeProposal", proposalId);
  }

  public getProposalsCount(): ResultAsync<number, BlockchainUnavailableError> {
    return this._createCall("getProposalsCount", null);
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
  public onDeStorageAuthenticationStarted: Subject<void>;
  public onDeStorageAuthenticationSucceeded: Subject<void>;
  public onDeStorageAuthenticationFailed: Subject<void>;
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
  public onStateChannelCreated: Subject<ActiveStateChannel>;
  public onChainConnected: Subject<ChainId>;
  public onGovernanceChainConnected: Subject<ChainId>;
  public onChainChanged: Subject<ChainId>;
  public onAccountChanged: Subject<EthereumAddress>;
  public onGovernanceChainChanged: Subject<ChainId>;
  public onGovernanceAccountChanged: Subject<EthereumAddress>;
}
