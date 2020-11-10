import { BigNumber } from "@interfaces/objects";

export interface IAccountService {
    getAccounts(): Promise<string[]>;
    depositFunds(assetAddress: string, amount: BigNumber): Promise<void>;
}