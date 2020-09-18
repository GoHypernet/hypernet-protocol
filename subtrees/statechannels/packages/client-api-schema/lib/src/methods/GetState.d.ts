import { ChannelId, ChannelResult } from '../data-types';
import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { ErrorCodes as AllErrors } from '../error-codes';
export interface GetStateParams {
    channelId: ChannelId;
}
export declare type GetStateRequest = JsonRpcRequest<'GetState', GetStateParams>;
export declare type GetStateResponse = JsonRpcResponse<ChannelResult>;
declare type ErrorCodes = AllErrors['GetState'];
declare type ChannelNotFound = JsonRpcError<ErrorCodes['ChannelNotFound'], 'Could not find channel'>;
export declare type GetStateError = ChannelNotFound;
export {};
//# sourceMappingURL=GetState.d.ts.map