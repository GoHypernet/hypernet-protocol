import { Bytes32 } from '@statechannels/client-api-schema';
import { providers } from 'ethers';
import { ChannelEventRecord, OnchainServiceStoreInterface, ChannelEventRecordMap, NoncedMinimalTransaction, TransactionSubmissionStoreInterface, ChainEventNames } from './types';
export declare class TransactionSubmissionStore implements TransactionSubmissionStoreInterface {
    private readonly requestedTransactions;
    private readonly minedTransactions;
    saveTransactionRequest(channelId: Bytes32, tx: NoncedMinimalTransaction): Promise<void>;
    saveTransactionResponse(_channelId: Bytes32, _tx: providers.TransactionResponse): Promise<void>;
    saveTransactionReceipt(channelId: Bytes32, receipt: providers.TransactionReceipt): Promise<void>;
    saveFailedTransaction(channelId: Bytes32, tx: NoncedMinimalTransaction, _reason: string): Promise<void>;
}
export declare class OnchainServiceStore implements OnchainServiceStoreInterface {
    private readonly events;
    getEvents(channelId: Bytes32): Promise<ChannelEventRecord[]>;
    getLatestEvent<T extends ChainEventNames>(channelId: Bytes32, _event: T): ChannelEventRecordMap[T];
    saveEvent<T extends ChainEventNames>(channelId: Bytes32, data: ChannelEventRecordMap[T]): Promise<void>;
    registerChannel(channelId: Bytes32): Promise<void>;
    hasChannel(channelId: Bytes32): boolean;
}
//# sourceMappingURL=store.d.ts.map