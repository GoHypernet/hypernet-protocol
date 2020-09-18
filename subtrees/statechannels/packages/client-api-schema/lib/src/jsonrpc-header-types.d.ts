/**
 * Specifies request headers as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 * @beta
 */
export interface JsonRpcRequest<MethodName = string, RequestParams = object> {
    /**
     * Identifier for the resquest
     *
     * @remarks To be matched in a response
     */
    id: number;
    /**
     * Spec version
     */
    jsonrpc: '2.0';
    /**
     * Generic type of the request method
     */
    method: MethodName;
    /**
     * Request parameters
     */
    params: RequestParams;
}
/**
 * Specifies response headers as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 * @beta
 */
export interface JsonRpcResponse<ResponseType = object> {
    /**
     * Identifier for the response
     * @remarks Matches that of a request
     */
    id: number;
    /**
     * Spec version
     */
    jsonrpc: '2.0';
    /**
     * The generic type of the response
     */
    result: ResponseType;
}
/**
 * Specifies error object as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 * @beta
 */
export interface JsonRpcError<Code extends number, Message, Data = undefined> {
    /**
     * Error code
     */
    code: Code;
    /**
     * Error message
     */
    message: Message;
    /**
     * Error data
     */
    data?: Data;
}
/**
 * Specifies response headers as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 * @beta
 */
export interface JsonRpcErrorResponse<Error = any> {
    /**
     * Identifier for the response
     * @remarks Matches that of a request
     */
    id: number;
    /**
     * Spec version
     */
    jsonrpc: '2.0';
    /**
     * The generic type of the response
     */
    error: Error;
}
/**
 * Specifies notification headers as per {@link https://www.jsonrpc.org/specification | JSON-RPC 2.0 Specification }
 *
 * @remarks
 * Note one difference to the JSON-RPC spec is that notifications originate from the wallet (i.e. the Server, not the Client).
 *
 * @beta
 */
export interface JsonRpcNotification<NotificationName extends string, NotificationParams extends object> {
    /**
     * Spec version
     */
    jsonrpc: '2.0';
    /**
     * Generic type of the Notification name
     */
    method: NotificationName;
    /**
     * Generic type of the Notification parameters
     */
    params: NotificationParams;
}
/**
 * Type guard for {@link JsonRpcRequest | JsonRpcRequest}
 *
 * @returns true if the message is a JSON-RPC request, false otherwise
 * @beta
 */
export declare function isJsonRpcRequest(message: any): message is JsonRpcRequest;
/**
 * Type guard for {@link JsonRpcNotification | JsonRpcNotification}
 *
 * @returns true if the message is a JSON-RPC notification, false otherwise
 * @beta
 */
export declare function isJsonRpcNotification<Name extends string, Params extends object>(message: object): message is JsonRpcNotification<Name, Params>;
/**
 * Type guard for {@link JsonRpcResponse| JsonRpcResponse}
 *
 * @returns true if the message is a JSON-RPC response, false otherwis
 * @beta
 */
export declare function isJsonRpcResponse<ResponseType = object>(message: object): message is JsonRpcResponse<ResponseType>;
/**
 * Type guard for {@link JsonRpcErrorResponse | JsonRpcErrorResponse}
 *
 * @returns true if the message is a JSON-RPC error response, false otherwise
 * @beta
 */
export declare function isJsonRpcErrorResponse<Code extends number, Message, Data = undefined>(message: object): message is JsonRpcErrorResponse<JsonRpcError<Code, Message, Data>>;
//# sourceMappingURL=jsonrpc-header-types.d.ts.map