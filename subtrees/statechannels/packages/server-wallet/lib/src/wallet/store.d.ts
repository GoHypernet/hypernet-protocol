import { Transaction, TransactionOrKnex } from 'objection';
import { Objective, SignedStateWithHash, Message, StateVariables, Participant } from '@statechannels/wallet-core';
import { Either } from 'fp-ts/lib/Either';
import { ChannelResult } from '@statechannels/client-api-schema';
import Knex from 'knex';
import { Channel, SyncState } from '../models/channel';
import { ChannelState } from '../protocols/state';
import { WalletError, Values } from '../errors/wallet-error';
import { Bytes32 } from '../type-aliases';
export declare type AppHandler<T> = (tx: Transaction, channel: ChannelState) => T;
export declare type MissingAppHandler<T> = (channelId: string) => T;
export declare class Store {
    readonly timingMetrics: boolean;
    readonly skipEvmValidation: boolean;
    constructor(timingMetrics: boolean, skipEvmValidation: boolean);
    getFirstParticipant(knex: Knex): Promise<Participant>;
    getOrCreateSigningAddress(knex: Knex): Promise<string>;
    lockApp<T>(knex: Knex, channelId: Bytes32, criticalCode: AppHandler<T>, onChannelMissing?: MissingAppHandler<T>): Promise<T>;
    signState(channelId: Bytes32, vars: StateVariables, tx: Transaction): Promise<{
        outgoing: SyncState;
        channelResult: ChannelResult;
    }>;
    getChannel(channelId: Bytes32, txOrKnex: TransactionOrKnex): Promise<ChannelState | undefined>;
    getStates(channelId: Bytes32, txOrKnex: TransactionOrKnex): Promise<{
        states: SignedStateWithHash[];
        channelState: ChannelState;
    }>;
    getChannels(knex: Knex): Promise<ChannelState[]>;
    pushMessage(message: Message, tx: Transaction): Promise<Bytes32[]>;
    addObjective(_objective: Objective, _tx: Transaction): Promise<Either<StoreError, undefined>>;
    addSignedState(maybeChannel: Channel | undefined, signedState: SignedStateWithHash, tx: Transaction): Promise<Channel>;
}
declare class StoreError extends WalletError {
    readonly data: any;
    readonly type: "StoreError";
    static readonly reasons: {
        readonly duplicateTurnNums: "multiple states with same turn number";
        readonly notSorted: "states not sorted";
        readonly multipleSignedStates: "Store signed multiple states for a single turn";
        readonly invalidSignature: "Invalid signature";
        readonly notInChannel: "Not in channel";
        readonly staleState: "Stale state";
        readonly missingSigningKey: "Missing a signing key";
        readonly invalidTransition: "Invalid state transition";
        readonly channelMissing: "Channel not found";
    };
    constructor(reason: Values<typeof StoreError.reasons>, data?: any);
}
export {};
//# sourceMappingURL=store.d.ts.map