import {
  Balances,
  EthereumAddress,
  PrivateCredentials,
  PublicIdentifier,
  Signature,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  VectorError,
  InvalidParametersError,
  BigNumberString,
  ActiveStateChannel,
  PersistenceError,
  ChainId,
  UtilityMessageSignature,
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
  getActiveStateChannels(): ResultAsync<
    ActiveStateChannel[],
    VectorError | BlockchainUnavailableError | PersistenceError
  >;
  createStateChannel(
    routerPublicIdentifiers: PublicIdentifier[],
    chainId: ChainId,
  ): ResultAsync<
    ActiveStateChannel,
    BlockchainUnavailableError | VectorError | PersistenceError
  >;
  depositFunds(
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
    amount: BigNumberString,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError
  >;
  withdrawFunds(
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError
  >;
  getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | BlockchainUnavailableError
  >;
  providePrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError>;
  signMessage(
    message: string,
  ): ResultAsync<
    UtilityMessageSignature,
    BlockchainUnavailableError | VectorError
  >;
}

export const IAccountServiceType = Symbol.for("IAccountService");
