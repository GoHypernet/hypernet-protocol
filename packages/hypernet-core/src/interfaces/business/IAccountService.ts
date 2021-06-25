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
  AssetInfo,
  BigNumberString,
  PersistenceError,
} from "@hypernetlabs/objects";
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
    amount: BigNumberString,
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
    amount: BigNumberString,
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
  setPreferredPaymentToken(
    tokenAddress: EthereumAddress,
  ): ResultAsync<void, PersistenceError>;
  getPreferredPaymentToken(): ResultAsync<
    AssetInfo,
    BlockchainUnavailableError | PersistenceError
  >;
  setPaymentsAutoAccept(
    autoAccept: boolean,
  ): ResultAsync<void, PersistenceError>;
  getPaymentsAutoAccept(): ResultAsync<boolean, PersistenceError>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
