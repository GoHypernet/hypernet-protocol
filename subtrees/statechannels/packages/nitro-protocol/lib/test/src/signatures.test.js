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
var ethers_1 = require("ethers");
var _a = ethers_1.ethers.utils, arrayify = _a.arrayify, splitSignature = _a.splitSignature, verifyMessage = _a.verifyMessage;
var challenge_1 = require("../../src/contract/challenge");
var state_1 = require("../../src/contract/state");
var signatures_1 = require("../../src/signatures");
describe('signatures', function () {
    describe('signState', function () {
        it('signs a state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wallet, state, signedState, hashedState, signature, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        wallet = ethers_1.Wallet.createRandom();
                        state = {
                            channel: { chainId: '0x1', channelNonce: 0x01, participants: [wallet.address] },
                            outcome: [],
                            turnNum: 1,
                            isFinal: false,
                            appData: '0x00',
                            appDefinition: ethers_1.ethers.constants.AddressZero,
                            challengeDuration: 0x5,
                        };
                        signedState = signatures_1.signState(state, wallet.privateKey);
                        hashedState = state_1.hashState(state);
                        _a = splitSignature;
                        return [4, wallet.signMessage(arrayify(hashedState))];
                    case 1:
                        signature = _a.apply(void 0, [_b.sent()]);
                        expect(signedState).toMatchObject({
                            state: state,
                            signature: signature,
                        });
                        expect(signatures_1.getStateSignerAddress(signedState)).toEqual(wallet.address);
                        return [2];
                }
            });
        }); });
        it('throws an exception if signing with non-participant private key', function () {
            var wallet = ethers_1.Wallet.createRandom();
            var state = {
                channel: {
                    chainId: '0x1',
                    channelNonce: 0x01,
                    participants: [ethers_1.Wallet.createRandom().address],
                },
                outcome: [],
                turnNum: 1,
                isFinal: false,
                appData: '0x00',
                appDefinition: ethers_1.ethers.constants.AddressZero,
                challengeDuration: 0x5,
            };
            expect(function () {
                signatures_1.signState(state, wallet.privateKey);
            }).toThrow();
        });
    });
    describe('signChallengeMessage', function () {
        it('signs a challenge message', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wallet, channel, state, signature, challenger;
            return __generator(this, function (_a) {
                wallet = ethers_1.Wallet.createRandom();
                channel = { chainId: '0x1', channelNonce: 0x01, participants: [wallet.address] };
                state = {
                    channel: channel,
                    outcome: [],
                    turnNum: 1,
                    isFinal: false,
                    appData: '0x00',
                    appDefinition: ethers_1.ethers.constants.AddressZero,
                    challengeDuration: 0x5,
                };
                signature = signatures_1.signChallengeMessage([signatures_1.signState(state, wallet.privateKey)], wallet.privateKey);
                challenger = verifyMessage(arrayify(challenge_1.hashChallengeMessage(state)), signature);
                expect(challenger).toEqual(wallet.address);
                return [2];
            });
        }); });
        it('throws an exception if signing with non-participant private key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wallet, state, hashedState, signature, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        wallet = ethers_1.Wallet.createRandom();
                        state = {
                            channel: {
                                chainId: '0x1',
                                channelNonce: 0x01,
                                participants: [ethers_1.Wallet.createRandom().address],
                            },
                            outcome: [],
                            turnNum: 1,
                            isFinal: false,
                            appData: '0x00',
                            appDefinition: ethers_1.ethers.constants.AddressZero,
                            challengeDuration: 0x5,
                        };
                        hashedState = state_1.hashState(state);
                        _a = splitSignature;
                        return [4, wallet.signMessage(arrayify(hashedState))];
                    case 1:
                        signature = _a.apply(void 0, [_b.sent()]);
                        expect(function () {
                            signatures_1.signChallengeMessage([{ state: state, signature: signature }], wallet.privateKey);
                        }).toThrow();
                        return [2];
                }
            });
        }); });
    });
    describe('getStateSignerAddress', function () {
        it('correctly recovers a state signer address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wallet, state, hashedState, signature, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        wallet = ethers_1.Wallet.createRandom();
                        state = {
                            channel: { chainId: '0x1', channelNonce: 0x1, participants: [wallet.address] },
                            outcome: [],
                            turnNum: 1,
                            isFinal: false,
                            appData: '0x00',
                            appDefinition: ethers_1.ethers.constants.AddressZero,
                            challengeDuration: 0x5,
                        };
                        hashedState = state_1.hashState(state);
                        _a = splitSignature;
                        return [4, wallet.signMessage(arrayify(hashedState))];
                    case 1:
                        signature = _a.apply(void 0, [_b.sent()]);
                        expect(signatures_1.getStateSignerAddress({ state: state, signature: signature })).toEqual(wallet.address);
                        return [2];
                }
            });
        }); });
        it('throws an exception when the signer is not a participant', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wallet, state, hashedState, signature, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        wallet = ethers_1.Wallet.createRandom();
                        state = {
                            channel: {
                                chainId: '0x1',
                                channelNonce: 0x1,
                                participants: [ethers_1.Wallet.createRandom().address],
                            },
                            outcome: [],
                            turnNum: 1,
                            isFinal: false,
                            appData: '0x00',
                            appDefinition: ethers_1.ethers.constants.AddressZero,
                            challengeDuration: 0x5,
                        };
                        hashedState = state_1.hashState(state);
                        _a = splitSignature;
                        return [4, wallet.signMessage(arrayify(hashedState))];
                    case 1:
                        signature = _a.apply(void 0, [_b.sent()]);
                        expect(function () { return signatures_1.getStateSignerAddress({ state: state, signature: signature }); }).toThrow();
                        return [2];
                }
            });
        }); });
    });
});
//# sourceMappingURL=signatures.test.js.map