import {
  Balances,
  EthereumAddress,
  InvalidParametersError,
  PrivateCredentials,
  PublicIdentifier,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  LogicalError,
  VectorError,
  RouterChannelUnknownError,
  PreferredPaymentTokenError,
  Signature,
  AssetInfo,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { errAsync, ResultAsync } from "neverthrow";

import { IAccountService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { IBlockchainProvider } from "@interfaces/utilities";

/**
 *
 */
export class AccountService implements IAccountService {
  constructor(
    protected accountRepository: IAccountsRepository,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
  ) {}

  public getPublicIdentifier(): ResultAsync<
    PublicIdentifier,
    BlockchainUnavailableError | VectorError
  > {
    return this.accountRepository.getPublicIdentifier();
  }

  public getAccounts(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this.accountRepository.getAccounts();
  }

  public getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | RouterChannelUnknownError
  > {
    return this.accountRepository.getBalances();
  }

  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    | BalancesUnavailableError
    | RouterChannelUnknownError
    | BlockchainUnavailableError
    | VectorError
    | LogicalError
  > {
    this.logUtils.log(
      `HypernetCore:depositFunds: assetAddress: ${assetAddress}`,
    );

    return this.accountRepository
      .depositFunds(assetAddress, amount)
      .andThen(() => {
        return this.accountRepository.refreshBalances();
      });
  }

  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    | BalancesUnavailableError
    | RouterChannelUnknownError
    | BlockchainUnavailableError
    | VectorError
  > {
    return this.accountRepository
      .withdrawFunds(assetAddress, amount, destinationAddress)
      .andThen(() => {
        return this.accountRepository.refreshBalances();
      });
  }

  public providePrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError> {
    if (!privateCredentials.mnemonic && !privateCredentials.privateKey) {
      return errAsync(
        new InvalidParametersError(
          "You must provide a mnemonic or private key",
        ),
      );
    }

    return this.blockchainProvider.supplyPrivateCredentials(privateCredentials);
  }

  public signMessage(
    message: string,
  ): ResultAsync<Signature, BlockchainUnavailableError | VectorError> {
    return this.accountRepository.signMessage(message);
  }

  public setPreferredPaymentToken(
    tokenAddress: EthereumAddress,
  ): ResultAsync<void, PreferredPaymentTokenError> {
    return this.accountRepository.setPreferredPaymentToken(tokenAddress);
  }

  public getPreferredPaymentToken(): ResultAsync<
    AssetInfo,
    BlockchainUnavailableError | PreferredPaymentTokenError
  > {
    return this.accountRepository.getPreferredPaymentToken();
  }
}
