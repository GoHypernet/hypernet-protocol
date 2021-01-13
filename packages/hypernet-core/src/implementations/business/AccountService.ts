import { NodeError } from "@connext/vector-types";
import { IAccountService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import {
  Balances,
  BigNumber,
  EthereumAddress,
  HypernetContext,
  InitializedHypernetContext,
  PublicIdentifier,
  ResultAsync,
} from "@interfaces/objects";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  CoreUninitializedError,
  LogicalError,
} from "@interfaces/objects/errors";
import { IContextProvider, ILogUtils } from "@interfaces/utilities";
import { combine, okAsync } from "neverthrow";

/**
 *
 */
export class AccountService implements IAccountService {
  constructor(
    protected accountRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
    protected logUtils: ILogUtils,
  ) {}

  public getPublicIdentifier(): ResultAsync<PublicIdentifier, NodeError | LogicalError> {
    return this.accountRepository.getPublicIdentifier();
  }

  public getAccounts(): ResultAsync<string[], BlockchainUnavailableError> {
    return this.accountRepository.getAccounts();
  }

  public getBalances(): ResultAsync<Balances, BalancesUnavailableError | CoreUninitializedError> {
    return this.accountRepository.getBalances();
  }

  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | NodeError | Error
  > {
    this.logUtils.log(`HypernetCore:depositFunds: assetAddress: ${assetAddress}`);

    const prerequisites = (combine([
      this.contextProvider.getContext(),
      this.accountRepository.depositFunds(assetAddress, amount) as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [HypernetContext, null],
      BlockchainUnavailableError | CoreUninitializedError | NodeError | Error
    >;

    let context: HypernetContext;

    return prerequisites
      .andThen((vals) => {
        [context] = vals;

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
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | CoreUninitializedError | BlockchainUnavailableError | NodeError | Error
  > {
    const prerequisites = (combine([
      this.contextProvider.getInitializedContext(),
      this.accountRepository.depositFunds(assetAddress, amount) as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [InitializedHypernetContext, null],
      BlockchainUnavailableError | CoreUninitializedError | NodeError | Error
    >;

    let context: InitializedHypernetContext;

    return prerequisites
      .andThen((vals) => {
        [context] = vals;
        return this.accountRepository.withdrawFunds(assetAddress, amount, destinationAddress);
      })
      .andThen(() => {
        return this.accountRepository.getBalances();
      })
      .andThen((balances) => {
        context.onBalancesChanged.next(balances);

        return okAsync(balances);
      });
  }
}
