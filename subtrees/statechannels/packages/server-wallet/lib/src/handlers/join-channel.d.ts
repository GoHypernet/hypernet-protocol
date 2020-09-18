import { Either } from 'fp-ts/lib/Either';
import { ChannelId } from '@statechannels/client-api-schema';
import { SignState } from '../protocols/actions';
import { ChannelState } from '../protocols/state';
import { WalletError, Values } from '../errors/wallet-error';
declare type HandlerResult = Either<JoinChannelError, SignState>;
export interface JoinChannelHandlerParams {
    channelId: ChannelId;
}
export declare class JoinChannelError extends WalletError {
    readonly data: any;
    readonly type: "JoinChannelError";
    static readonly reasons: {
        readonly channelNotFound: "channel not found";
        readonly invalidTurnNum: "latest state must be turn 0";
        readonly alreadySignedByMe: "already signed prefund setup";
    };
    constructor(reason: Values<typeof JoinChannelError.reasons>, data?: any);
}
export declare function joinChannel(args: JoinChannelHandlerParams, channelState: ChannelState): HandlerResult;
export {};
//# sourceMappingURL=join-channel.d.ts.map