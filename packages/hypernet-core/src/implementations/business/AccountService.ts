import { IAccountService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { BigNumber } from "@interfaces/objects";

export class AccountService implements IAccountService {
    constructor(protected accountRepository: IAccountsRepository) {}
    
    public async getAccounts(): Promise<string[]> {
        return this.accountRepository.getAccounts();
      }

      public async depositFunds(assetAddress: string, amount: BigNumber): Promise<void> {
        return this.accountRepository.depositFunds(assetAddress, amount);
      }
}