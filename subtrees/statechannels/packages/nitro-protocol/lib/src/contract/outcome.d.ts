import { Address, Bytes, Bytes32, Uint256 } from './types';
export declare enum AssetOutcomeType {
    AllocationOutcomeType = 0,
    GuaranteeOutcomeType = 1
}
export interface Guarantee {
    targetChannelId: Bytes32;
    destinations: Bytes32[];
}
export declare function encodeGuarantee(guarantee: Guarantee): Bytes32;
export declare function decodeGuarantee(encodedGuarantee: Bytes): Guarantee;
export declare function isGuarantee(allocationOrGuarantee: Allocation | Guarantee): allocationOrGuarantee is Guarantee;
export declare type Allocation = AllocationItem[];
export interface AllocationItem {
    destination: Bytes32;
    amount: Uint256;
}
export declare function encodeAllocation(allocation: Allocation): Bytes32;
export declare function decodeAllocation(encodedAllocation: Bytes): Allocation;
export declare function isAllocation(allocationOrGuarantee: Allocation | Guarantee): allocationOrGuarantee is Allocation;
export interface GuaranteeAssetOutcome {
    assetHolderAddress: Address;
    guarantee: Guarantee;
}
export declare function isGuaranteeOutcome(assetOutcome: AssetOutcome): assetOutcome is GuaranteeAssetOutcome;
export interface AllocationAssetOutcome {
    assetHolderAddress: Address;
    allocationItems: AllocationItem[];
}
export declare function isAllocationOutcome(assetOutcome: AssetOutcome): assetOutcome is AllocationAssetOutcome;
export declare function encodeAssetOutcomeFromBytes(assetOutcomeType: AssetOutcomeType, encodedAllocationOrGuarantee: Bytes): Bytes32;
export declare function decodeOutcomeItem(encodedAssetOutcome: Bytes, assetHolderAddress: string): AssetOutcome;
export declare function hashAssetOutcome(allocationOrGuarantee: Allocation | Guarantee): Bytes32;
export declare function encodeAssetOutcome(allocationOrGuarantee: Allocation | Guarantee): Bytes32;
export declare type AssetOutcome = AllocationAssetOutcome | GuaranteeAssetOutcome;
export declare type Outcome = AssetOutcome[];
export declare function hashOutcome(outcome: Outcome): Bytes32;
export declare function decodeOutcome(encodedOutcome: Bytes): Outcome;
export declare function encodeOutcome(outcome: Outcome): Bytes32;
//# sourceMappingURL=outcome.d.ts.map