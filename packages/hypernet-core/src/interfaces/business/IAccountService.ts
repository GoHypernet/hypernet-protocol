import { BigNumber } from "ethers";
import { Balances, EthereumAddress, PrivateCredentials, PublicIdentifier } from "@hypernetlabs/objects";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  LogicalError,
  VectorError,
  RouterChannelUnknownError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountService {
  getPublicIdentifier(): ResultAsync<PublicIdentifier, BlockchainUnavailableError | VectorError>;
  getAccounts(): ResultAsync<EthereumAddress[], BlockchainUnavailableError>;
  depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    | BalancesUnavailableError
    | RouterChannelUnknownError
    | BlockchainUnavailableError
    | VectorError
    | LogicalError
    | InvalidParametersError
  >;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    | BalancesUnavailableError
    | RouterChannelUnknownError
    | BlockchainUnavailableError
    | VectorError
    | InvalidParametersError
  >;
  getBalances(): ResultAsync<Balances, BalancesUnavailableError | VectorError | RouterChannelUnknownError>;
  providePrivateCredentials(privateCredentials: PrivateCredentials): ResultAsync<void, InvalidParametersError>;
}
