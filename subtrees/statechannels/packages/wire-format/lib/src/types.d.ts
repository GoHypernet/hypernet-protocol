export declare type Address = string;
export declare type Bytes32 = string;
export declare type Uint48 = number;
export declare type Uint256 = string;
export declare type Bytes = string;
export interface Participant {
    participantId: string;
    signingAddress: Address;
    destination: Address;
}
export interface AllocationItem {
    destination: Bytes32;
    amount: Uint256;
}
export interface Allocation {
    assetHolderAddress: Address;
    allocationItems: AllocationItem[];
}
export declare type Allocations = Allocation[];
export interface Guarantee {
    assetHolderAddress: Address;
    targetChannelId: Bytes32;
    destinations: Bytes32[];
}
export declare type Guarantees = Guarantee[];
export declare type Outcome = Guarantees | Allocations;
export declare function isAllocations(outcome: Outcome): outcome is Allocations;
export interface SignedState {
    chainId: string;
    participants: Participant[];
    channelNonce: Uint48;
    appDefinition: Address;
    challengeDuration: Uint48;
    outcome: Outcome;
    turnNum: Uint48;
    appData: Bytes;
    isFinal: boolean;
    channelId: Bytes32;
    signatures: string[];
}
declare type _Objective<Name, Data> = {
    participants: Participant[];
    type: Name;
    data: Data;
};
declare type FundingStrategy = 'Direct' | 'Ledger' | 'Virtual';
export declare type OpenChannel = _Objective<'OpenChannel', {
    targetChannelId: Bytes32;
    fundingStrategy: FundingStrategy;
}>;
export declare type VirtuallyFund = _Objective<'VirtuallyFund', {
    targetChannelId: Bytes32;
    jointChannelId: Bytes32;
}>;
export declare type FundGuarantor = _Objective<'FundGuarantor', {
    jointChannelId: Bytes32;
    ledgerId: Bytes32;
    guarantorId: Bytes32;
}>;
export declare type FundLedger = _Objective<'FundLedger', {
    ledgerId: Bytes32;
}>;
export declare type CloseLedger = _Objective<'CloseLedger', {
    ledgerId: Bytes32;
}>;
export declare type Objective = OpenChannel | VirtuallyFund | FundGuarantor | FundLedger | CloseLedger;
export declare const isOpenChannel: (o: Objective) => o is _Objective<"OpenChannel", {
    targetChannelId: string;
    fundingStrategy: FundingStrategy;
}>;
export declare const isVirtuallyFund: (o: Objective) => o is _Objective<"VirtuallyFund", {
    targetChannelId: string;
    jointChannelId: string;
}>;
export declare const isFundGuarantor: (o: Objective) => o is _Objective<"FundGuarantor", {
    jointChannelId: string;
    ledgerId: string;
    guarantorId: string;
}>;
export interface Message {
    recipient: string;
    sender: string;
    data: {
        signedStates?: SignedState[];
        objectives?: Objective[];
    };
}
export {};
//# sourceMappingURL=types.d.ts.map