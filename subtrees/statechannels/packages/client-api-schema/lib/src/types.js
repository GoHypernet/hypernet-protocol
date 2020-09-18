"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isStateChannelsResponse(message) {
    return message && typeof message == 'object' && 'id' in message && 'result' in message;
}
exports.isStateChannelsResponse = isStateChannelsResponse;
function isStateChannelsNotification(message) {
    return message && typeof message == 'object' && !('id' in message);
}
exports.isStateChannelsNotification = isStateChannelsNotification;
function isStateChannelsRequest(message) {
    return message && message && typeof message == 'object' && 'id' in message && 'params' in message;
}
exports.isStateChannelsRequest = isStateChannelsRequest;
function isStateChannelsErrorResponse(message) {
    return (message &&
        typeof message == 'object' &&
        'id' in message &&
        'message' in message &&
        'error' in message);
}
exports.isStateChannelsErrorResponse = isStateChannelsErrorResponse;
//# sourceMappingURL=types.js.map