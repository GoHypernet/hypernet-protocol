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
} from "@objects/errors";
import { EthereumAddress } from "@objects/EthereumAddress";
import { GatewayRegistrationFilter } from "@objects/GatewayRegistrationFilter";
import { GatewayRegistrationInfo } from "@objects/GatewayRegistrationInfo";
import { GatewayTokenInfo } from "@objects/GatewayTokenInfo";
import { GatewayUrl } from "@objects/GatewayUrl";
import { HypernetLink } from "@objects/HypernetLink";
import { Payment } from "@objects/Payment";
import { PaymentId } from "@objects/PaymentId";
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { PullPayment } from "@objects/PullPayment";
import { PushPayment } from "@objects/PushPayment";
import { Signature } from "@objects/Signature";
import { Proposal, ProposalVoteReceipt } from "@objects/Proposal";
import { EProposalVoteSupport, ERegistrySortOrder } from "@objects/typing";
import { Registry } from "@objects/Registry";
import { RegistryEntry } from "@objects/RegistryEntry";
import { RegistryParams } from "@objects/RegistryParams";

/**
 * HypernetCore is a single instance of the Hypernet Protocol, representing a single
 * user account. The user can be /both/ a consumer and a provider.
 */
export interface IHypernetCore {
  initialized(): Result<boolean, never>;

  waitInitialized(): ResultAsync<void, never>;

  /**
   * Probably can be removed, but leaving as a reminder in case we need to solve
   * the multiple-instance-of-Hypernet-core issue
   */
  inControl(): Result<boolean, never>;

  /**
   * This returns the linked Ethereum accounts via your installed wallet (ie: Metamask)
   */
  getEthereumAccounts(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError | ProxyError
  >;

  /**
   * This must be called before most other calls; it is used to specify what account addres
   * hypernet core will be representing.
   * @param account The address that says who this instance of HypernetCore is representing.
   */
  initialize(): ResultAsync<
    void,
    | MessagingError
    | BlockchainUnavailableError
    | VectorError
    | RouterChannelUnknownError
    | GatewayConnectorError
    | GatewayValidationError
    | ProxyError
  >;

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
    VectorError | BlockchainUnavailableError | PersistenceError
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
    VectorError | BlockchainUnavailableError | PersistenceError
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
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
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
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError | Error
  >;

  /**
   * Returns the balance account, including funds within
   * the general channel, and funds locked inside transfers within the channel.
   */
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | VectorError>;

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
   * Returns the Hypernet Ledger for the user with the specified counterparty
   */
  getLinkByCounterparty(
    counterPartyAccount: PublicIdentifier,
  ): Promise<HypernetLink>;

  /**
   * For a specified payment, puts up stake to accept the payment
   * @param paymentId the payment ID to accept funds
   */
  acceptOffer(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | InsufficientBalanceError
    | AcceptPaymentError
    | BalancesUnavailableError
    | GatewayValidationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
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
   * Only used for development purposes!
   * @param amount
   */
  mintTestToken(
    amount: BigNumberString,
  ): ResultAsync<void, BlockchainUnavailableError | ProxyError>;

  authorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayValidationError | PersistenceError | VectorError>;

  deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
  >;

  getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError | VectorError
  >;

  getAuthorizedGatewaysConnectorsStatus(): ResultAsync<
    Map<GatewayUrl, boolean>,
    PersistenceError | VectorError
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
    PersistenceError | ProxyError | GatewayAuthorizationDeniedError
  >;

  /**
   * Returns the requested gateway registration info.
   * This allows you to search for gateways.
   * @param filter optional; this will filter the gateway results
   */
  getGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError | VectorError>;

  closeGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError | PersistenceError | VectorError>;
  displayGatewayIFrame(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<void, GatewayConnectorError | PersistenceError | VectorError>;

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
    owner: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError | ProxyError>;

  getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
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
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;

  getRegistryByName(
    registryNames: string[],
  ): ResultAsync<
    Map<string, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;

  getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<
    Map<EthereumAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;

  getRegistryEntries(
    registryName: string,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;

  getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: number,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError
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
    tokenId: number,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
  >;

  updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
  >;

  getProposalsCount(): ResultAsync<
    number,
    HypernetGovernorContractError | ProxyError
  >;

  getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<
    Map<string, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;

  getProposalThreshold(): ResultAsync<
    number,
    HypernetGovernorContractError | ProxyError
  >;

  getVotingPower(
    account: EthereumAddress,
  ): ResultAsync<number, HypernetGovernorContractError | ProxyError>;

  getHyperTokenBalance(
    account: EthereumAddress,
  ): ResultAsync<number, ERC20ContractError | ProxyError>;

  getNumberOfRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;

  updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;

  createRegistryEntry(
    registryName: string,
    label: string,
    recipientAddress: EthereumAddress,
    data: string,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;

  transferRegistryEntry(
    registryName: string,
    tokenId: number,
    transferToAddress: EthereumAddress,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;

  burnRegistryEntry(
    registryName: string,
    tokenId: number,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;

  createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError>;

  grantRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;

  revokeRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;

  renounceRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
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
  onStateChannelCreated: Subject<ActiveStateChannel>;
  onChainConnected: Subject<ChainId>;
  onGovernanceChainConnected: Subject<ChainId>;
  onChainChanged: Subject<ChainId>;
  onAccountChanged: Subject<EthereumAddress>;
  onGovernanceChainChanged: Subject<ChainId>;
  onGovernanceAccountChanged: Subject<EthereumAddress>;
}

export const IHypernetCoreType = Symbol.for("IHypernetCore");
