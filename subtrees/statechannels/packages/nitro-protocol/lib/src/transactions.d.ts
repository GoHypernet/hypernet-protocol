import { providers, Signature } from 'ethers';
import { State } from './contract/state';
import { SignedState } from './signatures';
export declare function getChannelStorage(provider: any, contractAddress: string, channelId: string): Promise<any>;
export declare function createForceMoveTransaction(signedStates: SignedState[], challengePrivateKey: string): providers.TransactionRequest;
export declare function createRespondTransaction(challengeState: State, response: SignedState): providers.TransactionRequest;
export declare function createCheckpointTransaction(signedStates: SignedState[]): providers.TransactionRequest;
export declare function createConcludePushOutcomeAndTransferAllTransaction(signedStates: SignedState[]): providers.TransactionRequest;
export declare function createConcludeTransaction(conclusionProof: SignedState[]): providers.TransactionRequest;
export declare function createSignatureArguments(signedStates: SignedState[]): {
    states: State[];
    signatures: Signature[];
    whoSignedWhat: number[];
};
//# sourceMappingURL=transactions.d.ts.map