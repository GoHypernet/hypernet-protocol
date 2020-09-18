import { SignedState, SignedStateWithHash, State } from '@statechannels/wallet-core';
import { SigningWallet } from '../../../models/signing-wallet';
import { Fixture } from './utils';
export declare const createState: Fixture<State>;
export declare const stateSignedBy: (signingWallets?: SigningWallet[]) => Fixture<SignedState>;
export declare const stateWithHashSignedBy: (pk?: SigningWallet, ...otherWallets: SigningWallet[]) => Fixture<SignedStateWithHash>;
export declare const stateWithHashSignedBy2: (signingWallets?: SigningWallet[]) => Fixture<SignedStateWithHash>;
//# sourceMappingURL=states.d.ts.map