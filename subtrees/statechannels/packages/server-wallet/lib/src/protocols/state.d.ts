import { SignedStateWithHash, State, Participant } from '@statechannels/wallet-core';
import { ChannelResult } from '@statechannels/client-api-schema';
import { Address, Uint256 } from '../type-aliases';
import { ProtocolAction } from './actions';
export declare type ChannelState = {
    channelId: string;
    myIndex: 0 | 1;
    participants: Participant[];
    support?: SignedStateWithHash[];
    supported?: SignedStateWithHash;
    latest: SignedStateWithHash;
    latestSignedByMe?: SignedStateWithHash;
    funding: (address: Address) => Uint256;
};
declare type WithSupported = {
    supported: SignedStateWithHash;
};
declare type SignedByMe = {
    latestSignedByMe: SignedStateWithHash;
};
export declare type ChannelStateWithMe = ChannelState & SignedByMe;
export declare type ChannelStateWithSupported = ChannelState & SignedByMe & WithSupported;
export declare type Stage = 'Missing' | 'PrefundSetup' | 'PostfundSetup' | 'Running' | 'Final';
export declare const stage: (state: State | undefined) => Stage;
export declare const toChannelResult: (channelState: ChannelState) => ChannelResult;
export declare type ProtocolResult<A extends ProtocolAction = ProtocolAction> = A | undefined;
export declare type Protocol<PS> = (ps: PS) => ProtocolResult;
export {};
//# sourceMappingURL=state.d.ts.map