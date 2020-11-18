import { EthereumAddress, BigNumber } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountsRepository {
  getAccounts(): Promise<string[]>;
  depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<void>;
}