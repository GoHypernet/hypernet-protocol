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
  Signature,
  BigNumberString,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { IAccountService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import {
  HypernetContext,
  InitializedHypernetContext,
} from "@interfaces/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IContextProvider, IBlockchainProvider } from "@interfaces/utilities";

/**
 *
 */
export class AccountService implements IAccountService {
  constructor(
    protected accountRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
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
    BalancesUnavailableError | VectorError
  > {
    return this.accountRepository.getBalances();
  }

  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumberString,
  ): ResultAsync<
    Balances,
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | VectorError
    | LogicalError
  > {
    this.logUtils.log(
      `HypernetCore:depositFunds: assetAddress: ${assetAddress}`,
    );

    let context: HypernetContext;

    return this.contextProvider
      .getContext()
      .andThen((contextVal) => {
        context = contextVal;

        return this.accountRepository.depositFunds(assetAddress, amount);
      })
      .andThen(() => {
        return this.accountRepository.getBalances();
      })
      .andThen((balances) => {
        context.onBalancesChanged.next(balances);

        return okAsync(balances);
      });
  }

  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError
  > {
    let context: InitializedHypernetContext;

    return this.contextProvider
      .getInitializedContext()
      .andThen((contextVal) => {
        context = contextVal;
        return this.accountRepository.withdrawFunds(
          assetAddress,
          amount,
          destinationAddress,
        );
      })
      .andThen(() => {
        return this.accountRepository.getBalances();
      })
      .andThen((balances) => {
        context.onBalancesChanged.next(balances);

        return okAsync(balances);
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
}
