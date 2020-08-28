import { IAccountsRepository } from "@interfaces/data/IAccountsRepository";
import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";

export class AccountsRepository implements IAccountsRepository {
  constructor(protected web3Provider: IWeb3Provider) {}

  public async getAccounts(): Promise<string[]> {
    const web3 = await this.web3Provider.getWeb3();

    return await web3.eth.getAccounts();
  }
}
