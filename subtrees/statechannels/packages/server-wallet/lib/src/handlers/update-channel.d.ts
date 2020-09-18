import { Either } from 'fp-ts/lib/Either';
import { Outcome } from '@statechannels/wallet-core';
import { ChannelId } from '@statechannels/client-api-schema';
import { SignState } from '../protocols/actions';
import { ChannelState } from '../protocols/state';
import { WalletError, Values } from '../errors/wallet-error';
declare type UpdateChannelResult = Either<UpdateChannelError, SignState>;
export interface UpdateChannelHandlerParams {
    channelId: ChannelId;
    outcome: Outcome;
    appData: string;
}
export declare class UpdateChannelError extends WalletError {
    readonly data: any;
    readonly type: "UpdateChannelError";
    static readonly reasons: {
        readonly channelNotFound: "channel not found";
        readonly invalidLatestState: "must have latest state";
        readonly notInRunningStage: "channel must be in running state";
        readonly notMyTurn: "it is not my turn";
    };
    constructor(reason: Values<typeof UpdateChannelError.reasons>, data?: any);
}
export declare function updateChannel(args: UpdateChannelHandlerParams, channelState: ChannelState): UpdateChannelResult;
export {};
//# sourceMappingURL=update-channel.d.ts.map