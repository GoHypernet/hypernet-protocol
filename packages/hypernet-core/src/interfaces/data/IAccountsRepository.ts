import { NodeError } from "@connext/vector-types";
import { EthereumAddress, BigNumber, Balances, AssetBalance, PublicIdentifier, ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError, CoreUninitializedError, RouterChannelUnknownError } from "@interfaces/objects/errors";
import { BalancesUnavailableError } from "@interfaces/objects/errors/BalancesUnavailableError";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  getPublicIdentifier(): ResultAsync<PublicIdentifier, NodeError | Error>;
  getAccounts(): ResultAsync<string[], BlockchainUnavailableError>;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError>;
  getBalanceByAsset(assetAddress: EthereumAddress): ResultAsync<AssetBalance, BalancesUnavailableError>;
  depositFunds(assetAddress: EthereumAddress, amount: BigNumber): ResultAsync<null, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error | BlockchainUnavailableError>;
  withdrawFunds(assetAddress: string, amount: BigNumber, destinationAddress: string): ResultAsync<null, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error>;

  mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<null, BlockchainUnavailableError>;
}
