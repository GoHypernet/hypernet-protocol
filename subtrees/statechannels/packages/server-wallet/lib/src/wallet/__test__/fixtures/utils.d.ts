import { StateVariables, Outcome } from '@statechannels/wallet-core';
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
declare type Modifier<T, S extends T = T> = (result: T, props?: any) => S;
export declare type Fixture<T> = (mergeProps?: DeepPartial<T>, extendProps?: DeepPartial<T>) => T;
export declare const fixture: <T>(defaults: T, modifier?: Modifier<T, T>) => Fixture<T>;
export declare function overwriteOutcome<T extends StateVariables>(result: T, props?: {
    outcome: Outcome;
}): T;
export {};
//# sourceMappingURL=utils.d.ts.map