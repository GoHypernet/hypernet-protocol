import { NodeError } from "@connext/vector-types";
import { EthereumAddress, BigNumber, Balances, AssetBalance, PublicIdentifier, ResultAsync } from "@interfaces/objects";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  CoreUninitializedError,
  LogicalError,
  RouterChannelUnknownError,
} from "@interfaces/objects/errors";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  getPublicIdentifier(): ResultAsync<PublicIdentifier, NodeError | LogicalError>;
  getAccounts(): ResultAsync<string[], BlockchainUnavailableError>;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError>;
  getBalanceByAsset(assetAddress: EthereumAddress): ResultAsync<AssetBalance, BalancesUnavailableError>;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    null,
    RouterChannelUnknownError | CoreUninitializedError | NodeError | Error | BlockchainUnavailableError
  >;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<void, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error>;

  mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, BlockchainUnavailableError>;
}
