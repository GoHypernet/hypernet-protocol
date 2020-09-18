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
Object.defineProperty(exports, "__esModule", { value: true });
var postmessage_service_1 = require("../src/postmessage-service");
var iframe_service_1 = require("../src/iframe-service");
var logger_1 = require("../src/logger");
describe('PostMessageService', function () {
    var postMessageService;
    var uiService;
    var target;
    var request = {
        jsonrpc: '2.0',
        id: 123,
        method: 'foo',
        params: ['bar', 1, true]
    };
    var response = {
        jsonrpc: '2.0',
        id: 123,
        result: { isFooBar: true }
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    postMessageService = new postmessage_service_1.PostMessageService({ timeoutMs: 1000, maxRetries: 5 });
                    postMessageService.setUrl('*');
                    uiService = new iframe_service_1.IFrameService();
                    return [4 /*yield*/, uiService.mount()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uiService.getTarget()];
                case 2:
                    target = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should send a message', function () {
        return new Promise(function (done) {
            target.addEventListener('message', function (event) {
                var receivedMessage = event.data;
                expect(receivedMessage).toEqual(request);
                done();
            });
            postMessageService.send(target, request, '*');
        });
    });
    it('should retry sending a message', function () {
        return new Promise(function (done) {
            var originalMessageHandler = target.onmessage;
            target.onmessage = function () { return ({}); };
            var sendSpy = jest.spyOn(postMessageService, 'send');
            jest.useFakeTimers();
            postMessageService.send(target, request, '*');
            jest.advanceTimersByTime(3000);
            expect(sendSpy).toHaveBeenCalledTimes(4);
            target.onmessage = originalMessageHandler;
            jest.useRealTimers();
            target.addEventListener('message', function (event) {
                var receivedMessage = event.data;
                expect(receivedMessage).toEqual(request);
                done();
            });
        });
    });
    it('should timeout sending a message when the wallet is unreachable', function () {
        target.onmessage = function () { return ({}); };
        var sendSpy = jest.spyOn(postMessageService, 'send');
        var warnSpy = jest.spyOn(logger_1.logger, 'warn');
        jest.useFakeTimers();
        postMessageService.send(target, request, '*');
        jest.advanceTimersByTime(5000);
        expect(sendSpy).toHaveBeenCalledTimes(5);
        jest.useRealTimers();
        expect(warnSpy).toHaveBeenCalledWith({ message: request }, 'Request timed out after 5 attempts');
    });
    it('should request and respond', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    target.onmessage = function (event) {
                        var receivedRequest = event.data;
                        expect(receivedRequest).toEqual(request);
                        target.parent.postMessage(response, '*');
                    };
                    return [4 /*yield*/, postMessageService.request(target, request)];
                case 1:
                    result = _a.sent();
                    expect(result.isFooBar).toEqual(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('can clear pending retries when calling acknowledge()', function () {
        target.onmessage = function () { return ({}); };
        var sendSpy = jest.spyOn(postMessageService, 'send');
        jest.useFakeTimers();
        postMessageService.send(target, request, '*');
        jest.advanceTimersByTime(2000);
        postMessageService.acknowledge();
        jest.useRealTimers();
        expect(sendSpy).toHaveBeenCalledTimes(3);
    });
    afterEach(function () {
        uiService.unmount();
    });
});
//# sourceMappingURL=postmessage-service.test.js.map