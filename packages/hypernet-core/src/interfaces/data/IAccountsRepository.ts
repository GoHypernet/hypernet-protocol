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
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  getPublicIdentifier(): ResultAsync<
    PublicIdentifier,
    BlockchainUnavailableError | VectorError
  >;
  getAccounts(): ResultAsync<EthereumAddress[], BlockchainUnavailableError>;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | VectorError>;
  getBalanceByAsset(
    assetAddress: EthereumAddress,
  ): ResultAsync<AssetBalance, BalancesUnavailableError | VectorError>;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumberString,
  ): ResultAsync<null, VectorError | BlockchainUnavailableError>;
  withdrawFunds(
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
