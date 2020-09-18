import { providers, Wallet } from 'ethers';
import { Bytes32 } from '@statechannels/client-api-schema';
import { TransactionSubmissionServiceInterface, MinimalTransaction, TransactionSubmissionOptions, Values } from './types';
import { BaseError } from './utils';
import { TransactionSubmissionStore } from './store';
export declare class TransactionSubmissionError extends BaseError {
    readonly data: any;
    readonly type: "OnchainError";
    static readonly knownErrors: {
        readonly badNonce: "the tx doesn't have the correct nonce";
        readonly invalidNonce: "Invalid nonce";
        readonly noHash: "no transaction hash found in tx response";
        readonly underpricedReplacement: "replacement transaction underpriced";
    };
    static readonly reasons: {
        readonly zeroAttempts: "Invalid max transaction submission attempt count of 0";
        readonly failedAllAttempts: "Failed all transaction attempts";
        readonly unknownError: "Transaction failed with unkown error";
    };
    constructor(reason: Values<typeof TransactionSubmissionError.reasons>, data?: any);
}
export declare class TransactionSubmissionService implements TransactionSubmissionServiceInterface {
    private provider;
    private wallet;
    private queue;
    private store;
    private memoryNonce;
    constructor(provider: string | providers.JsonRpcProvider, wallet: string | Wallet, store: TransactionSubmissionStore);
    submitTransaction(channelId: Bytes32, tx: MinimalTransaction, options?: TransactionSubmissionOptions): Promise<providers.TransactionResponse>;
    private _sendTransaction;
}
//# sourceMappingURL=transaction-submission.d.ts.map