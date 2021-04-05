import { BigNumber } from "ethers";
import { Balances, EthereumAddress, PublicIdentifier } from "@hypernetlabs/objects";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  LogicalError,
  VectorError,
  RouterChannelUnknownError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountService {
  getPublicIdentifier(): ResultAsync<PublicIdentifier, BlockchainUnavailableError | VectorError>;
  getAccounts(): ResultAsync<string[], BlockchainUnavailableError>;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | RouterChannelUnknownError | BlockchainUnavailableError | VectorError | LogicalError
  >;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | RouterChannelUnknownError | BlockchainUnavailableError | VectorError
  >;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | VectorError | RouterChannelUnknownError>;
}
