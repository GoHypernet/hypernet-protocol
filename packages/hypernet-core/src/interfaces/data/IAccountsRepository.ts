import {
  EthereumAddress,
  Balances,
  AssetBalance,
  PublicIdentifier,
  Signature,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  VectorError,
  BigNumberString,
  ActiveStateChannel,
  PersistenceError,
  ActiveRouter,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  /**
   * Returns an array of ActiveRouter objects.
   * ActiveRouters are held in HNP persistence, but can be recovered via evaluation of the blockchain and subgraphs.
   */
  getActiveRouters(): ResultAsync<ActiveRouter[], PersistenceError>;

  /**
   * Returns an array of ActiveStateChannel objects.
   * ActiveStateChannels are a summary of the key information for an active
   * state channel- the chain ID, router, and channel address.
   */
  getActiveStateChannels(): ResultAsync<
    ActiveStateChannel[],
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  getPublicIdentifier(): ResultAsync<
    PublicIdentifier,
    BlockchainUnavailableError | VectorError
  >;
  getAccounts(): ResultAsync<EthereumAddress[], BlockchainUnavailableError>;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | VectorError>;
  getBalanceByAsset(
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
  ): ResultAsync<AssetBalance, BalancesUnavailableError | VectorError>;
  depositFunds(
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
    amount: BigNumberString,
  ): ResultAsync<null, VectorError | BlockchainUnavailableError>;
  withdrawFunds(
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
  ): ResultAsync<void, VectorError | BlockchainUnavailableError>;
  signMessage(
    message: string,
  ): ResultAsync<Signature, BlockchainUnavailableError | VectorError>;

  mintTestToken(
    amount: BigNumberString,
    to: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError>;
}

export const IAccountsRepositoryType = Symbol.for("IAccountsRepository");
