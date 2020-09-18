import { ChannelId, Allocation, ChannelResult, ChannelStatus } from '../data-types';
import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { ErrorCodes as AllCodes } from '../error-codes';
export interface UpdateChannelParams {
    channelId: ChannelId;
    allocations: Allocation[];
    appData: string;
}
export declare type UpdateChannelRequest = JsonRpcRequest<'UpdateChannel', UpdateChannelParams>;
export declare type UpdateChannelResponse = JsonRpcResponse<ChannelResult>;
declare type ErrorCodes = AllCodes['UpdateChannel'];
export declare type ChannelNotFound = JsonRpcError<ErrorCodes['ChannelNotFound'], 'Channel not found'>;
export declare type InvalidTransition = JsonRpcError<ErrorCodes['InvalidTransition'], 'Invalid transition', {
    channelStatus: ChannelStatus;
    proposedUpdate: UpdateChannelParams;
}>;
export declare type InvalidAppData = JsonRpcError<ErrorCodes['InvalidAppData'], 'Invalid app data', {
    appData: string;
}>;
export declare type NotYourTurn = JsonRpcError<ErrorCodes['NotYourTurn'], 'Not your turn'>;
export declare type ChannelClosed = JsonRpcError<ErrorCodes['ChannelClosed'], 'Channel closed'>;
export declare type UpdateChannelError = ChannelNotFound | InvalidTransition | InvalidAppData | NotYourTurn | ChannelClosed;
export {};
//# sourceMappingURL=UpdateChannel.d.ts.map