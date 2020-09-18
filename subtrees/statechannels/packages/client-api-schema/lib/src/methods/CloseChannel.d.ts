import { ChannelId, ChannelResult } from '../data-types';
import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { ErrorCodes as AllErrors } from '../error-codes';
export interface CloseChannelParams {
    channelId: ChannelId;
}
export declare type CloseChannelRequest = JsonRpcRequest<'CloseChannel', CloseChannelParams>;
export declare type CloseChannelResponse = JsonRpcResponse<ChannelResult>;
declare type ErrorCodes = AllErrors['CloseChannel'];
declare type NotYourTurn = JsonRpcError<ErrorCodes['NotYourTurn'], 'Not your turn'>;
declare type ChannelNotFound = JsonRpcError<ErrorCodes['ChannelNotFound'], 'Channel not found'>;
export declare type CloseChannelError = NotYourTurn | ChannelNotFound;
export {};
//# sourceMappingURL=CloseChannel.d.ts.map