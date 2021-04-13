import { EthereumAddress, Balances, AssetBalance, PublicIdentifier } from "@hypernetlabs/objects";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  LogicalError,
  RouterChannelUnknownError,
  VectorError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  getPublicIdentifier(): ResultAsync<PublicIdentifier, BlockchainUnavailableError | VectorError>;
  getAccounts(): ResultAsync<EthereumAddress[], BlockchainUnavailableError>;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | VectorError | RouterChannelUnknownError>;
  getBalanceByAsset(
    assetAddress: EthereumAddress,
  ): ResultAsync<
    AssetBalance,
    BalancesUnavailableError | VectorError | RouterChannelUnknownError | InvalidParametersError
  >;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    null,
    RouterChannelUnknownError | VectorError | LogicalError | BlockchainUnavailableError | InvalidParametersError
  >;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<void, RouterChannelUnknownError | VectorError | BlockchainUnavailableError | InvalidParametersError>;

  mintTestToken(
    amount: BigNumber,
    to: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError | InvalidParametersError>;
}
