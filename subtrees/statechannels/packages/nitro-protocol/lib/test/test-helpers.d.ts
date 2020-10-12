import { Contract, ethers, BigNumberish, providers } from 'ethers';
import { AllocationAssetOutcome, Guarantee, Outcome, AllocationItem } from '../src/contract/outcome';
export interface AssetOutcomeShortHand {
    [destination: string]: BigNumberish;
}
export interface OutcomeShortHand {
    [assetHolder: string]: AssetOutcomeShortHand;
}
export interface AddressesLookup {
    [shorthand: string]: string | undefined;
}
export declare const getTestProvider: () => ethers.providers.JsonRpcProvider;
export declare function setupContracts(provider: ethers.providers.JsonRpcProvider, artifact: any, address: string): Promise<Contract>;
export declare function getPlaceHolderContractAddress(): string;
export declare const nonParticipant: ethers.Wallet;
export declare const clearedChallengeHash: (turnNumRecord?: number) => string;
export declare const ongoingChallengeHash: (turnNumRecord?: number) => string;
export declare const finalizedOutcomeHash: (turnNumRecord?: number, finalizesAt?: number, outcome?: Outcome, state?: any, challengerAddress?: any) => string;
export declare const newChallengeRegisteredEvent: (contract: Contract, channelId: string) => Promise<unknown>;
export declare const newChallengeClearedEvent: (contract: Contract, channelId: string) => Promise<unknown>;
export declare const newConcludedEvent: (contract: Contract, channelId: string) => Promise<unknown>;
export declare const newDepositedEvent: (contract: Contract, destination: string) => Promise<unknown>;
export declare const newTransferEvent: (contract: Contract, to: string) => Promise<unknown>;
export declare const newAssetTransferredEvent: (destination: string, payout: number) => {
    destination: string;
    amount: number;
};
export declare function randomChannelId(channelNonce?: number): string;
export declare const randomExternalDestination: () => string;
export declare function sendTransaction(provider: ethers.providers.JsonRpcProvider, contractAddress: string, transaction: providers.TransactionRequest): Promise<providers.TransactionReceipt>;
export declare function allocationToParams(allocation: AllocationItem[]): any[];
export declare function guaranteeToParams(guarantee: Guarantee): string[];
export declare function replaceAddressesAndBigNumberify(object: AssetOutcomeShortHand | OutcomeShortHand | string, addresses: AddressesLookup): AssetOutcomeShortHand | OutcomeShortHand | string;
export declare function resetMultipleHoldings(multipleHoldings: OutcomeShortHand, contractsArray: Contract[]): void;
export declare function checkMultipleHoldings(multipleHoldings: OutcomeShortHand, contractsArray: Contract[]): void;
export declare function checkMultipleAssetOutcomeHashes(channelId: string, outcome: OutcomeShortHand, contractsArray: Contract[]): void;
export declare function computeOutcome(outcomeShortHand: OutcomeShortHand): AllocationAssetOutcome[];
export declare function assetTransferredEventsFromPayouts(channelId: string, singleAssetPayouts: AssetOutcomeShortHand, assetHolder: string): any[];
export declare function compileEventsFromLogs(logs: any[], contractsArray: Contract[]): any[];
export declare function writeGasConsumption(filename: string, description: string, gas: BigNumberish): Promise<void>;
//# sourceMappingURL=test-helpers.d.ts.map