import {
  Balances,
  EthereumAddress,
  PrivateCredentials,
  PublicIdentifier,
  Signature,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  LogicalError,
  VectorError,
  RouterChannelUnknownError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountService {
  getPublicIdentifier(): ResultAsync<
    PublicIdentifier,
    BlockchainUnavailableError | VectorError
  >;
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
  >;
  getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | RouterChannelUnknownError
  >;
  providePrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError>;
  signMessage(
    message: string,
  ): ResultAsync<Signature, BlockchainUnavailableError | VectorError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
