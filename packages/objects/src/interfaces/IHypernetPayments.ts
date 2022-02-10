import { ResultAsync } from "neverthrow";

import { ActiveStateChannel } from "@objects/ActiveStateChannel";
import { Balances } from "@objects/Balances";
import { BigNumberString } from "@objects/BigNumberString";
import { ChainId } from "@objects/ChainId";
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
  RegistryFactoryContractError,
  NonFungibleRegistryContractError,
  InvalidPaymentError,
  GatewayActivationError,
  InvalidPaymentIdError,
  TransferResolutionError,
  TransferCreationError,
  PaymentStakeError,
  PaymentCreationError,
  InactiveGatewayError,
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
import { PublicIdentifier } from "@objects/PublicIdentifier";
import { Signature } from "@objects/Signature";
import { TokenInformation } from "@objects/TokenInformation";
import { InitializeStatus } from "@objects/InitializeStatus";
export interface IHypernetPayments {
  paymentsInitialized(chainId?: ChainId): ResultAsync<boolean, ProxyError>;

  waitPaymentsInitialized(chainId?: ChainId): ResultAsync<void, ProxyError>;

  initializePayments(
    chainId?: ChainId,
  ): ResultAsync<InitializeStatus, CoreInitializationErrors>;

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
    | RegistryFactoryContractError
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
    | RegistryFactoryContractError
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
    | RegistryFactoryContractError
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
    | RegistryFactoryContractError
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
    NonFungibleRegistryContractError | RegistryFactoryContractError | ProxyError
  >;

  getTokenInformation(): ResultAsync<TokenInformation[], ProxyError>;

  getTokenInformationForChain(
    chainId: ChainId,
  ): ResultAsync<TokenInformation[], ProxyError>;

  getTokenInformationByAddress(
    tokenAddress: EthereumContractAddress,
  ): ResultAsync<TokenInformation | null, ProxyError>;

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
    | RegistryFactoryContractError
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
    | RegistryFactoryContractError
  >;
}
