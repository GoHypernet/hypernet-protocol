import { Wallet, Signature } from 'ethers';
import { State } from './contract/state';
export interface SignedState {
    state: State;
    signature: Signature;
}
export declare function getStateSignerAddress(signedState: SignedState): string;
export declare function signState(state: State, privateKey: string): SignedState;
export declare function sign(wallet: Wallet, msgHash: string | Uint8Array): Promise<Signature>;
export declare function signStates(states: State[], wallets: Wallet[], whoSignedWhat: number[]): Promise<Signature[]>;
export declare function signChallengeMessage(signedStates: SignedState[], privateKey: string): Signature;
//# sourceMappingURL=signatures.d.ts.map