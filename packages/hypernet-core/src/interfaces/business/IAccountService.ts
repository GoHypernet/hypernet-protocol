import { BigNumber } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IAccountService {
    getAccounts(): Promise<string[]>;
    depositFunds(assetAddress: string, amount: BigNumber): Promise<void>;
}