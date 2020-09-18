import { State, StateWithHash } from '@statechannels/wallet-core';
export declare const initialized: Promise<any>;
export declare function fastSignState(state: StateWithHash, privateKey: string): Promise<{
    state: State;
    signature: string;
}>;
export declare function fastRecoverAddress(state: State, signature: string, stateHash: string): string;
export declare function fastSignData(hashedData: string, privateKey: string): Promise<string>;
//# sourceMappingURL=signatures.d.ts.map