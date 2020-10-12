import { Channel } from './channel';
import { Outcome } from './outcome';
import { Address, Bytes32, Uint256, Uint48 } from './types';
export interface State {
    turnNum: number;
    isFinal: boolean;
    channel: Channel;
    challengeDuration: number;
    outcome: Outcome;
    appDefinition: string;
    appData: string;
}
export interface FixedPart {
    chainId: Uint256;
    participants: Address[];
    channelNonce: Uint48;
    appDefinition: Address;
    challengeDuration: Uint48;
}
export declare function getFixedPart(state: State): FixedPart;
export interface VariablePart {
    outcome: Bytes32;
    appData: Bytes32;
}
export declare function getVariablePart(state: State): VariablePart;
export declare function hashAppPart(state: State): Bytes32;
export declare function hashState(state: State): Bytes32;
//# sourceMappingURL=state.d.ts.map