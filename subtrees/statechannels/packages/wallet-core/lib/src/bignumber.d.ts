import { BigNumber as EthersBigNumber, BigNumberish } from 'ethers';
import { Uint256 } from './types';
export declare class BN {
    static eq: (a: BigNumberish, b: BigNumberish) => boolean;
    static lt: (a: BigNumberish, b: BigNumberish) => boolean;
    static gt: (a: BigNumberish, b: BigNumberish) => boolean;
    static lte: (a: BigNumberish, b: BigNumberish) => boolean;
    static gte: (a: BigNumberish, b: BigNumberish) => boolean;
    static add: (a: BigNumberish, b: BigNumberish) => Uint256;
    static sub: (a: BigNumberish, b: BigNumberish) => Uint256;
    static mul: (a: BigNumberish, b: BigNumberish) => Uint256;
    static div: (a: BigNumberish, b: BigNumberish) => Uint256;
    static mod: (a: BigNumberish, b: BigNumberish) => Uint256;
    static pow: (a: BigNumberish, b: BigNumberish) => Uint256;
    static abs: (a: BigNumberish) => Uint256;
    static isNegative: (a: BigNumberish) => boolean;
    static isZero: (a: BigNumberish) => boolean;
    static toNumber: (a: BigNumberish) => number;
    static toHexString: (a: BigNumberish) => Uint256;
    static from: (n: string | number | import("ethers").Bytes | EthersBigNumber | BN) => Uint256;
    static isUint256: (val: any) => boolean;
}
export declare const Zero: Uint256;
//# sourceMappingURL=bignumber.d.ts.map