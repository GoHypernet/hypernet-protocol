import { Balances, BigNumber, EthereumAddress, PublicIdentifier } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountService {
  getPublicIdentifier(): Promise<PublicIdentifier>;
  getAccounts(): Promise<string[]>;
  depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<Balances>;
  withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumber,
    destinationAddress: EthereumAddress,
  ): Promise<Balances>;
  getBalances(): Promise<Balances>;
}
