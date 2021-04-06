import { EthereumAddress, Balances, AssetBalance, PublicIdentifier } from "@hypernetlabs/objects";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  CoreUninitializedError,
  LogicalError,
  RouterChannelUnknownError,
  VectorError,
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  getPublicIdentifier(): ResultAsync<
    PublicIdentifier,
    CoreUninitializedError | BlockchainUnavailableError | VectorError
  >;
  getAccounts(): ResultAsync<EthereumAddress[], BlockchainUnavailableError>;
  getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | CoreUninitializedError | RouterChannelUnknownError
  >;
  getBalanceByAsset(
    assetAddress: EthereumAddress,
  ): ResultAsync<
    AssetBalance,
    BalancesUnavailableError | VectorError | CoreUninitializedError | RouterChannelUnknownError
  >;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    null,
    RouterChannelUnknownError | CoreUninitializedError | VectorError | LogicalError | BlockchainUnavailableError
  >;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<void, RouterChannelUnknownError | CoreUninitializedError | VectorError | BlockchainUnavailableError>;

  mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, BlockchainUnavailableError>;
}
