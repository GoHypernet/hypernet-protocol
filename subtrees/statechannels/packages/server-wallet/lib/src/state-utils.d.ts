import { ChannelConstants, Hashed, SignedStateVarsWithHash, State } from '@statechannels/wallet-core';
import { Channel } from './models/channel';
export declare const dropNonVariables: (s: SignedStateVarsWithHash) => SignedStateVarsWithHash;
export declare const dropNonConstants: (s: State) => ChannelConstants;
export declare const addHash: <T extends State = State>(s: T) => T & Hashed;
export declare const addHashes: (c: Channel) => Channel;
export declare const addChannelId: <T extends ChannelConstants = ChannelConstants>(c: T) => T & {
    channelId: string;
};
//# sourceMappingURL=state-utils.d.ts.map