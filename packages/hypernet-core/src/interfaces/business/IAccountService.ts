import { NodeError } from "@connext/vector-types";
import { Balances, BigNumber, EthereumAddress, PublicIdentifier, ResultAsync } from "@interfaces/objects";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  CoreUninitializedError,
  LogicalError,
} from "@interfaces/objects/errors";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountService {
  getPublicIdentifier(): ResultAsync<PublicIdentifier, NodeError | LogicalError>;
  getAccounts(): ResultAsync<string[], BlockchainUnavailableError>;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | NodeError | Error
  >;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | NodeError | Error
  >;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError>;
}
