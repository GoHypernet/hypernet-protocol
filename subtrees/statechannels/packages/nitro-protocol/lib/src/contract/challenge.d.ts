import { ethers, Signature } from 'ethers';
import { SignedState } from '../signatures';
import { FixedPart, State, VariablePart } from './state';
import { Address, Bytes32, Uint8, Uint48 } from './types';
export declare function hashChallengeMessage(challengeState: State): Bytes32;
export interface ChallengeRegisteredEvent {
    challengerAddress: string;
    finalizesAt: number;
    challengeStates: SignedState[];
}
export interface ChallengeRegisteredStruct {
    channelId: Bytes32;
    turnNumRecord: Uint48;
    finalizesAt: Uint48;
    challenger: Address;
    isFinal: boolean;
    fixedPart: FixedPart;
    variableParts: VariablePart[];
    sigs: Signature[];
    whoSignedWhat: Uint8[];
}
export declare function getChallengeRegisteredEvent(eventResult: any): ChallengeRegisteredEvent;
export interface ChallengeClearedEvent {
    kind: 'respond' | 'checkpoint';
    newStates: SignedState[];
}
export interface ChallengeClearedStruct {
    channelId: string;
    newTurnNumRecord: string;
}
export interface RespondTransactionArguments {
    challenger: string;
    isFinalAb: [boolean, boolean];
    fixedPart: FixedPart;
    variablePartAB: [VariablePart, VariablePart];
    sig: Signature;
}
export declare function getChallengeClearedEvent(tx: ethers.Transaction, eventResult: any): ChallengeClearedEvent;
//# sourceMappingURL=challenge.d.ts.map