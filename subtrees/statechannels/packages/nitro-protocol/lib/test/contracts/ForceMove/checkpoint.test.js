"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var defaultAbiCoder = ethers_1.ethers.utils.defaultAbiCoder;
var TESTForceMove_json_1 = __importDefault(require("../../../build/contracts/TESTForceMove.json"));
var channel_1 = require("../../../src/contract/channel");
var channel_storage_1 = require("../../../src/contract/channel-storage");
var force_move_1 = require("../../../src/contract/transaction-creators/force-move");
var revert_reasons_1 = require("../../../src/contract/transaction-creators/revert-reasons");
var revert_reasons_2 = require("../../revert-reasons");
var test_helpers_1 = require("../../test-helpers");
var src_1 = require("../../../src");
var provider = test_helpers_1.getTestProvider();
var ForceMove;
var chainId = '0x1234';
var participants = ['', '', ''];
var wallets = new Array(3);
var challengeDuration = 0x1000;
var assetHolderAddress = ethers_1.Wallet.createRandom().address;
var defaultOutcome = [{ assetHolderAddress: assetHolderAddress, allocationItems: [] }];
var appDefinition;
for (var i = 0; i < 3; i++) {
    wallets[i] = ethers_1.Wallet.createRandom();
    participants[i] = wallets[i].address;
}
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, test_helpers_1.setupContracts(provider, TESTForceMove_json_1.default, process.env.TEST_FORCE_MOVE_ADDRESS)];
            case 1:
                ForceMove = _a.sent();
                appDefinition = test_helpers_1.getPlaceHolderContractAddress();
                return [2];
        }
    });
}); });
var valid = {
    whoSignedWhat: [0, 0, 0],
    appDatas: [0],
};
var invalidTransition = {
    whoSignedWhat: [0, 1, 2],
    appDatas: [0, 2, 1],
};
var unsupported = {
    whoSignedWhat: [0, 0, 0],
    appDatas: [0, 1, 2],
};
var itOpensTheChannelIf = 'It accepts valid input, and clears any existing challenge, if';
var accepts1 = itOpensTheChannelIf + 'the slot is empty';
var accepts2 = itOpensTheChannelIf + 'there is a challenge and the existing turnNumRecord is increased';
var accepts3 = itOpensTheChannelIf + 'there is no challenge and the existing turnNumRecord is increased';
var itRevertsWhenOpenBut = 'It reverts when the channel is open, but ';
var reverts1 = itRevertsWhenOpenBut + 'the turnNumRecord is not increased.';
var reverts2 = itRevertsWhenOpenBut + 'there is an invalid transition';
var reverts3 = itRevertsWhenOpenBut + 'the final state is not supported';
var itRevertsWithChallengeBut = 'It reverts when there is an ongoing challenge, but ';
var reverts4 = itRevertsWithChallengeBut + 'the turnNumRecord is not increased.';
var reverts5 = itRevertsWithChallengeBut + 'there is an invalid transition';
var reverts6 = itRevertsWithChallengeBut + 'the final state is not supported';
var reverts7 = 'It reverts when a challenge has expired';
var future = 1e12;
var past = 1;
var never = '0x00';
var turnNumRecord = 7;
describe('checkpoint', function () {
    var channelNonce = 300;
    beforeEach(function () { return (channelNonce += 1); });
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    description | largestTurnNum       | support              | challenger    | finalizesAt  | reason\n    ", " | ", " | ", "             | ", " | ", " | ", "\n    ", " | ", " | ", "             | ", " | ", "     | ", "\n    ", " | ", " | ", "             | ", " | ", "    | ", "\n    ", " | ", "     | ", "             | ", " | ", "     | ", "\n    ", " | ", " | ", " | ", " | ", "     | ", "\n    ", " | ", " | ", "       | ", " | ", "     | ", "\n    ", " | ", "     | ", "             | ", " | ", "    | ", "\n    ", " | ", " | ", " | ", " | ", "    | ", "\n    ", " | ", " | ", "       | ", " | ", "    | ", "\n    ", " | ", " | ", "             | ", " | ", "      | ", "\n  "], ["\n    description | largestTurnNum       | support              | challenger    | finalizesAt  | reason\n    ", " | ", " | ", "             | ", " | ", " | ", "\n    ", " | ", " | ", "             | ", " | ", "     | ", "\n    ", " | ", " | ", "             | ", " | ", "    | ", "\n    ", " | ", "     | ", "             | ", " | ", "     | ", "\n    ", " | ", " | ", " | ", " | ", "     | ", "\n    ", " | ", " | ", "       | ", " | ", "     | ", "\n    ", " | ", "     | ", "             | ", " | ", "    | ", "\n    ", " | ", " | ", " | ", " | ", "    | ", "\n    ", " | ", " | ", "       | ", " | ", "    | ", "\n    ", " | ", " | ", "             | ", " | ", "      | ", "\n  "])), accepts1, turnNumRecord + 1, valid, wallets[1], undefined, undefined, accepts2, turnNumRecord + 3, valid, wallets[1], never, undefined, accepts3, turnNumRecord + 4, valid, wallets[1], future, undefined, reverts1, turnNumRecord, valid, wallets[1], never, revert_reasons_1.TURN_NUM_RECORD_NOT_INCREASED, reverts2, turnNumRecord + 1, invalidTransition, wallets[1], never, revert_reasons_2.COUNTING_APP_INVALID_TRANSITION, reverts3, turnNumRecord + 1, unsupported, wallets[1], never, revert_reasons_1.UNACCEPTABLE_WHO_SIGNED_WHAT, reverts4, turnNumRecord, valid, wallets[1], future, revert_reasons_1.TURN_NUM_RECORD_NOT_INCREASED, reverts5, turnNumRecord + 1, invalidTransition, wallets[1], future, revert_reasons_2.COUNTING_APP_INVALID_TRANSITION, reverts6, turnNumRecord + 1, unsupported, wallets[1], future, revert_reasons_1.UNACCEPTABLE_WHO_SIGNED_WHAT, reverts7, turnNumRecord + 1, valid, wallets[1], past, revert_reasons_1.CHANNEL_FINALIZED)('$description', function (_a) {
        var largestTurnNum = _a.largestTurnNum, support = _a.support, challenger = _a.challenger, finalizesAt = _a.finalizesAt, reason = _a.reason;
        return __awaiter(void 0, void 0, void 0, function () {
            var appDatas, whoSignedWhat, channel, channelId, states, isOpen, outcome, challengerAddress, challengeState, channelStorageHashes, _b, signatures, tx, receipt, event, expectedChannelStorageHash, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        appDatas = support.appDatas, whoSignedWhat = support.whoSignedWhat;
                        channel = { chainId: chainId, channelNonce: channelNonce, participants: participants };
                        channelId = channel_1.getChannelId(channel);
                        states = appDatas.map(function (data, idx) { return ({
                            turnNum: largestTurnNum - appDatas.length + 1 + idx,
                            isFinal: false,
                            channel: channel,
                            challengeDuration: challengeDuration,
                            outcome: defaultOutcome,
                            appData: defaultAbiCoder.encode(['uint256'], [data]),
                            appDefinition: appDefinition,
                        }); });
                        isOpen = !!finalizesAt;
                        outcome = isOpen ? undefined : defaultOutcome;
                        challengerAddress = isOpen ? undefined : challenger.address;
                        challengeState = isOpen
                            ? undefined
                            : {
                                turnNum: turnNumRecord,
                                isFinal: false,
                                channel: channel,
                                outcome: outcome,
                                appData: defaultAbiCoder.encode(['uint256'], [appDatas[0]]),
                                appDefinition: appDefinition,
                                challengeDuration: challengeDuration,
                            };
                        channelStorageHashes = finalizesAt
                            ? channel_storage_1.channelDataToChannelStorageHash({
                                turnNumRecord: turnNumRecord,
                                finalizesAt: finalizesAt,
                                state: challengeState,
                                challengerAddress: challengerAddress,
                                outcome: outcome,
                            })
                            : HashZero;
                        return [4, ForceMove.setChannelStorageHash(channelId, channelStorageHashes)];
                    case 1: return [4, (_d.sent()).wait()];
                    case 2:
                        _d.sent();
                        _b = expect;
                        return [4, ForceMove.channelStorageHashes(channelId)];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(channelStorageHashes);
                        return [4, src_1.signStates(states, wallets, whoSignedWhat)];
                    case 4:
                        signatures = _d.sent();
                        tx = ForceMove.checkpoint.apply(ForceMove, force_move_1.checkpointArgs({ states: states, signatures: signatures, whoSignedWhat: whoSignedWhat }));
                        if (!reason) return [3, 6];
                        return [4, devtools_1.expectRevert(function () { return tx; }, reason)];
                    case 5:
                        _d.sent();
                        return [3, 10];
                    case 6: return [4, tx];
                    case 7: return [4, (_d.sent()).wait()];
                    case 8:
                        receipt = _d.sent();
                        event = receipt.events.pop();
                        expect(event.args).toMatchObject({
                            channelId: channelId,
                            newTurnNumRecord: largestTurnNum,
                        });
                        expectedChannelStorageHash = channel_storage_1.channelDataToChannelStorageHash({
                            turnNumRecord: largestTurnNum,
                            finalizesAt: 0x0,
                        });
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
var templateObject_1;
//# sourceMappingURL=checkpoint.test.js.map