import { Outcome } from './outcome';
import { State } from './state';
import { Address, Bytes, Bytes32, Uint48 } from './types';
export interface ChannelData {
    turnNumRecord: Uint48;
    finalizesAt: Uint48;
    state?: State;
    challengerAddress?: Address;
    outcome?: Outcome;
}
export interface ChannelDataLite {
    finalizesAt: Uint48;
    state: State;
    challengerAddress: Address;
    outcome: Outcome;
}
export declare function channelDataToChannelStorageHash(channelData: ChannelData): Bytes32;
export declare function parseChannelStorageHash(channelStorageHash: Bytes32): {
    turnNumRecord: number;
    finalizesAt: number;
    fingerprint: Bytes;
};
export declare function channelDataStruct({ finalizesAt, state, challengerAddress, turnNumRecord, outcome, }: ChannelData): {
    turnNumRecord: number;
    finalizesAt: number;
    stateHash: string;
    challengerAddress: string;
    outcomeHash: string;
};
export declare function encodeChannelData(data: ChannelData): Bytes;
export declare function channelDataLiteStruct({ finalizesAt, challengerAddress, state, outcome, }: ChannelDataLite): {
    finalizesAt: number;
    challengerAddress: string;
    stateHash: string;
    outcomeHash: string;
};
export declare function encodeChannelStorageLite(channelDataLite: ChannelDataLite): Bytes;
//# sourceMappingURL=channel-storage.d.ts.map