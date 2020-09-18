import { Uint256 } from '../types';
export declare function unreachable(x: never): never;
export declare const exists: <T>(t: T | undefined) => t is T;
declare type TypeGuard<T, S> = (t1: T | S) => t1 is T;
export declare function checkThat<T, S = undefined>(t: T | S, isTypeT: TypeGuard<T, S>): T;
export declare function createDestination(address: string): string;
export declare function formatAmount(amount: Uint256): Uint256;
export declare function arrayToRecord<T, K extends keyof T>(array: Array<T>, idProperty: K): Record<string | number, T>;
export declare function recordToArray<T>(record: Record<string | number, T | undefined>): Array<T>;
export {};
//# sourceMappingURL=helpers.d.ts.map