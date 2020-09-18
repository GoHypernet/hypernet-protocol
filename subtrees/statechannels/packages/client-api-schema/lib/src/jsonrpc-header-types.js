"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJsonRpc(message) {
    return typeof message === 'object' && message !== null && 'jsonrpc' in message;
}
/**
 * Type guard for {@link JsonRpcRequest | JsonRpcRequest}
 *
 * @returns true if the message is a JSON-RPC request, false otherwise
 * @beta
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJsonRpcRequest(message) {
    return (isJsonRpc(message) &&
        'id' in message &&
        'params' in message &&
        'method' in message &&
        'jsonrpc' in message &&
        message['jsonrpc'] === '2.0');
}
exports.isJsonRpcRequest = isJsonRpcRequest;
/**
 * Type guard for {@link JsonRpcNotification | JsonRpcNotification}
 *
 * @returns true if the message is a JSON-RPC notification, false otherwise
 * @beta
 */
function isJsonRpcNotification(message) {
    return isJsonRpc(message) && 'method' in message && !('id' in message);
}
exports.isJsonRpcNotification = isJsonRpcNotification;
/**
 * Type guard for {@link JsonRpcResponse| JsonRpcResponse}
 *
 * @returns true if the message is a JSON-RPC response, false otherwis
 * @beta
 */
function isJsonRpcResponse(message) {
    return isJsonRpc(message) && 'result' in message;
}
exports.isJsonRpcResponse = isJsonRpcResponse;
/**
 * Type guard for {@link JsonRpcErrorResponse | JsonRpcErrorResponse}
 *
 * @returns true if the message is a JSON-RPC error response, false otherwise
 * @beta
 */
function isJsonRpcErrorResponse(message) {
    return isJsonRpc(message) && 'id' in message && 'error' in message;
}
exports.isJsonRpcErrorResponse = isJsonRpcErrorResponse;
//# sourceMappingURL=jsonrpc-header-types.js.map