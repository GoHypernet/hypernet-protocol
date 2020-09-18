import { SignedState, Participant } from './types';
declare type _Objective<Name, Data> = {
    participants: Participant[];
    type: Name;
} & Data;
export declare type OpenChannel = _Objective<'OpenChannel', {
    targetChannelId: string;
}>;
export declare type VirtuallyFund = _Objective<'VirtuallyFund', {
    targetChannelId: string;
    jointChannelId: string;
}>;
export declare type FundGuarantor = _Objective<'FundGuarantor', {
    jointChannelId: string;
    ledgerChannelId: string;
    guarantorId: string;
}>;
export declare type Objective = OpenChannel | VirtuallyFund | FundGuarantor;
export declare const isOpenChannel: (o: Objective) => o is _Objective<"OpenChannel", {
    targetChannelId: string;
}>;
export declare const isVirtuallyFund: (o: Objective) => o is _Objective<"VirtuallyFund", {
    targetChannelId: string;
    jointChannelId: string;
}>;
export declare const isFundGuarantor: (o: Objective) => o is _Objective<"FundGuarantor", {
    jointChannelId: string;
    ledgerChannelId: string;
    guarantorId: string;
}>;
export interface Message {
    signedStates?: SignedState[];
    objectives?: Objective[];
}
export {};
//# sourceMappingURL=wire-protocol.d.ts.map