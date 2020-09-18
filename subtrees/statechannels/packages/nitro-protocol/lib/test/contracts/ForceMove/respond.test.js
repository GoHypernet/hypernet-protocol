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
var TESTForceMove_json_1 = __importDefault(require("../../../build/contracts/TESTForceMove.json"));
var channel_1 = require("../../../src/contract/channel");
var channel_storage_1 = require("../../../src/contract/channel-storage");
var state_1 = require("../../../src/contract/state");
var force_move_1 = require("../../../src/contract/transaction-creators/force-move");
var revert_reasons_1 = require("../../../src/contract/transaction-creators/revert-reasons");
var test_helpers_1 = require("../../test-helpers");
var signatures_1 = require("../../../src/signatures");
var provider = test_helpers_1.getTestProvider();
var ForceMove;
var chainId = '0x1234';
var participants = ['', '', ''];
var wallets = new Array(3);
var challengeDuration = 0x1000;
var assetHolderAddress = ethers_1.Wallet.createRandom().address;
var outcome = [{ assetHolderAddress: assetHolderAddress, allocationItems: [] }];
var appDefinition;
for (var i = 0; i < 3; i++) {
    wallets[i] = ethers_1.Wallet.createRandom();
    participants[i] = wallets[i].address;
}
var nonParticipant = ethers_1.Wallet.createRandom();
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
var description1 = 'It accepts a respond tx for an ongoing challenge';
var description2 = 'It reverts a respond tx if the challenge has expired';
var description3 = 'It reverts a respond tx if the channel storage does not match';
var description4 = 'It reverts a respond tx if it is not signed by the correct participant';
var description5 = 'It reverts a respond tx if the response state is not a validTransition from the challenge state';
describe('respond', function () {
    var channelNonce = 1000;
    var future = 1e12;
    var past = 1;
    beforeEach(function () { return (channelNonce += 1); });
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    description     | finalizesAt | slotEmpty | isFinalAB         | turnNumRecord | appDatas  | challenger    | responder         | reasonString\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "     | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "   | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", " | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n  "], ["\n    description     | finalizesAt | slotEmpty | isFinalAB         | turnNumRecord | appDatas  | challenger    | responder         | reasonString\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "     | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "   | ", " | ", "          | ", " | ", " | ", "     | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", " | ", "\n    ", " | ", "   | ", "  | ", " | ", "          | ", " | ", " | ", "     | ", "\n  "])), description1, future, false, [false, false], 0, [0, 0], wallets[0], wallets[1], undefined, description1, future, false, [false, false], 1, [0, 0], wallets[1], wallets[2], undefined, description1, future, false, [false, false], 2, [0, 0], wallets[2], wallets[0], undefined, description1, future, false, [false, false], 3, [0, 0], wallets[0], wallets[1], undefined, description1, future, false, [false, false], 4, [0, 0], wallets[1], wallets[2], undefined, description1, future, false, [false, false], 5, [0, 1], wallets[2], wallets[0], undefined, description1, future, false, [false, false], 6, [1, 2], wallets[0], wallets[1], undefined, description2, past, false, [false, false], 8, [0, 1], wallets[2], wallets[0], revert_reasons_1.NO_ONGOING_CHALLENGE, description3, future, true, [false, false], 8, [0, 1], wallets[2], wallets[0], revert_reasons_1.WRONG_CHANNEL_STORAGE, description4, future, false, [false, false], 8, [0, 1], wallets[2], nonParticipant, revert_reasons_1.RESPONSE_UNAUTHORIZED, description5, future, false, [false, false], 8, [0, 0], wallets[2], wallets[0], 'CountingApp: Counter must be incremented')('$description', function (_a) {
        var description = _a.description, isFinalAB = _a.isFinalAB, turnNumRecord = _a.turnNumRecord, appDatas = _a.appDatas, challenger = _a.challenger, responder = _a.responder, finalizesAt = _a.finalizesAt, slotEmpty = _a.slotEmpty, reasonString = _a.reasonString;
        return __awaiter(void 0, void 0, void 0, function () {
            var channel, channelId, challengeState, responseState, responseStateHash, challengeExistsHash, _b, responseSignature, tx, receipt, event, expectedChannelStorageHash, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        channel = { chainId: chainId, channelNonce: channelNonce, participants: participants };
                        channelId = channel_1.getChannelId(channel);
                        challengeState = {
                            turnNum: turnNumRecord,
                            isFinal: isFinalAB[0],
                            channel: channel,
                            outcome: outcome,
                            appData: ethers_1.ethers.utils.defaultAbiCoder.encode(['uint256'], [appDatas[0]]),
                            appDefinition: appDefinition,
                            challengeDuration: challengeDuration,
                        };
                        responseState = {
                            turnNum: turnNumRecord + 1,
                            isFinal: isFinalAB[1],
                            channel: channel,
                            outcome: outcome,
                            appData: ethers_1.ethers.utils.defaultAbiCoder.encode(['uint256'], [appDatas[1]]),
                            appDefinition: appDefinition,
                            challengeDuration: challengeDuration,
                        };
                        responseStateHash = state_1.hashState(responseState);
                        challengeExistsHash = slotEmpty
                            ? ethers_1.ethers.constants.HashZero
                            : channel_storage_1.channelDataToChannelStorageHash({
                                turnNumRecord: turnNumRecord,
                                finalizesAt: finalizesAt,
                                state: challenger ? challengeState : undefined,
                                challengerAddress: challenger.address,
                                outcome: outcome,
                            });
                        return [4, ForceMove.setChannelStorageHash(channelId, challengeExistsHash)];
                    case 1: return [4, (_d.sent()).wait()];
                    case 2:
                        _d.sent();
                        _b = expect;
                        return [4, ForceMove.channelStorageHashes(channelId)];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(challengeExistsHash);
                        return [4, signatures_1.sign(responder, responseStateHash)];
                    case 4:
                        responseSignature = _d.sent();
                        tx = ForceMove.respond.apply(ForceMove, force_move_1.respondArgs({ challengeState: challengeState, responseSignature: responseSignature, responseState: responseState }));
                        if (!reasonString) return [3, 6];
                        return [4, devtools_1.expectRevert(function () { return tx; }, reasonString)];
                    case 5:
                        _d.sent();
                        return [3, 11];
                    case 6: return [4, tx];
                    case 7: return [4, (_d.sent()).wait()];
                    case 8:
                        receipt = _d.sent();
                        return [4, test_helpers_1.writeGasConsumption('./respond.gas.md', description, receipt.gasUsed)];
                    case 9:
                        _d.sent();
                        event = receipt.events.pop();
                        expect(event.args).toMatchObject({
                            channelId: channelId,
                            newTurnNumRecord: turnNumRecord + 1,
                        });
                        expectedChannelStorageHash = channel_storage_1.channelDataToChannelStorageHash({
                            turnNumRecord: turnNumRecord + 1,
                            finalizesAt: 0,
                        });
                        _c = expect;
                        return [4, ForceMove.channelStorageHashes(channelId)];
                    case 10:
                        _c.apply(void 0, [_d.sent()]).toEqual(expectedChannelStorageHash);
                        _d.label = 11;
                    case 11: return [2];
                }
            });
        });
    });
});
var templateObject_1;
//# sourceMappingURL=respond.test.js.map