import { Evt } from 'evt/lib/types';
import pino from 'pino';
import { Values } from '../errors/wallet-error';
import { FundingEvent } from './types';
export declare abstract class BaseError extends Error {
    readonly data: any;
    static readonly errors: {
        readonly OnchainError: "OnchainError";
        readonly TransactionError: "TransactionError";
        readonly StorageError: "StorageError";
    };
    readonly context: any;
    static readonly knownErrors: {
        [key: string]: string;
    };
    static isKnownErr(errorMessage: string, knownErrors: string[]): boolean;
    abstract readonly type: Values<typeof BaseError.errors>;
    static readonly reasons: {
        [key: string]: string;
    };
    constructor(reason: Values<typeof BaseError.reasons>, data?: any);
}
export declare const addEvtHandler: (evt: Evt<any>, callback: (event: any) => void | Promise<void>, filter?: ((event: any) => boolean) | undefined, timeout?: number | undefined) => Promise<any> | Evt<any>;
export declare const logger: pino.Logger;
export declare function isFundingEvent(e: any): e is FundingEvent;
//# sourceMappingURL=utils.d.ts.map