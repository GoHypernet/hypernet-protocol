import { IAccountService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { Balances, BigNumber } from "@interfaces/objects";

export class AccountService implements IAccountService {
  constructor(protected accountRepository: IAccountsRepository) { }

  public async getAccounts(): Promise<string[]> {
    return this.accountRepository.getAccounts();
  }
  public async getBalances(): Promise<Balances> {
    return this.accountRepository.getBalances();
  }
  public async depositFunds(assetAddress: string, amount: BigNumber): Promise<void> {
    return this.accountRepository.depositFunds(assetAddress, amount);
  }
  public async withdrawFunds(assetAddress: string, amount: BigNumber, destinationAddress: string): Promise<void> {
    return this.accountRepository.withdrawFunds(assetAddress, amount, destinationAddress);
  }
}