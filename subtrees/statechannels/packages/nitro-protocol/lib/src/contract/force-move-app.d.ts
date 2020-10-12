import { Contract } from 'ethers';
import { State } from '../contract/state';
export declare const ForceMoveAppContractInterface: any;
export declare function validTransition(fromState: State, toState: State, appContract: Contract): Promise<boolean>;
export declare function createValidTransitionTransaction(fromState: State, toState: State): {
    data: string;
};
//# sourceMappingURL=force-move-app.d.ts.map