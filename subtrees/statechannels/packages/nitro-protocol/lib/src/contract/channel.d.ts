import { Address, Bytes32, Uint256, Uint48 } from './types';
export interface Channel {
    channelNonce: Uint48;
    participants: Address[];
    chainId: Uint256;
}
export declare function getChannelId(channel: Channel): Bytes32;
//# sourceMappingURL=channel.d.ts.map