import { State as NitroState, SignedState as NitroSignedState, Outcome as NitroOutcome } from '@statechannels/nitro-protocol';
import { State, ChannelConstants, Outcome, SignedState, SignatureEntry } from './types';
export declare function toNitroState(state: State): NitroState;
export declare function fromNitroState(state: NitroState): State;
export declare function toNitroSignedState(signedState: SignedState): NitroSignedState[];
export declare function calculateChannelId(channelConstants: ChannelConstants): string;
export declare function createSignatureEntry(state: State, privateKey: string): SignatureEntry;
export declare function signState(state: State, privateKey: string): string;
export declare function hashState(state: State): string;
export declare function getSignerAddress(state: State, signature: string): string;
export declare function statesEqual(left: State, right: State): boolean;
export declare function outcomesEqual(left: Outcome, right?: Outcome): boolean;
export declare const firstState: (outcome: Outcome, { channelNonce, chainId, challengeDuration, appDefinition, participants }: ChannelConstants, appData?: string | undefined) => State;
export declare function convertToNitroOutcome(outcome: Outcome): NitroOutcome;
export declare function fromNitroOutcome(outcome: NitroOutcome): Outcome;
export declare function nextState(state: State, outcome: Outcome): {
    turnNum: number;
    outcome: Outcome;
    chainId: string;
    participants: import("./types").Participant[];
    channelNonce: number;
    appDefinition: string;
    challengeDuration: number;
    appData: string;
    isFinal: boolean;
};
//# sourceMappingURL=state-utils.d.ts.map