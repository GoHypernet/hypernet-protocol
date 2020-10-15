import { IAccountsRepository } from "@interfaces/data/IAccountsRepository";
import { IBlockchainProvider } from "@interfaces/utilities/IBlockchainProvider";

export class AccountsRepository implements IAccountsRepository {
  constructor(protected blockchainProvider: IBlockchainProvider) {}

  public async getAccounts(): Promise<string[]> {
    const provider = await this.blockchainProvider.getProvider();

    return await provider.listAccounts();
  }
}
