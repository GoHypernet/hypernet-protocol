import { ResultAsync, Result } from "neverthrow";
import { Subject } from "rxjs";

import { ActiveStateChannel } from "@objects/ActiveStateChannel";
import { Balances } from "@objects/Balances";
import { BigNumberString } from "@objects/BigNumberString";
import { ChainId } from "@objects/ChainId";
import { ControlClaim } from "@objects/ControlClaim";
import {
  AcceptPaymentError,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  InsufficientBalanceError,
  PersistenceError,
  VectorError,
  GatewayValidationError,
  GatewayConnectorError,
  InvalidParametersError,
  ProxyError,
  GatewayAuthorizationDeniedError,
  MessagingError,
  RouterChannelUnknownError,
  RegistryPermissionError,
  RegistryFactoryContractError,
  NonFungibleRegistryContractError,
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
  PaymentCreationError,
  InactiveGatewayError,
  BatchModuleContractError,
  IPFSUnavailableError,
  CoreInitializationErrors,
} from "@objects/errors";
import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { GatewayRegistrationFilter } from "@objects/GatewayRegistrationFilter";
import { GatewayRegistrationInfo } from "@objects/GatewayRegistrationInfo";
import { GatewayTokenInfo } from "@objects/GatewayTokenInfo";
import { GatewayUrl } from "@objects/GatewayUrl";
import { HypernetLink } from "@objects/HypernetLink";
import { Payment } from "@objects/Payment";
import { PaymentId } from "@objects/PaymentId";
import { Proposal, ProposalVoteReceipt } from "@objects/Proposal";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { PullPayment } from "@objects/PullPayment";
import { PushPayment } from "@objects/PushPayment";
import { Registry } from "@objects/Registry";
import { RegistryEntry } from "@objects/RegistryEntry";
import { RegistryParams } from "@objects/RegistryParams";
import { RegistryTokenId } from "@objects/RegistryTokenId";
import { Signature } from "@objects/Signature";
import { EProposalVoteSupport, ERegistrySortOrder } from "@objects/typing";
import { ProviderId } from "@objects/ProviderId";
import { TokenInformation } from "@objects/TokenInformation";
import { RegistryModule } from "@objects/RegistryModule";
import { InitializeStatus } from "@web-integration/InitializeStatus";

/**
 * HypernetCore is a single instance of the Hypernet Protocol, representing a single
 * user account. The user can be /both/ a consumer and a provider.
 */
export interface IHypernetCore {
  initialized(): ResultAsync<boolean, never>;

  waitInitialized(): ResultAsync<void, never>;

  registriesInitialized(): Result<boolean, never>;

  waitRegistriesInitialized(): ResultAsync<void, never>;

  governanceInitialized(): Result<boolean, never>;

  waitGovernanceInitialized(): ResultAsync<void, never>;

  paymentsInitialized(): Result<boolean, never>;

  waitPaymentsInitialized(): ResultAsync<void, never>;

  /**
   * Probably can be removed, but leaving as a reminder in case we need to solve
   * the multiple-instance-of-Hypernet-core issue
   */
  inControl(): Result<boolean, never>;

  /**
   * This returns the linked Ethereum accounts via your installed wallet (ie: Metamask)
   */
  getEthereumAccounts(): ResultAsync<
    EthereumAccountAddress[],
    BlockchainUnavailableError | ProxyError
  >;

  /**
   * This must be called before most other calls; it is used to specify what account addres
   * hypernet core will be representing.
   * @param account The address that says who this instance of HypernetCore is representing.
   */
  initialize(): ResultAsync<InitializeStatus, CoreInitializationErrors>;

  initializeRegistries(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
    | ProxyError
  >;

  initializeGovernance(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
    | ProxyError
  >;

  initializePayments(): ResultAsync<void, CoreInitializationErrors>;

  getInitializationStatus(): ResultAsync<InitializeStatus, ProxyError>;

  /**
   * Gets the public id of the Hypernet Core user account. If the core is not initialized,
   * it will throw an error
   * @dev currently this matches the Vector pubId
   */
  getPublicIdentifier(): ResultAsync<PublicIdentifier, never | ProxyError>;

  /**
   * Returns a list of active state channels.
   * Basically a list of routers with which you are connected.
   */
  getActiveStateChannels(): ResultAsync<
    ActiveStateChannel[],
    VectorError | BlockchainUnavailableError | PersistenceError | ProxyError
  >;

  /**
   * Creates a state channel with any of a list of routers on a particular chain.
   * You can create a state channel with any router you like; however, if you
   * create it with a router none of your authorized gateways can use, it's of
   * very limited use.
   * @param routerPublicIdentifiers
   * @param chainId
   */
  createStateChannel(
    routerPublicIdentifiers: PublicIdentifier[],
    chainId: ChainId,
  ): ResultAsync<
    ActiveStateChannel,
    VectorError | BlockchainUnavailableError | PersistenceError | ProxyError
  >;

  /**
   * This function will load HypernetCore with funds. It should be called for each type of asset you want to use.
   * Can be called by either party (provider or consumer); internally, deposits into the router channel.
   * @param channelAddress The address of the state channel
   * @param assetAddress The Ethereum address of the token you want to deposit. These can be ETH, HyperToken, Dai, or any othe supported payment token.
   * @param amount The amount of funds (in wei) that you are depositing
   * @dev this creates a transaction on the blockchain!
   */
  depositFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  >;

  /**
   * This function will withdraw funds from Hypernet core into a specified Ethereum address.
   * @param assetAddress
   * @param amount
   * @param destinationAddress
   */
  withdrawFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAccountAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  >;

  /**
   * Returns the balance account, including funds within
   * the general channel, and funds locked inside transfers within the channel.
   */
  getBalances(): ResultAsync<
    Balances,
    | BalancesUnavailableError
    | VectorError
    | BlockchainUnavailableError
    | ProxyError
  >;

  /**
   * Returns all Hypernet Ledger for the user
   */
  getLinks(): ResultAsync<HypernetLink[], VectorError | Error>;

  /**
   * Returns all active Hypernet Ledgers for the user
   * An active link contains an incomplete/non-finalized transfer.
   */
  getActiveLinks(): ResultAsync<HypernetLink[], VectorError | Error>;

  /**
   * For a specified payment, puts up stake to accept the payment
   * @param paymentId the payment ID to accept funds
   */
  acceptOffer(
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
    | InvalidPaymentIdError
    | PaymentCreationError
    | NonFungibleRegistryContractError
  >;

  /**
   * Pulls an incremental amount from an authorized payment
   * @param paymentId: The authorized payment ID to pull from.
   * @param amount: The amount to pull. The token type has already been baked in.
   */
  pullFunds(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<Payment, VectorError | Error>;

  /**
   * Finalized an authorized payment with the final payment amount.
   * @param paymentId the payment ID to finalize
   * @param finalAmount the total payment amount to pull
   */
  finalizePullPayment(
    paymentId: PaymentId,
    finalAmount: BigNumberString,
  ): Promise<HypernetLink>;

  /**
   * This method is used to force the system to take a very, very close
   * look at a particular payment. It will also notify the gateway
   * and send all the payment details to the gateway. The gateway may
   * be able to fix the payment- for instance, if the payment is stuck
   * in Approved waiting for the gateway to release the insurance, and
   * the gateway doesn't know about the payment
   * @param paymentId
   */
  repairPayments(
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
  >;

  /**
   * Only used for development purposes!
   * @param amount
   */
  mintTestToken(
    amount: BigNumberString,
  ): ResultAsync<void, BlockchainUnavailableError | ProxyError>;

  authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    | PersistenceError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | GatewayAuthorizationDeniedError
    | GatewayActivationError
    | VectorError
    | ProxyError
    | GatewayValidationError
    | NonFungibleRegistryContractError
  >;

  deauthorizeGateway(
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
  >;

  getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError | VectorError | BlockchainUnavailableError | ProxyError
  >;

  getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError | VectorError | BlockchainUnavailableError | ProxyError
  >;

  /**
   * Returns the token info for each requested gateway.
   * This is useful for figuring out if you want to create a state channel
   * @param gatewayUrls the list of gatways URLs that you are interested in
   */
  getGatewayTokenInfo(
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
  >;

  /**
   * Returns the requested gateway registration info.
   * This allows you to search for gateways.
   * @param filter optional; this will filter the gateway results
   */
  getGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<
    GatewayRegistrationInfo[],
    PersistenceError | VectorError | ProxyError
  >;

  /**
   * Returns a map of all gateways from the gateway registry
   */
  getGatewayEntryList(): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    NonFungibleRegistryContractError | ProxyError
  >;

  closeGatewayIFrame(
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
    | ProxyError
    | NonFungibleRegistryContractError
    | InactiveGatewayError
  >;
  displayGatewayIFrame(
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
    | ProxyError
    | NonFungibleRegistryContractError
    | InactiveGatewayError
  >;

  providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError | ProxyError>;

  getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], HypernetGovernorContractError | ProxyError>;

  createProposal(
    name: string,
    symbol: string,
    owner: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    Proposal,
    IPFSUnavailableError | HypernetGovernorContractError | ProxyError
  >;

  delegateVote(
    delegateAddress: EthereumAccountAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError | ProxyError>;

  getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  getProposalDescription(
    descriptionHash: string,
  ): ResultAsync<
    string,
    IPFSUnavailableError | HypernetGovernorContractError | ProxyError
  >;

  castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAccountAddress,
  ): ResultAsync<
    ProposalVoteReceipt,
    HypernetGovernorContractError | ProxyError
  >;

  getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    Registry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryByName(
    registryNames: string[],
  ): ResultAsync<
    Map<string, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryByAddress(
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryEntries(
    registryName: string,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  cancelProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: RegistryTokenId,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  updateRegistryEntryLabel(
    registryName: string,
    tokenId: RegistryTokenId,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  getProposalsCount(): ResultAsync<
    number,
    HypernetGovernorContractError | ProxyError
  >;

  getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<
    Map<string, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getProposalThreshold(): ResultAsync<
    number,
    HypernetGovernorContractError | ProxyError
  >;

  getVotingPower(
    account: EthereumAccountAddress,
  ): ResultAsync<
    number,
    HypernetGovernorContractError | ERC20ContractError | ProxyError
  >;

  getHyperTokenBalance(
    account: EthereumAccountAddress,
  ): ResultAsync<number, ERC20ContractError | ProxyError>;

  getNumberOfRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  createRegistryEntry(
    registryName: string,
    newRegistryEntry: RegistryEntry,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ERC20ContractError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  transferRegistryEntry(
    registryName: string,
    tokenId: RegistryTokenId,
    transferToAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  burnRegistryEntry(
    registryName: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    void,
    RegistryFactoryContractError | ERC20ContractError | ProxyError
  >;

  grantRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  revokeRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  renounceRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  provideProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError | ProxyError>;
  getTokenInformation(): ResultAsync<TokenInformation[], ProxyError>;

  getBlockNumber(): ResultAsync<
    number,
    BlockchainUnavailableError | ProxyError
  >;

  getTokenInformationForChain(
    chainId: ChainId,
  ): ResultAsync<TokenInformation[], ProxyError>;

  getTokenInformationByAddress(
    tokenAddress: EthereumContractAddress,
  ): ResultAsync<TokenInformation | null, ProxyError>;

  getRegistryEntryByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
    index: number,
  ): ResultAsync<
    RegistryEntry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryModules(): ResultAsync<
    RegistryModule[],
    RegistryFactoryContractError | ProxyError
  >;

  createBatchRegistryEntry(
    registryName: string,
    newRegistryEntries: RegistryEntry[],
  ): ResultAsync<
    void,
    | BatchModuleContractError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | ProxyError
  >;

  getRegistryEntryListByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryEntryListByUsername(
    registryName: string,
    username: string,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;
  /**
   * Observables for seeing what's going on
   */
  onControlClaimed: Subject<ControlClaim>;
  onControlYielded: Subject<ControlClaim>;
  onPushPaymentSent: Subject<PushPayment>;
  onPullPaymentSent: Subject<PullPayment>;
  onPushPaymentUpdated: Subject<PushPayment>;
  onPullPaymentUpdated: Subject<PullPayment>;
  onPushPaymentReceived: Subject<PushPayment>;
  onPullPaymentReceived: Subject<PullPayment>;
  onPushPaymentDelayed: Subject<PushPayment>;
  onPullPaymentDelayed: Subject<PullPayment>;
  onPushPaymentCanceled: Subject<PushPayment>;
  onPullPaymentCanceled: Subject<PullPayment>;
  onBalancesChanged: Subject<Balances>;
  onCeramicAuthenticationStarted: Subject<void>;
  onCeramicAuthenticationSucceeded: Subject<void>;
  onCeramicFailed: Subject<Error>;
  onGatewayAuthorized: Subject<GatewayUrl>;
  onGatewayDeauthorizationStarted: Subject<GatewayUrl>;
  onAuthorizedGatewayUpdated: Subject<GatewayUrl>;
  onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>;
  onGatewayIFrameDisplayRequested: Subject<GatewayUrl>;
  onGatewayIFrameCloseRequested: Subject<GatewayUrl>;
  onCoreIFrameDisplayRequested: Subject<void>;
  onCoreIFrameCloseRequested: Subject<void>;
  onInitializationRequired: Subject<void>;
  onPrivateCredentialsRequested: Subject<void>;
  onWalletConnectOptionsDisplayRequested: Subject<void>;
  onStateChannelCreated: Subject<ActiveStateChannel>;
  onChainConnected: Subject<ChainId>;
  onGovernanceChainConnected: Subject<ChainId>;
  onChainChanged: Subject<ChainId>;
  onAccountChanged: Subject<EthereumAccountAddress>;
  onGovernanceChainChanged: Subject<ChainId>;
  onGovernanceAccountChanged: Subject<EthereumAccountAddress>;
}

export const IHypernetCoreType = Symbol.for("IHypernetCore");
