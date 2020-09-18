import { StateVariables } from '@statechannels/wallet-core';
import { ChannelState, ChannelStateWithSupported, ChannelStateWithMe } from '../protocols/state';
export declare const hasStateSignedByMe: (cs: ChannelState) => cs is ChannelStateWithMe;
export declare const hasSupportedState: (cs: ChannelState) => cs is ChannelStateWithSupported;
export declare const isMyTurn: (cs: ChannelStateWithSupported) => boolean;
export declare const latest: (cs: ChannelState) => StateVariables;
export declare const supported: (cs: ChannelStateWithSupported) => StateVariables;
export declare const latestSignedByMe: (cs: ChannelStateWithMe) => StateVariables;
//# sourceMappingURL=helpers.d.ts.map