import { Either } from 'fp-ts/lib/Either';
import { ChannelId } from '@statechannels/client-api-schema';
import { SignState } from '../protocols/actions';
import { ChannelState } from '../protocols/state';
import { WalletError, Values } from '../errors/wallet-error';
declare type HandlerResult = Either<CloseChannelError, SignState>;
export interface CloseChannelHandlerParams {
    channelId: ChannelId;
}
export declare class CloseChannelError extends WalletError {
    readonly data: any;
    readonly type: "CloseChannelError";
    static readonly reasons: {
        readonly noSupportedState: "no supported state";
        readonly notMyTurn: "not my turn";
        readonly channelMissing: "channel not found";
    };
    constructor(reason: Values<typeof CloseChannelError.reasons>, data?: any);
}
export declare function closeChannel(channelState: ChannelState): HandlerResult;
export {};
//# sourceMappingURL=close-channel.d.ts.map