import { BigNumber } from "ethers";
import { Balances, EthereumAddress, IPrivateCredentials, PublicIdentifier } from "@hypernetlabs/objects";
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
  providePrivateCredentials(privateCredentials: IPrivateCredentials): ResultAsync<void, InvalidParametersError>;
}
