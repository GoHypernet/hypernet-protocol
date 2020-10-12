"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var ethers_1 = require("ethers");
var signatures_1 = require("../../src/signatures");
var transactions_1 = require("../../src/transactions");
var wallet = ethers_1.Wallet.createRandom();
var channel = {
    chainId: '0x1',
    channelNonce: 0x1,
    participants: [wallet.address],
};
var challengeState = {
    channel: channel,
    turnNum: 0,
    isFinal: false,
    appDefinition: ethers_1.ethers.constants.AddressZero,
    appData: '0x00',
    outcome: [],
    challengeDuration: 0x0,
};
var signedState;
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, signatures_1.signState({
                    turnNum: 0,
                    isFinal: false,
                    appDefinition: ethers_1.ethers.constants.AddressZero,
                    appData: '0x00',
                    outcome: [],
                    channel: channel,
                    challengeDuration: 0x0,
                }, wallet.privateKey)];
            case 1:
                signedState = _a.sent();
                return [2];
        }
    });
}); });
describe('transaction-generators', function () {
    it('creates a force move transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionRequest;
        return __generator(this, function (_a) {
            transactionRequest = transactions_1.createForceMoveTransaction([signedState], wallet.privateKey);
            expect(transactionRequest.data).toBeDefined();
            return [2];
        });
    }); });
    it('creates a conclude from open transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionRequest;
        return __generator(this, function (_a) {
            transactionRequest = transactions_1.createConcludeTransaction([
                signedState,
            ]);
            expect(transactionRequest.data).toBeDefined();
            return [2];
        });
    }); });
    it('creates a conclude from challenged transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionRequest;
        return __generator(this, function (_a) {
            transactionRequest = transactions_1.createConcludeTransaction([
                signedState,
            ]);
            expect(transactionRequest.data).toBeDefined();
            return [2];
        });
    }); });
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    turnNum   | expectedWhoSignedWhat\n    ", " | ", "\n    ", " | ", "\n  "], ["\n    turnNum   | expectedWhoSignedWhat\n    ", " | ", "\n    ", " | ", "\n  "])), [0, 1], [0, 1], [1, 2], [1, 0])('creates a correct signature arguments when handling multiple states', function (_a) {
        var turnNum = _a.turnNum, expectedWhoSignedWhat = _a.expectedWhoSignedWhat;
        return __awaiter(void 0, void 0, void 0, function () {
            var wallet2, twoPlayerChannel, signedStates, _b, _c, states, signatures, whoSignedWhat;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        wallet2 = ethers_1.Wallet.createRandom();
                        twoPlayerChannel = __assign(__assign({}, channel), { participants: [wallet.address, wallet2.address] });
                        return [4, signatures_1.signState({
                                turnNum: turnNum[0],
                                isFinal: false,
                                appDefinition: ethers_1.ethers.constants.AddressZero,
                                appData: '0x00',
                                outcome: [],
                                channel: twoPlayerChannel,
                                challengeDuration: 0x0,
                            }, turnNum[0] % 2 === 0 ? wallet.privateKey : wallet2.privateKey)];
                    case 1:
                        _b = [
                            _d.sent()
                        ];
                        return [4, signatures_1.signState({
                                turnNum: turnNum[1],
                                isFinal: false,
                                appDefinition: ethers_1.ethers.constants.AddressZero,
                                appData: '0x00',
                                outcome: [],
                                channel: twoPlayerChannel,
                                challengeDuration: 0x0,
                            }, turnNum[1] % 2 === 0 ? wallet.privateKey : wallet2.privateKey)];
                    case 2:
                        signedStates = _b.concat([
                            _d.sent()
                        ]);
                        _c = transactions_1.createSignatureArguments(signedStates), states = _c.states, signatures = _c.signatures, whoSignedWhat = _c.whoSignedWhat;
                        expect(states).toHaveLength(2);
                        expect(signatures).toHaveLength(2);
                        expect(whoSignedWhat).toEqual(expectedWhoSignedWhat);
                        return [2];
                }
            });
        });
    });
    describe('respond transactions', function () {
        it('creates a transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionRequest;
            return __generator(this, function (_a) {
                transactionRequest = transactions_1.createRespondTransaction(challengeState, signedState);
                expect(transactionRequest.data).toBeDefined();
                return [2];
            });
        }); });
        it('throws an error when there is no challenge state', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(function () {
                    transactions_1.createRespondTransaction(null, signedState);
                }).toThrow();
                return [2];
            });
        }); });
    });
    describe('respond with checkpoint transactions', function () {
        it('creates a transaction when there is a challenge state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionRequest;
            return __generator(this, function (_a) {
                transactionRequest = transactions_1.createCheckpointTransaction([
                    signedState,
                ]);
                expect(transactionRequest.data).toBeDefined();
                return [2];
            });
        }); });
        it('creates a transaction when the chabbnel is open', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactionRequest;
            return __generator(this, function (_a) {
                transactionRequest = transactions_1.createCheckpointTransaction([
                    signedState,
                ]);
                expect(transactionRequest.data).toBeDefined();
                return [2];
            });
        }); });
    });
});
var templateObject_1;
//# sourceMappingURL=transactions.test.js.map