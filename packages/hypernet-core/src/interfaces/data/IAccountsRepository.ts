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
  getPublicIdentifier(): ResultAsync<PublicIdentifier, VectorError | LogicalError>;
  getAccounts(): ResultAsync<string[], BlockchainUnavailableError>;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError>;
  getBalanceByAsset(assetAddress: EthereumAddress): ResultAsync<AssetBalance, BalancesUnavailableError>;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    null,
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error | BlockchainUnavailableError
  >;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<void, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;

  mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, BlockchainUnavailableError>;
}
