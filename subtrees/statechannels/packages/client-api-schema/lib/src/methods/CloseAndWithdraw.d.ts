import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { ErrorCodes } from '../error-codes';
export interface CloseAndWithdrawParams {
    hubParticipantId: string;
}
export declare type CloseAndWithdrawRequest = JsonRpcRequest<'CloseAndWithdraw', CloseAndWithdrawParams>;
export declare type CloseAndWithdrawResponse = JsonRpcResponse<{
    success: boolean;
}>;
export declare type CloseAndWithdrawError = JsonRpcError<ErrorCodes['CloseAndWithdraw']['UserDeclined'], 'User declined'>;
//# sourceMappingURL=CloseAndWithdraw.d.ts.map