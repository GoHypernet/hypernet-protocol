/// <reference types="node" />
import { StateChannelsResponse, JsonRpcRequest } from '@statechannels/client-api-schema';
export interface PostMessageServiceOptions {
    timeoutMs?: number;
    maxRetries?: number;
}
export declare class PostMessageService {
    protected timeoutListener?: NodeJS.Timeout;
    protected attempts: number;
    protected url: string;
    protected readonly timeoutMs: number;
    protected readonly maxRetries: number;
    constructor({ timeoutMs, maxRetries }?: PostMessageServiceOptions);
    setUrl(url: string): void;
    send(target: Window, message: JsonRpcRequest, corsUrl: string): void;
    private requestNumber;
    request<ResultType = any>(target: Window, messageWithOptionalId: Omit<JsonRpcRequest, 'id'> & {
        id?: number;
    }, // Make id an optional key
    callback?: (result: ResultType) => void): Promise<ResultType>;
    acknowledge(): void;
    protected createListenerForRequest<ResultType extends StateChannelsResponse['result']>(request: JsonRpcRequest, resolve: (value?: ResultType) => void, reject: (reason?: any) => void, callback?: (result: ResultType) => void): (event: MessageEvent) => void;
}
//# sourceMappingURL=postmessage-service.d.ts.map