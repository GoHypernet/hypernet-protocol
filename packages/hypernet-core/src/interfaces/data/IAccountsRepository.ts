import { EthereumAddress, BigNumber, Balances } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  getAccounts(): Promise<string[]>;
  getBalances(): Promise<Balances>;
  depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<void>;
  withdrawFunds(assetAddress: string, amount: BigNumber, destinationAddress: string): Promise<void>;
}