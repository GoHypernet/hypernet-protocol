import { Bytes32, Address } from '@statechannels/client-api-schema';
import { providers } from 'ethers';
import { Evt } from 'evt';
import { OnchainServiceInterface, ChainEventNames, ChannelEventRecordMap, OnchainServiceStoreInterface } from './types';
import { Wallet as ChannelWallet } from '..';
export declare class OnchainService implements OnchainServiceInterface {
    private provider;
    private storage;
    private assetHolders;
    private channelWallet;
    constructor(provider: string | providers.JsonRpcProvider, storage: OnchainServiceStoreInterface);
    attachChannelWallet(wallet: ChannelWallet): void;
    attachHandler<T extends ChainEventNames>(assetHolderAddr: Address, event: T, callback: (event: ChannelEventRecordMap[T]) => void | Promise<void>, filter?: (event: ChannelEventRecordMap[T]) => boolean, timeout?: number): Evt<ChannelEventRecordMap[T]> | Promise<ChannelEventRecordMap[T]>;
    detachAllHandlers(assetHolderAddr: Address, event?: ChainEventNames): void;
    registerChannel(channelId: Bytes32, assetHolders: Address[]): Promise<void>;
    private _createFundingEvt;
    private _registerAssetHolderCallbacks;
}
//# sourceMappingURL=onchain-service.d.ts.map