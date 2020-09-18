import { JsonRpcRequest, JsonRpcResponse } from '../jsonrpc-header-types';
import { ChannelResult } from '../data-types';
export interface GetChannelsParams {
    includeClosed?: boolean;
}
export declare type GetChannelsRequest = JsonRpcRequest<'GetChannels', {
    includeClosed?: boolean;
}>;
export declare type GetChannelsResponse = JsonRpcResponse<ChannelResult[]>;
//# sourceMappingURL=GetChannels.d.ts.map