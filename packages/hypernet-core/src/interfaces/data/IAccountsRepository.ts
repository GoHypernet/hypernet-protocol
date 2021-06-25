import {
  EthereumAddress,
  Balances,
  AssetBalance,
  PublicIdentifier,
  Signature,
  AssetInfo,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  LogicalError,
  RouterChannelUnknownError,
  VectorError,
  BigNumberString,
  PersistenceError,
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
  getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | RouterChannelUnknownError
  >;
  getBalanceByAsset(
    assetAddress: EthereumAddress,
  ): ResultAsync<
    AssetBalance,
    BalancesUnavailableError | VectorError | RouterChannelUnknownError
  >;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumberString,
  ): ResultAsync<
    null,
    | RouterChannelUnknownError
    | VectorError
    | LogicalError
    | BlockchainUnavailableError
  >;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    void,
    RouterChannelUnknownError | VectorError | BlockchainUnavailableError
  >;
  signMessage(
    message: string,
  ): ResultAsync<Signature, BlockchainUnavailableError | VectorError>;

  mintTestToken(
    amount: BigNumberString,
    to: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError>;

  setPreferredPaymentToken(
    tokenAddress: EthereumAddress,
  ): ResultAsync<void, PersistenceError>;

  getPreferredPaymentToken(): ResultAsync<
    AssetInfo,
    BlockchainUnavailableError | PersistenceError
  >;
}

export const IAccountsRepositoryType = Symbol.for("IAccountsRepository");
