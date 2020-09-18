"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation Defines and validates the data types communicated between an app and a wallet
 *
 * @remarks
 * Also exposes functions that can validate messages (Requests, Responses, Notifications and Error Responses), as well as to cast them as the correct Type.
 *
 * Example request:
 * ```json
 * {
 *   "jsonrpc": "2.0",
 *   "method": "PushMessage",
 *   "id": 1,
 *   "params": {
 *     "recipient": "user123",
 *     "sender": "user456",
 *     "data": "0x123.."
 *   }
 * }
 * ```
 *
 * Example response:
 *
 * ```json
 * {
 *   "jsonrpc": "2.0",
 *   "id": 1,
 *   "result": {"success": true}
 * }
 * ```
 */
__export(require("./types"));
__export(require("./jsonrpc-header-types"));
var validation_1 = require("./validation");
exports.parseRequest = validation_1.parseRequest;
exports.parseResponse = validation_1.parseResponse;
exports.parseNotification = validation_1.parseNotification;
exports.parseErrorResponse = validation_1.parseErrorResponse;
//# sourceMappingURL=index.js.map