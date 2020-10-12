"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter3_1 = __importDefault(require("eventemitter3"));
var guid_typescript_1 = require("guid-typescript");
var client_api_schema_1 = require("@statechannels/client-api-schema");
var logger_1 = require("./logger");
var postmessage_service_1 = require("./postmessage-service");
var iframe_service_1 = require("./iframe-service");
/**
 * Class for interacting with a statechannels wallet
 *
 * @beta
 */
var IFrameChannelProvider = /** @class */ (function () {
    /**
     * Create a new instance of this class
     *
     * @beta
     */
    function IFrameChannelProvider() {
        var _this = this;
        /**
         * Has the wallet iFrame been mounted?
         */
        this.mounted = false;
        this.subscriptions = {
            ChannelProposed: [],
            ChannelUpdated: [],
            ChannelClosed: [],
            BudgetUpdated: [],
            MessageQueued: [],
            UIUpdate: [],
            WalletReady: []
        };
        /**
         * The url of the hosted statechannels wallet
         */
        this.url = '';
        /**
         * Is the wallet ready to receive requests?
         */
        this.walletReady = function (url) {
            return new Promise(function (resolve) {
                var listener = function (event) {
                    if (event.origin == url && event.data.method === 'WalletReady') {
                        window.removeEventListener('message', listener);
                        resolve();
                    }
                };
                window.addEventListener('message', listener);
            });
        };
        this.subscribe = function (subscriptionType) { return __awaiter(_this, void 0, void 0, function () {
            var subscriptionId;
            return __generator(this, function (_a) {
                subscriptionId = guid_typescript_1.Guid.create().toString();
                this.subscriptions[subscriptionType].push(subscriptionId);
                return [2 /*return*/, subscriptionId];
            });
        }); };
        this.unsubscribe = function (subscriptionId) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                Object.keys(this.subscriptions).forEach(function (method) {
                    _this.subscriptions[method] = _this.subscriptions[method].filter(function (id) { return id != subscriptionId; });
                });
                return [2 /*return*/, true];
            });
        }); };
        /**
         * eventemitter 'on' for JSON-RPC Notifications. Use this to register callbacks.
         */
        this.on = function (method, params) { return _this.events.on(method, params); };
        /**
         * eventemitter 'off' for JSON-RPC Notifications. Use this to unregister callbacks.
         */
        this.off = function (method, params) { return _this.events.off(method, params); };
        this.events = new eventemitter3_1.default();
        this.iframe = new iframe_service_1.IFrameService();
        this.messaging = new postmessage_service_1.PostMessageService();
    }
    /**
     * Trigger the mounting of the <iframe/> element
     */
    IFrameChannelProvider.prototype.mountWalletComponent = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var walletReady, _a, signingAddress, destinationAddress, walletVersion;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.mounted) {
                            logger_1.logger.warn('The channel provider has already been mounted: ignoring call to mountWalletComponent');
                            return [2 /*return*/];
                        }
                        this.mounted = true;
                        this.url = url;
                        window.addEventListener('message', this.onMessage.bind(this));
                        this.iframe.setUrl(this.url);
                        this.messaging.setUrl(this.url);
                        walletReady = this.walletReady(url);
                        return [4 /*yield*/, this.iframe.mount()];
                    case 1:
                        _b.sent();
                        logger_1.logger.info('Application successfully mounted Wallet iFrame inside DOM.');
                        logger_1.logger.info('Waiting for wallet ping...');
                        return [4 /*yield*/, walletReady];
                    case 2:
                        _b.sent();
                        logger_1.logger.info('Wallet ready to receive requests');
                        return [4 /*yield*/, this.send('GetWalletInformation', {})];
                    case 3:
                        _a = _b.sent(), signingAddress = _a.signingAddress, destinationAddress = _a.destinationAddress, walletVersion = _a.walletVersion;
                        this.signingAddress = signingAddress;
                        this.destinationAddress = destinationAddress;
                        this.walletVersion = walletVersion;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Enable the channel provider
     *
     * @remarks
     * This causes the provider to cache {@link IFrameChannelProvider.signingAddress | signingAddress}, {@link IFrameChannelProvider.destinationAddress | destinationAddress} and {@link IFrameChannelProvider.walletVersion | walletVersion} from the wallet.
     * @returns Promise which resolves when the wallet has completed the Enable Ethereum workflow.
     */
    IFrameChannelProvider.prototype.enable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, signingAddress, destinationAddress, walletVersion;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.mounted) {
                            throw new Error('ChannelProvider: You must call .mountWalletComponent() before calling .enable()');
                        }
                        return [4 /*yield*/, this.send('EnableEthereum', {})];
                    case 1:
                        _a = _b.sent(), signingAddress = _a.signingAddress, destinationAddress = _a.destinationAddress, walletVersion = _a.walletVersion;
                        this.signingAddress = signingAddress;
                        this.destinationAddress = destinationAddress;
                        this.walletVersion = walletVersion;
                        return [2 /*return*/];
                }
            });
        });
    };
    IFrameChannelProvider.prototype.send = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var target, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.iframe.getTarget()];
                    case 1:
                        target = _a.sent();
                        return [4 /*yield*/, this.messaging.request(target, {
                                jsonrpc: '2.0',
                                method: method,
                                params: params
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    IFrameChannelProvider.prototype.onMessage = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var message, notificationMethod, notificationParams_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (event.origin !== this.url) {
                    // Do nothing with messages that don't come from the wallet
                    return [2 /*return*/];
                }
                if (client_api_schema_1.isJsonRpcNotification(event.data)) {
                    message = client_api_schema_1.parseNotification(event.data); // Narrows type, throws if it does not fit the schema
                    notificationMethod = message.method;
                    notificationParams_1 = message.params;
                    this.events.emit(notificationMethod, notificationParams_1);
                    if ('showWallet' in message.params) {
                        this.iframe.setVisibility(message.params.showWallet);
                    }
                    else {
                        this.subscriptions[notificationMethod].forEach(function (id) {
                            _this.events.emit(id, notificationParams_1);
                        });
                    }
                }
                else if (client_api_schema_1.isJsonRpcResponse(event.data)) {
                    message = client_api_schema_1.parseResponse(event.data);
                }
                else if (client_api_schema_1.isJsonRpcErrorResponse(event.data)) {
                    message = client_api_schema_1.parseErrorResponse(event.data);
                }
                else
                    return [2 /*return*/];
                return [2 /*return*/];
            });
        });
    };
    return IFrameChannelProvider;
}());
exports.IFrameChannelProvider = IFrameChannelProvider;
/**
 * Class instance that is attached to the window object
 *
 * @remarks
 * Accessible via `window.channelProvider`
 *
 * @beta
 */
var channelProvider = new IFrameChannelProvider();
exports.channelProvider = channelProvider;
//# sourceMappingURL=channel-provider.js.map