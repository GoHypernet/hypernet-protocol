import { UpdateChannelParams, CreateChannelParams, StateChannelsNotification, JoinChannelParams, CloseChannelParams, ChannelResult, GetStateParams, Address, ChannelId } from '@statechannels/client-api-schema';
import { Message, Participant } from '@statechannels/wallet-core';
import * as Either from 'fp-ts/lib/Either';
import Knex from 'knex';
import { Uint256 } from '../type-aliases';
import { Outgoing } from '../protocols/actions';
import { OnchainServiceInterface } from '../onchain-service';
import { ServerWalletConfig } from '../config';
import { Store } from './store';
export { CreateChannelParams };
declare type SingleChannelResult = Promise<{
    outbox: Outgoing[];
    channelResult: ChannelResult;
}>;
declare type MultipleChannelResult = Promise<{
    outbox: Outgoing[];
    channelResults: ChannelResult[];
}>;
export interface UpdateChannelFundingParams {
    channelId: ChannelId;
    token?: Address;
    amount: Uint256;
}
declare type SyncChannelParams = {
    channelId: ChannelId;
};
export declare type WalletInterface = {
    getParticipant(): Promise<Participant | undefined>;
    createChannel(args: CreateChannelParams): SingleChannelResult;
    joinChannel(args: JoinChannelParams): SingleChannelResult;
    updateChannel(args: UpdateChannelParams): SingleChannelResult;
    closeChannel(args: CloseChannelParams): SingleChannelResult;
    getChannels(): MultipleChannelResult;
    getState(args: GetStateParams): SingleChannelResult;
    syncChannel(args: SyncChannelParams): SingleChannelResult;
    updateChannelFunding(args: UpdateChannelFundingParams): void;
    pushMessage(m: Message): MultipleChannelResult;
    onNotification(cb: (notice: StateChannelsNotification) => void): {
        unsubscribe: () => void;
    };
    attachChainService(provider: OnchainServiceInterface): void;
};
export declare class Wallet implements WalletInterface {
    readonly walletConfig: ServerWalletConfig;
    knex: Knex;
    store: Store;
    constructor(walletConfig: ServerWalletConfig);
    destroy(): Promise<void>;
    syncChannel({ channelId }: SyncChannelParams): SingleChannelResult;
    getParticipant(): Promise<Participant | undefined>;
    updateChannelFunding({ channelId, token, amount, }: UpdateChannelFundingParams): SingleChannelResult;
    getSigningAddress(): Promise<string>;
    createChannel(args: CreateChannelParams): SingleChannelResult;
    joinChannel({ channelId }: JoinChannelParams): SingleChannelResult;
    updateChannel({ channelId, allocations, appData }: UpdateChannelParams): SingleChannelResult;
    closeChannel({ channelId }: CloseChannelParams): SingleChannelResult;
    getChannels(): MultipleChannelResult;
    getState({ channelId }: GetStateParams): SingleChannelResult;
    pushMessage(message: Message): MultipleChannelResult;
    onNotification(_cb: (notice: StateChannelsNotification) => void): {
        unsubscribe: () => void;
    };
    attachChainService(provider: OnchainServiceInterface): void;
    takeActions: (channels: string[]) => Promise<ExecutionResult>;
}
declare type ExecutionResult = {
    outbox: Outgoing[];
    channelResults: ChannelResult[];
    error?: any;
};
export declare function getOrThrow<E, T>(result: Either.Either<E, T>): T;
//# sourceMappingURL=index.d.ts.map