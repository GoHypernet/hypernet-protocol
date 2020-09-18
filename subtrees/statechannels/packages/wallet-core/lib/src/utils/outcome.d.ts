import { AllocationItem, SimpleAllocation, SimpleGuarantee, Outcome, Allocation, Destination } from '../types';
export declare function isSimpleAllocation(outcome: Outcome): outcome is SimpleAllocation;
export declare function isSimpleEthAllocation(outcome: Outcome): outcome is SimpleAllocation;
export declare function assertSimpleEthAllocation(outcome: Outcome): SimpleAllocation;
export declare const simpleEthAllocation: (allocationItems: AllocationItem[]) => SimpleAllocation;
export declare const simpleEthGuarantee: (targetChannelId: string, ...destinations: string[]) => SimpleGuarantee;
export declare const simpleTokenAllocation: (assetHolderAddress: string, allocationItems: AllocationItem[]) => SimpleAllocation;
export declare enum Errors {
    DestinationMissing = "Destination missing from ledger channel",
    InsufficientFunds = "Insufficient funds in ledger channel",
    InvalidOutcomeType = "Invalid outcome type"
}
export declare function allocateToTarget(currentOutcome: Outcome, deductions: readonly AllocationItem[], targetChannelId: string): Allocation;
export declare function makeDestination(addressOrDestination: string): Destination;
//# sourceMappingURL=outcome.d.ts.map