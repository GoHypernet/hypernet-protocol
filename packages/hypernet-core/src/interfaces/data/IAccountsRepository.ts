export interface IAccountsRepository {
  getAccounts(): Promise<string[]>;
}
