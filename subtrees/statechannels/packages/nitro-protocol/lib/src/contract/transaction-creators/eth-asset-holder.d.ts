import { ethers } from 'ethers';
import { Allocation, Guarantee, Outcome } from '../outcome';
export declare function createTransferAllTransaction(channelId: string, allocation: Allocation): ethers.providers.TransactionRequest;
export declare function createClaimAllTransaction(channelId: string, guarantee: Guarantee, allocation: Allocation): ethers.providers.TransactionRequest;
export declare function createSetOutcomeTransaction(channelId: string, outcome: Outcome): ethers.providers.TransactionRequest;
export declare function createDepositTransaction(destination: string, expectedHeld: string, amount: string): ethers.providers.TransactionRequest;
//# sourceMappingURL=eth-asset-holder.d.ts.map