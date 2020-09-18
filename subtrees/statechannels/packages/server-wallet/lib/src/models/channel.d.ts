import { ChannelConstants, Participant, SignedStateVarsWithHash, SignedStateWithHash } from '@statechannels/wallet-core';
import { JSONSchema, Model, Pojo, QueryContext, ModelOptions, TransactionOrKnex } from 'objection';
import { ChannelResult } from '@statechannels/client-api-schema';
import { Address, Bytes32, Uint48 } from '../type-aliases';
import { ChannelState } from '../protocols/state';
import { NotifyApp } from '../protocols/actions';
import { WalletError, Values } from '../errors/wallet-error';
import { SigningWallet } from './signing-wallet';
import { Funding } from './funding';
export declare type SyncState = NotifyApp[];
export declare const REQUIRED_COLUMNS: {
    chainId: string;
    appDefinition: string;
    channelNonce: string;
    challengeDuration: string;
    participants: string;
    vars: string;
};
export declare const COMPUTED_COLUMNS: {
    channelId: string;
    signingAddress: string;
};
export interface RequiredColumns {
    readonly chainId: Bytes32;
    readonly appDefinition: Address;
    readonly channelNonce: Uint48;
    readonly challengeDuration: Uint48;
    readonly participants: Participant[];
    readonly vars: SignedStateVarsWithHash[];
    readonly signingAddress: Address;
}
export declare type ComputedColumns = {
    readonly channelId: Bytes32;
};
export declare const CHANNEL_COLUMNS: {
    channelId: string;
    signingAddress: string;
    chainId: string;
    appDefinition: string;
    channelNonce: string;
    challengeDuration: string;
    participants: string;
    vars: string;
};
export declare class Channel extends Model implements RequiredColumns {
    readonly id: number;
    channelId: Bytes32;
    vars: SignedStateVarsWithHash[];
    readonly chainId: Bytes32;
    readonly appDefinition: Address;
    readonly channelNonce: Uint48;
    readonly challengeDuration: Uint48;
    readonly participants: Participant[];
    readonly signingAddress: Address;
    readonly signingWallet: SigningWallet;
    readonly funding: Funding[];
    static get jsonSchema(): JSONSchema;
    static tableName: string;
    static relationMappings: {
        signingWallet: {
            relation: import("objection").RelationType;
            modelClass: typeof SigningWallet;
            join: {
                from: string;
                to: string;
            };
        };
        funding: {
            relation: import("objection").RelationType;
            modelClass: typeof Funding;
            join: {
                from: string;
                to: string;
            };
        };
    };
    static jsonAttributes: string[];
    static forId(channelId: Bytes32, txOrKnex: TransactionOrKnex): Promise<Channel>;
    $toDatabaseJson(): Pojo;
    $beforeValidate(jsonSchema: JSONSchema, json: Pojo, _opt: ModelOptions): JSONSchema;
    $beforeInsert(ctx: QueryContext): void;
    get protocolState(): ChannelState;
    get channelResult(): ChannelResult;
    get myIndex(): number;
    get channelConstants(): ChannelConstants;
    get sortedStates(): SignedStateVarsWithHash[];
    get myAddress(): Address;
    get myTurn(): boolean;
    get isSupported(): boolean;
    get support(): Array<SignedStateWithHash>;
    get hasConclusionProof(): boolean;
    get supported(): SignedStateWithHash | undefined;
    get isSupportedByMe(): boolean;
    get latestSignedByMe(): SignedStateWithHash | undefined;
    get latest(): SignedStateWithHash;
    private get _supported();
    get signedByMe(): SignedStateWithHash[];
    private get _latestSupportedByMe();
    get signedStates(): Array<SignedStateWithHash>;
    private mySignature;
    private nParticipants;
    private get _support();
    private validChain;
}
export declare class ChannelError extends WalletError {
    readonly data: any;
    readonly type: "ChannelError";
    static readonly reasons: {
        readonly invalidChannelId: "Invalid channel id";
        readonly incorrectHash: "Incorrect hash";
        readonly channelMissing: "No channel found with id.";
    };
    constructor(reason: Values<typeof ChannelError.reasons>, data?: any);
}
//# sourceMappingURL=channel.d.ts.map