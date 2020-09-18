import { ChannelId, ChannelResult } from '../data-types';
import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { ErrorCodes as AllErrors } from '../error-codes';
export interface JoinChannelParams {
    channelId: ChannelId;
}
export declare type JoinChannelRequest = JsonRpcRequest<'JoinChannel', JoinChannelParams>;
export declare type JoinChannelResponse = JsonRpcResponse<ChannelResult>;
declare type ErrorCodes = AllErrors['JoinChannel'];
declare type ChannelNotFound = JsonRpcError<ErrorCodes['ChannelNotFound'], 'Could not find channel'>;
declare type InvalidTransition = JsonRpcError<ErrorCodes['InvalidTransition'], 'Invalid Transition'>;
export declare type JoinChannelError = ChannelNotFound | InvalidTransition;
export {};
//# sourceMappingURL=JoinChannel.d.ts.map