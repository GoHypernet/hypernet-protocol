import { FundingStrategy } from '@statechannels/client-api-schema';
export declare type Uint256 = string & {
    _isUint256: void;
};
export interface DomainBudget {
    domain: string;
    hubAddress: string;
    forAsset: Record<string, AssetBudget | undefined>;
}
interface ChannelBudgetEntry {
    amount: Uint256;
}
export interface AssetBudget {
    assetHolderAddress: string;
    availableReceiveCapacity: Uint256;
    availableSendCapacity: Uint256;
    channels: Record<string, ChannelBudgetEntry>;
}
export interface Participant {
    participantId: string;
    signingAddress: string;
    destination: Destination;
}
export interface StateVariables {
    outcome: Outcome;
    turnNum: number;
    appData: string;
    isFinal: boolean;
}
export declare type StateVariablesWithHash = StateVariables & Hashed;
export declare type Destination = string & {
    _isDestination: void;
};
export interface AllocationItem {
    destination: Destination;
    amount: Uint256;
}
export interface SimpleAllocation {
    type: 'SimpleAllocation';
    assetHolderAddress: string;
    allocationItems: AllocationItem[];
}
export interface SimpleGuarantee {
    type: 'SimpleGuarantee';
    targetChannelId: string;
    assetHolderAddress: string;
    destinations: string[];
}
export interface MixedAllocation {
    type: 'MixedAllocation';
    simpleAllocations: SimpleAllocation[];
}
export declare type Allocation = SimpleAllocation | MixedAllocation;
export declare type Outcome = Allocation | SimpleGuarantee;
export declare function isAllocation(outcome: Outcome): outcome is Allocation;
export interface ChannelConstants {
    chainId: string;
    participants: Participant[];
    channelNonce: number;
    appDefinition: string;
    challengeDuration: number;
}
export interface State extends ChannelConstants, StateVariables {
}
export interface Signed {
    signatures: SignatureEntry[];
}
export interface Hashed {
    stateHash: string;
}
export declare type StateWithHash = State & Hashed;
export declare type SignedState = State & Signed;
export declare type SignedStateWithHash = SignedState & Hashed;
export declare type SignedStateVariables = StateVariables & Signed;
export declare type SignedStateVarsWithHash = SignedStateVariables & Hashed;
declare type _Objective<Name, Data> = {
    participants: Participant[];
    type: Name;
    data: Data;
};
export declare type OpenChannel = _Objective<'OpenChannel', {
    targetChannelId: string;
    fundingStrategy: FundingStrategy;
}>;
export declare type VirtuallyFund = _Objective<'VirtuallyFund', {
    targetChannelId: string;
    jointChannelId: string;
}>;
export declare type FundGuarantor = _Objective<'FundGuarantor', {
    jointChannelId: string;
    ledgerId: string;
    guarantorId: string;
}>;
export declare type FundLedger = _Objective<'FundLedger', {
    ledgerId: string;
}>;
export declare type CloseLedger = _Objective<'CloseLedger', {
    ledgerId: string;
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
export declare const isFundLedger: (o: Objective) => o is _Objective<"FundLedger", {
    ledgerId: string;
}>;
export declare const isCloseLedger: (o: Objective) => o is _Objective<"CloseLedger", {
    ledgerId: string;
}>;
declare type GetChannel = {
    type: 'GetChannel';
    channelId: string;
};
export declare type ChannelRequest = GetChannel;
export interface Message {
    signedStates?: SignedState[];
    objectives?: Objective[];
    requests?: ChannelRequest[];
}
export declare type ChannelStoredData = {
    stateVariables: Array<SignedStateVarsWithHash>;
    channelConstants: ChannelConstants;
    funding: Funding | undefined;
    applicationDomain: string | undefined;
    myIndex: number;
};
export interface SignatureEntry {
    signature: string;
    signer: string;
}
interface DirectFunding {
    type: 'Direct';
}
interface IndirectFunding {
    type: 'Indirect';
    ledgerId: string;
}
export interface VirtualFunding {
    type: 'Virtual';
    jointChannelId: string;
}
interface Guarantee {
    type: 'Guarantee';
    guarantorChannelId: string;
}
interface Guarantees {
    type: 'Guarantees';
    guarantorChannelIds: [string, string];
}
export declare type Funding = DirectFunding | IndirectFunding | VirtualFunding | Guarantees | Guarantee;
export declare function isIndirectFunding(funding?: Funding): funding is IndirectFunding;
export declare function isVirtualFunding(funding?: Funding): funding is VirtualFunding;
export declare function isGuarantee(funding?: Funding): funding is Guarantee;
export declare function isGuarantees(funding?: Funding): funding is Guarantees;
export {};
//# sourceMappingURL=types.d.ts.map