import { Address, Bytes32 } from '@statechannels/client-api-schema';
import { providers } from 'ethers';
import { Evt } from 'evt';
import { Wallet as ChannelWallet } from '..';
export declare type AssetHolderInformation = {
    tokenAddress: Address;
    assetHolderAddress: Address;
};
export declare type MinimalTransaction = Pick<providers.TransactionRequest, 'chainId' | 'to' | 'data' | 'value'>;
export declare type NoncedMinimalTransaction = Pick<providers.TransactionRequest, 'chainId' | 'to' | 'data' | 'value'> & {
    nonce: number;
};
export declare type ContractEventName = 'Deposited';
export declare type ChainEventNames = 'Funding';
export interface FundingEvent {
    transactionHash: string;
    type: ContractEventName;
    blockNumber: number;
    final: boolean;
    channelId: Bytes32;
    amount: string;
    destinationHoldings: string;
}
export declare type TransactionSubmissionOptions = Partial<{
    maxSendAttempts: number;
}>;
export interface ChannelEventRecordMap {
    Funding: FundingEvent;
}
export declare type ChannelEventRecord = FundingEvent;
export declare type EvtContainer = {
    [K in keyof ChannelEventRecordMap]: Evt<ChannelEventRecordMap[K]>;
};
export interface OnchainServiceInterface {
    registerChannel(channelId: Bytes32, assetHolders: Address[]): Promise<void>;
    attachChannelWallet(wallet: ChannelWallet): void;
    attachHandler<T extends ChainEventNames>(assetHolderAddr: Address, event: T, callback: (event: ChannelEventRecordMap[T]) => void | Promise<void>, filter?: (event: ChannelEventRecordMap[T]) => boolean, timeout?: number): Evt<ChannelEventRecordMap[T]> | Promise<ChannelEventRecordMap[T]>;
    detachAllHandlers(assetHolderAddr: Address, event?: ChainEventNames): void;
}
export declare const TransactionStatuses: {
    readonly pending: "pending";
    readonly submitted: "submitted";
    readonly success: "success";
    readonly failed: "failed";
};
export declare type TransactionStatus = keyof typeof TransactionStatuses;
export interface TransactionStatusEventMap {
    [TransactionStatuses.pending]: NoncedMinimalTransaction;
    [TransactionStatuses.submitted]: providers.TransactionResponse;
    [TransactionStatuses.success]: providers.TransactionReceipt;
    [TransactionStatuses.failed]: NoncedMinimalTransaction & {
        reason: string;
    };
}
export interface TransactionSubmissionServiceInterface {
    submitTransaction(channelId: Bytes32, minTx: MinimalTransaction, options?: TransactionSubmissionOptions): Promise<providers.TransactionResponse>;
}
export interface OnchainServiceStoreInterface {
    getEvents(channelId: Bytes32): Promise<ChannelEventRecord[]>;
    getLatestEvent<T extends ChainEventNames>(channelId: Bytes32, event: T): ChannelEventRecordMap[T] | undefined;
    saveEvent<T extends ChainEventNames>(channelId: Bytes32, data: ChannelEventRecordMap[T]): Promise<void>;
    registerChannel(channelId: Bytes32): Promise<void>;
    hasChannel(channelId: Bytes32): boolean;
}
export interface TransactionSubmissionStoreInterface {
    saveTransactionRequest(channelId: Bytes32, tx: NoncedMinimalTransaction): Promise<void>;
    saveTransactionResponse(channelId: Bytes32, tx: providers.TransactionResponse): Promise<void>;
    saveTransactionReceipt(channelId: Bytes32, tx: providers.TransactionReceipt): Promise<void>;
    saveFailedTransaction(channelId: Bytes32, tx: NoncedMinimalTransaction, reason: string): Promise<void>;
}
export declare type Values<E> = E[keyof E];
//# sourceMappingURL=types.d.ts.map