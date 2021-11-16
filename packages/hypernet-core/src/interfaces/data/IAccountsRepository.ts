import {
  Balances,
  AssetBalance,
  PublicIdentifier,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  VectorError,
  BigNumberString,
  ActiveStateChannel,
  PersistenceError,
  ChainId,
  UtilityMessageSignature,
  EthereumContractAddress,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  /**
   * Returns an array of public identifiers of routers we have a connection with
   * ActiveRouters are held in HNP persistence, but can be recovered via evaluation of the blockchain and subgraphs.
   */
  getActiveRouters(): ResultAsync<PublicIdentifier[], PersistenceError>;

  /**
   * Stores an active router into the hypernet core persistence layer
   * @param routerPublicIdentifier
   */
  addActiveRouter(
    routerPublicIdentifier: PublicIdentifier,
  ): ResultAsync<void, PersistenceError>;

  /**
   * Returns an array of ActiveStateChannel objects.
   * ActiveStateChannels are a summary of the key information for an active
   * state channel- the chain ID, router, and channel address.
   */
  getActiveStateChannels(): ResultAsync<
    ActiveStateChannel[],
    PersistenceError | VectorError | BlockchainUnavailableError
  >;

  /**
   * Creates a state channel on a particular chain with the requested router.
   * @param routerPublicIdentifier
   * @param chainId
   * @returns the address of the state channel
   */
  createStateChannel(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
  ): ResultAsync<EthereumContractAddress, PersistenceError | VectorError>;

  getPublicIdentifier(): ResultAsync<
    PublicIdentifier,
    BlockchainUnavailableError | VectorError
  >;
  getAccounts(): ResultAsync<
    EthereumAccountAddress[],
    BlockchainUnavailableError
  >;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | VectorError>;
  getBalanceByAsset(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
  ): ResultAsync<AssetBalance, BalancesUnavailableError | VectorError>;
  depositFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
  ): ResultAsync<null, VectorError | BlockchainUnavailableError>;
  withdrawFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAccountAddress,
  ): ResultAsync<void, VectorError | BlockchainUnavailableError>;
  signMessage(
    message: string,
  ): ResultAsync<
    UtilityMessageSignature,
    BlockchainUnavailableError | VectorError
  >;

  mintTestToken(
    amount: BigNumberString,
    to: EthereumAccountAddress,
  ): ResultAsync<void, BlockchainUnavailableError>;
}

export const IAccountsRepositoryType = Symbol.for("IAccountsRepository");
