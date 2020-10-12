import { providers, Signature } from 'ethers';
import { Outcome } from '../outcome';
import { State } from '../state';
export declare function createPushOutcomeTransaction(turnNumRecord: number, finalizesAt: number, state: State, outcome: Outcome): providers.TransactionRequest;
export declare function concludePushOutcomeAndTransferAllArgs(states: State[], signatures: Signature[], whoSignedWhat: number[]): any[];
export declare function createConcludePushOutcomeAndTransferAllTransaction(states: State[], signatures: Signature[], whoSignedWhat: number[]): providers.TransactionRequest;
//# sourceMappingURL=nitro-adjudicator.d.ts.map