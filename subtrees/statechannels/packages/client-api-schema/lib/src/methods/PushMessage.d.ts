import { JsonRpcRequest, JsonRpcResponse, JsonRpcError } from '../jsonrpc-header-types';
import { Message } from '../data-types';
import { ErrorCodes as AllErrors } from '../error-codes';
export declare type PushMessageParams = PushMessageRequest['params'];
export declare type PushMessageResult = {
    success: boolean;
};
export declare type PushMessageRequest = JsonRpcRequest<'PushMessage', Message>;
export declare type PushMessageResponse = JsonRpcResponse<PushMessageResult>;
declare type ErrorCodes = AllErrors['PushMessage'];
declare type NotYourTurn = JsonRpcError<ErrorCodes['WrongParticipant'], 'Wrong participant'>;
export declare type PushMessageError = NotYourTurn;
export {};
//# sourceMappingURL=PushMessage.d.ts.map