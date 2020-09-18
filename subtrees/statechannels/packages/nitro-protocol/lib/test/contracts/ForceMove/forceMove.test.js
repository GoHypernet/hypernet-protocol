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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var devtools_1 = require("@statechannels/devtools");
var ethers_1 = require("ethers");
var HashZero = ethers_1.ethers.constants.HashZero;
var _a = ethers_1.ethers.utils, defaultAbiCoder = _a.defaultAbiCoder, hexlify = _a.hexlify;
var TESTForceMove_json_1 = __importDefault(require("../../../build/contracts/TESTForceMove.json"));
var channel_1 = require("../../../src/contract/channel");
var channel_storage_1 = require("../../../src/contract/channel-storage");
var state_1 = require("../../../src/contract/state");
var revert_reasons_1 = require("../../../src/contract/transaction-creators/revert-reasons");
var signatures_1 = require("../../../src/signatures");
var revert_reasons_2 = require("../../revert-reasons");
var test_helpers_1 = require("../../test-helpers");
var transactions_1 = require("../../../src/transactions");
var provider = test_helpers_1.getTestProvider();
var ForceMove;
var chainId = '0x1234';
var participants = ['', '', ''];
var wallets = new Array(3);
var challengeDuration = 0x1;
var outcome = [{ allocationItems: [], assetHolderAddress: ethers_1.Wallet.createRandom().address }];
var appDefinition = test_helpers_1.getPlaceHolderContractAddress();
var keys = [
    '0x8624ebe7364bb776f891ca339f0aaa820cc64cc9fca6a28eec71e6d8fc950f29',
    '0x275a2e2cd9314f53b42246694034a80119963097e3adf495fbf6d821dc8b6c8e',
    '0x1b7598002c59e7d9131d7e7c9d0ec48ed065a3ed04af56674497d6b0048f2d84',
];
for (var i = 0; i < 3; i++) {
    wallets[i] = new ethers_1.Wallet(keys[i]);
    participants[i] = wallets[i].address;
}
var twoPartyChannel = {
    chainId: '0x1',
    channelNonce: 0x1,
    participants: [wallets[0].address, wallets[1].address],
};
function createSignedCountingAppState(channel, appData, turnNum) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, signatures_1.signState({
                        turnNum: turnNum,
                        isFinal: false,
                        appDefinition: test_helpers_1.getPlaceHolderContractAddress(),
                        appData: defaultAbiCoder.encode(['uint256'], [appData]),
                        outcome: [],
                        channel: channel,
                        challengeDuration: 0xfff,
                    }, wallets[turnNum % channel.participants.length].privateKey)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, test_helpers_1.setupContracts(provider, TESTForceMove_json_1.default, process.env.TEST_FORCE_MOVE_ADDRESS)];
            case 1:
                ForceMove = _a.sent();
                return [2];
        }
    });
}); });
var acceptsWhenOpen = 'It accepts for an open channel, and updates storage correctly, ';
var accepts1 = acceptsWhenOpen + 'when the slot is empty, 1 state submitted';
var accepts2 = acceptsWhenOpen + 'when the slot is empty, 3 states submitted';
var accepts3 = acceptsWhenOpen + 'when the slot is not empty, 3 states submitted';
var accepts4 = acceptsWhenOpen + 'when the slot is not empty, 1 state submitted';
var acceptsWhenChallengePresent = 'It accepts when a challenge is present, and updates storage correctly, ';
var accepts5 = acceptsWhenChallengePresent + 'when the turnNumRecord increases, 1 state';
var accepts6 = acceptsWhenChallengePresent + 'when the turnNumRecord increases, 3 states';
var revertsWhenOpenIf = 'It reverts for an open channel if ';
var reverts1 = revertsWhenOpenIf + 'the turnNumRecord does not increase';
var reverts2 = revertsWhenOpenIf + 'the challengerSig is incorrect';
var reverts3 = revertsWhenOpenIf + 'the states do not form a validTransition chain';
var reverts4 = 'It reverts when a challenge is present if the turnNumRecord does not increase';
var reverts5 = 'It reverts when the channel is finalized';
describe('forceMove', function () {
    var threeStates = { appDatas: [0, 1, 2], whoSignedWhat: [0, 1, 2] };
    var oneState = { appDatas: [2], whoSignedWhat: [0, 0, 0] };
    var invalid = { appDatas: [0, 2, 1], whoSignedWhat: [0, 1, 2] };
    var largestTurnNum = 8;
    var isFinalCount = 0;
    var challenger = wallets[2];
    var wrongSig = { v: 1, s: HashZero, r: HashZero };
    var empty = HashZero;
    var openAtFive = test_helpers_1.clearedChallengeHash(5);
    var openAtLargestTurnNum = test_helpers_1.clearedChallengeHash(largestTurnNum);
    var openAtTwenty = test_helpers_1.clearedChallengeHash(20);
    var challengeAtFive = test_helpers_1.ongoingChallengeHash(5);
    var challengeAtLargestTurnNum = test_helpers_1.ongoingChallengeHash(largestTurnNum);
    var challengeAtTwenty = test_helpers_1.ongoingChallengeHash(20);
    var finalizedAtFive = test_helpers_1.finalizedOutcomeHash(5);
    var channelNonce = 200;
    beforeEach(function () { return (channelNonce += 1); });
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    description | initialChannelStorageHash    | stateData      | challengeSignature | reasonString\n    ", " | ", "                     | ", "    | ", "       | ", "\n    ", " | ", "                     | ", " | ", "       | ", "\n    ", " | ", "                | ", "    | ", "       | ", "\n    ", " | ", "      | ", "    | ", "       | ", "\n    ", " | ", "                | ", " | ", "       | ", "\n    ", " | ", "           | ", "    | ", "       | ", "\n    ", " | ", "           | ", " | ", "       | ", "\n    ", " | ", "              | ", "    | ", "       | ", "\n    ", " | ", "                     | ", "    | ", "        | ", "\n    ", " | ", "                     | ", "     | ", "       | ", "\n    ", " | ", "         | ", "    | ", "       | ", "\n    ", " | ", " | ", "    | ", "       | ", "\n    ", " | ", "           | ", "    | ", "       | ", "\n  "], ["\n    description | initialChannelStorageHash    | stateData      | challengeSignature | reasonString\n    ", " | ", "                     | ", "    | ", "       | ", "\n    ", " | ", "                     | ", " | ", "       | ", "\n    ", " | ", "                | ", "    | ", "       | ", "\n    ", " | ", "      | ", "    | ", "       | ", "\n    ", " | ", "                | ", " | ", "       | ", "\n    ", " | ", "           | ", "    | ", "       | ", "\n    ", " | ", "           | ", " | ", "       | ", "\n    ", " | ", "              | ", "    | ", "       | ", "\n    ", " | ", "                     | ", "    | ", "        | ", "\n    ", " | ", "                     | ", "     | ", "       | ", "\n    ", " | ", "         | ", "    | ", "       | ", "\n    ", " | ", " | ", "    | ", "       | ", "\n    ", " | ", "           | ", "    | ", "       | ", "\n  "])), accepts1, empty, oneState, undefined, undefined, accepts2, empty, threeStates, undefined, undefined, accepts3, openAtFive, oneState, undefined, undefined, accepts3, openAtLargestTurnNum, oneState, undefined, undefined, accepts4, openAtFive, threeStates, undefined, undefined, accepts5, challengeAtFive, oneState, undefined, undefined, accepts6, challengeAtFive, threeStates, undefined, undefined, reverts1, openAtTwenty, oneState, undefined, revert_reasons_1.TURN_NUM_RECORD_DECREASED, reverts2, empty, oneState, wrongSig, revert_reasons_1.CHALLENGER_NON_PARTICIPANT, reverts3, empty, invalid, undefined, revert_reasons_2.COUNTING_APP_INVALID_TRANSITION, reverts4, challengeAtTwenty, oneState, undefined, revert_reasons_1.TURN_NUM_RECORD_NOT_INCREASED, reverts4, challengeAtLargestTurnNum, oneState, undefined, revert_reasons_1.TURN_NUM_RECORD_NOT_INCREASED, reverts5, finalizedAtFive, oneState, undefined, revert_reasons_1.CHANNEL_FINALIZED)('$description', function (_a) {
        var description = _a.description, initialChannelStorageHash = _a.initialChannelStorageHash, stateData = _a.stateData, challengeSignature = _a.challengeSignature, reasonString = _a.reasonString;
        return __awaiter(void 0, void 0, void 0, function () {
            var appDatas, whoSignedWhat, channel, channelId, states, variableParts, fixedPart, signatures, challengeState, tx, receipt, event, _b, eventChannelId, eventTurnNumRecord, eventFinalizesAt, eventChallenger, eventIsFinal, eventFixedPart, eventVariableParts, expectedChannelStorage, expectedChannelStorageHash, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        appDatas = stateData.appDatas, whoSignedWhat = stateData.whoSignedWhat;
                        channel = {
                            chainId: chainId,
                            participants: participants,
                            channelNonce: channelNonce,
                        };
                        channelId = channel_1.getChannelId(channel);
                        states = appDatas.map(function (data, idx) { return ({
                            turnNum: largestTurnNum - appDatas.length + 1 + idx,
                            isFinal: idx > appDatas.length - isFinalCount,
                            channel: channel,
                            challengeDuration: challengeDuration,
                            outcome: outcome,
                            appDefinition: appDefinition,
                            appData: defaultAbiCoder.encode(['uint256'], [data]),
                        }); });
                        variableParts = states.map(function (state) { return state_1.getVariablePart(state); });
                        fixedPart = state_1.getFixedPart(states[0]);
                        return [4, signatures_1.signStates(states, wallets, whoSignedWhat)];
                    case 1:
                        signatures = _d.sent();
                        challengeState = {
                            state: states[states.length - 1],
                            signature: { v: 0, r: '', s: '', _vs: '', recoveryParam: 0 },
                        };
                        challengeSignature =
                            challengeSignature || signatures_1.signChallengeMessage([challengeState], challenger.privateKey);
                        return [4, ForceMove.setChannelStorageHash(channelId, initialChannelStorageHash)];
                    case 2: return [4, (_d.sent()).wait()];
                    case 3:
                        _d.sent();
                        tx = ForceMove.forceMove(fixedPart, largestTurnNum, variableParts, isFinalCount, signatures, whoSignedWhat, challengeSignature);
                        if (!reasonString) return [3, 5];
                        return [4, devtools_1.expectRevert(function () { return tx; }, reasonString)];
                    case 4:
                        _d.sent();
                        return [3, 10];
                    case 5: return [4, tx];
                    case 6: return [4, (_d.sent()).wait()];
                    case 7:
                        receipt = _d.sent();
                        return [4, test_helpers_1.writeGasConsumption('./forceMove.gas.md', description, receipt.gasUsed)];
                    case 8:
                        _d.sent();
                        event = receipt.events.pop();
                        _b = event.args, eventChannelId = _b.channelId, eventTurnNumRecord = _b.turnNumRecord, eventFinalizesAt = _b.finalizesAt, eventChallenger = _b.challenger, eventIsFinal = _b.isFinal, eventFixedPart = _b.fixedPart, eventVariableParts = _b.variableParts;
                        expect(eventChannelId).toEqual(channelId);
                        expect(eventTurnNumRecord).toEqual(largestTurnNum);
                        expect(eventChallenger).toEqual(challenger.address);
                        expect(eventFixedPart[0]._hex).toEqual(hexlify(fixedPart.chainId));
                        expect(eventFixedPart[1]).toEqual(fixedPart.participants);
                        expect(eventFixedPart[2]).toEqual(fixedPart.channelNonce);
                        expect(eventFixedPart[3]).toEqual(fixedPart.appDefinition);
                        expect(eventFixedPart[4]).toEqual(fixedPart.challengeDuration);
                        expect(eventIsFinal).toEqual(isFinalCount > 0);
                        expect(eventVariableParts[eventVariableParts.length - 1][0]).toEqual(variableParts[variableParts.length - 1].outcome);
                        expect(eventVariableParts[eventVariableParts.length - 1][1]).toEqual(variableParts[variableParts.length - 1].appData);
                        expectedChannelStorage = {
                            turnNumRecord: largestTurnNum,
                            finalizesAt: eventFinalizesAt,
                            state: states[states.length - 1],
                            challengerAddress: challenger.address,
                            outcome: outcome,
                        };
                        expectedChannelStorageHash = channel_storage_1.channelDataToChannelStorageHash(expectedChannelStorage);
                        _c = expect;
                        return [4, ForceMove.channelStorageHashes(channelId)];
                    case 9:
                        _c.apply(void 0, [_d.sent()]).toEqual(expectedChannelStorageHash);
                        _d.label = 10;
                    case 10: return [2];
                }
            });
        });
    });
});
describe('forceMove with transaction generator', function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ForceMove.setChannelStorageHash(channel_1.getChannelId(twoPartyChannel), HashZero)];
                case 1: return [4, (_a.sent()).wait()];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ForceMove.setChannelStorageHash(channel_1.getChannelId(twoPartyChannel), HashZero)];
                case 1: return [4, (_a.sent()).wait()];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it.each(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    description                  | appData   | turnNums  | challenger\n    ", " | ", " | ", " | ", "\n    ", " | ", " | ", " | ", "\n  "], ["\n    description                  | appData   | turnNums  | challenger\n    ", " | ", " | ", " | ", "\n    ", " | ", " | ", " | ", "\n  "])), 'forceMove(0,1) accepted', [0, 0], [0, 1], 1, 'forceMove(1,2) accepted', [0, 0], [1, 2], 0)('$description', function (_a) {
        var description = _a.description, appData = _a.appData, turnNums = _a.turnNums, challenger = _a.challenger;
        return __awaiter(void 0, void 0, void 0, function () {
            var transactionRequest, _b, _c, signer, transaction, response;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = transactions_1.createForceMoveTransaction;
                        return [4, createSignedCountingAppState(twoPartyChannel, appData[0], turnNums[0])];
                    case 1:
                        _c = [
                            _d.sent()
                        ];
                        return [4, createSignedCountingAppState(twoPartyChannel, appData[1], turnNums[1])];
                    case 2:
                        transactionRequest = _b.apply(void 0, [_c.concat([
                                _d.sent()
                            ]), wallets[challenger].privateKey]);
                        signer = provider.getSigner();
                        transaction = { data: transactionRequest.data, gasLimit: 3000000 };
                        return [4, signer.sendTransaction(__assign({ to: ForceMove.address }, transaction))];
                    case 3:
                        response = _d.sent();
                        expect(response).toBeDefined();
                        return [2];
                }
            });
        });
    });
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=forceMove.test.js.map