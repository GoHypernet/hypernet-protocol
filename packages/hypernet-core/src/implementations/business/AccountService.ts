import { IAccountService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { Balances, BigNumber, PublicIdentifier } from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities";

/**
 * 
 */
export class AccountService implements IAccountService {
  constructor(protected accountRepository: IAccountsRepository, protected contextProvider: IContextProvider) {}

  public getPublicIdentifier(): Promise<PublicIdentifier> {
    return this.accountRepository.getPublicIdentifier();
  }

  public async getAccounts(): Promise<string[]> {
    return this.accountRepository.getAccounts();
  }

  public async getBalances(): Promise<Balances> {
    return this.accountRepository.getBalances();
  }

  public async depositFunds(assetAddress: string, amount: BigNumber): Promise<Balances> {
    const context = await this.contextProvider.getInitializedContext();

    console.log(`HypernetCore:depositFunds: assetAddress: ${assetAddress}`)
    await this.accountRepository.depositFunds(assetAddress, amount);

    const balances = await this.accountRepository.getBalances();

    context.onBalancesChanged.next(balances);

    return balances;
  }
  
  public async withdrawFunds(assetAddress: string, amount: BigNumber, destinationAddress: string): Promise<Balances> {
    const context = await this.contextProvider.getInitializedContext();
    await this.accountRepository.withdrawFunds(assetAddress, amount, destinationAddress);

    const balances = await this.accountRepository.getBalances();

    context.onBalancesChanged.next(balances);

    return balances;
  }
}
