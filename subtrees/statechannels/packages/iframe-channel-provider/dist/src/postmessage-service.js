"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_api_schema_1 = require("@statechannels/client-api-schema");
var logger_1 = require("./logger");
var RpcError = /** @class */ (function (_super) {
    __extends(RpcError, _super);
    function RpcError(error) {
        var _this = _super.call(this, error.message) || this;
        _this.error = error;
        return _this;
    }
    return RpcError;
}(Error));
var PostMessageService = /** @class */ (function () {
    function PostMessageService(_a) {
        var _b = _a === void 0 ? {} : _a, timeoutMs = _b.timeoutMs, maxRetries = _b.maxRetries;
        this.attempts = 0;
        this.url = '';
        this.requestNumber = 0;
        this.timeoutMs = timeoutMs || -1;
        this.maxRetries = maxRetries || 0;
    }
    PostMessageService.prototype.setUrl = function (url) {
        this.url = url;
    };
    PostMessageService.prototype.send = function (target, message, corsUrl) {
        var _this = this;
        this.attempts += 1;
        logger_1.logger.info({ message: message }, 'Sending message (attempt %s)', this.attempts);
        target.postMessage(message, corsUrl);
        logger_1.logger.info({ message: message }, 'Sent message:');
        if (this.timeoutMs >= 0) {
            this.timeoutListener = setTimeout(function () {
                if (_this.attempts < _this.maxRetries) {
                    logger_1.logger.info({ message: message }, 'Request timed out after %o ms, retrying', _this.timeoutMs);
                    _this.send(target, message, corsUrl);
                }
                else {
                    logger_1.logger.info({ message: message }, 'Request timed out after %o attempts; is the wallet unreachable?', _this.attempts);
                    logger_1.logger.warn({ message: message }, "Request timed out after " + _this.attempts + " attempts");
                }
            }, this.timeoutMs);
        }
    };
    PostMessageService.prototype.request = function (target, messageWithOptionalId, // Make id an optional key
    callback) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            var _this = this;
            return __generator(this, function (_a) {
                // Some tests rely on being able to supply the id on the message
                // We should not allow this in production, as we cannot guarantee unique
                // message ids.
                if (messageWithOptionalId.id)
                    logger_1.logger.error('message id should not be defined');
                message = __assign(__assign({}, messageWithOptionalId), { id: messageWithOptionalId.id || this.requestNumber++ });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        window.addEventListener('message', _this.createListenerForRequest(message, resolve, reject, callback));
                        logger_1.logger.info({ message: message }, 'Requesting:');
                        _this.send(target, message, _this.url);
                    })];
            });
        });
    };
    PostMessageService.prototype.acknowledge = function () {
        logger_1.logger.info('ACK signal received');
        if (this.timeoutListener) {
            clearTimeout(this.timeoutListener);
        }
        this.attempts = 0;
    };
    PostMessageService.prototype.createListenerForRequest = function (request, resolve, reject, callback) {
        var _this = this;
        var listener = function (event) {
            if (event.data && event.data.jsonrpc && event.data.id === request.id) {
                if (client_api_schema_1.isJsonRpcResponse(event.data)) {
                    if (callback) {
                        callback(event.data.result);
                    }
                    _this.acknowledge();
                    window.removeEventListener('message', listener);
                    logger_1.logger.info({ response: event.data }, 'Received response');
                    resolve(event.data.result);
                }
                else if (client_api_schema_1.isStateChannelsErrorResponse(event.data)) {
                    reject(new RpcError(event.data.error));
                }
            }
        };
        return listener;
    };
    return PostMessageService;
}());
exports.PostMessageService = PostMessageService;
//# sourceMappingURL=postmessage-service.js.map