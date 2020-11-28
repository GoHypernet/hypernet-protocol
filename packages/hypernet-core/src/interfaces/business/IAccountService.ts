import { AssetBalance, Balances, BigNumber, EthereumAddress } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountService {
  getAccounts(): Promise<string[]>;
  depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<Balances>;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): Promise<Balances>;
  getBalances(): Promise<Balances>;
}
