import { EthereumAddress, BigNumber } from "@interfaces/objects";

export interface IAccountsRepository {
  getAccounts(): Promise<string[]>;
  depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<void>;
}
