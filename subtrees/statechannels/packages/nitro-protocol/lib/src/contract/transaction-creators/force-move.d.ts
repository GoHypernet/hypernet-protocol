import { Signature, ethers } from 'ethers';
import { State } from '../state';
export declare const ForceMoveContractInterface: any;
interface CheckpointData {
    challengeState?: State;
    states: State[];
    signatures: Signature[];
    whoSignedWhat: number[];
}
export declare function createForceMoveTransaction(states: State[], signatures: Signature[], whoSignedWhat: number[], challengerPrivateKey: string): ethers.providers.TransactionRequest;
interface RespondArgs {
    challengeState: State;
    responseState: State;
    responseSignature: Signature;
}
export declare function respondArgs({ challengeState, responseState, responseSignature, }: RespondArgs): any[];
export declare function createRespondTransaction(args: RespondArgs): ethers.providers.TransactionRequest;
export declare function createCheckpointTransaction({ states, signatures, whoSignedWhat, }: CheckpointData): ethers.providers.TransactionRequest;
export declare function checkpointArgs({ states, signatures, whoSignedWhat }: CheckpointData): any[];
export declare function createConcludeTransaction(states: State[], signatures: Signature[], whoSignedWhat: number[]): ethers.providers.TransactionRequest;
export declare function concludeArgs(states: State[], signatures: Signature[], whoSignedWhat: number[]): any[];
export {};
//# sourceMappingURL=force-move.d.ts.map