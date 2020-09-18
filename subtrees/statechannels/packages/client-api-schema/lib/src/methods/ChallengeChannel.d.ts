import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { ChannelId, ChannelResult } from '../data-types';
import { ErrorCodes as AllErrors } from '../error-codes';
export interface ChallengeChannelParams {
    channelId: ChannelId;
}
export declare type ChallengeChannelRequest = JsonRpcRequest<'ChallengeChannel', ChallengeChannelParams>;
export declare type ChallengeChannelResponse = JsonRpcResponse<ChannelResult>;
declare type ErrorCodes = AllErrors['ChallengeChannel'];
declare type ChannelNotFound = JsonRpcError<ErrorCodes['ChannelNotFound'], 'Could not find channel'>;
export declare type ChallengeChannelError = ChannelNotFound;
export {};
//# sourceMappingURL=ChallengeChannel.d.ts.map