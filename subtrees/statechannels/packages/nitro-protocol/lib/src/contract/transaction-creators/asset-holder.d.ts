import { ethers } from 'ethers';
import { Allocation, Guarantee, Outcome } from '../outcome';
export declare function createTransferAllTransaction(assetHolderContractInterface: ethers.utils.Interface, channelId: string, allocation: Allocation): ethers.providers.TransactionRequest;
export declare function claimAllArgs(channelId: string, guarantee: Guarantee, allocation: Allocation): any[];
export declare function createClaimAllTransaction(assetHolderContractInterface: ethers.utils.Interface, channelId: string, guarantee: Guarantee, allocation: Allocation): ethers.providers.TransactionRequest;
export declare function createSetOutcomeTransaction(assetHolderContractInterface: ethers.utils.Interface, channelId: string, outcome: Outcome): ethers.providers.TransactionRequest;
//# sourceMappingURL=asset-holder.d.ts.map