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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var devtools_1 = require("@statechannels/devtools");
var ethers_1 = require("ethers");
var TESTAssetHolder_json_1 = __importDefault(require("../../../build/contracts/TESTAssetHolder.json"));
var TESTAssetHolder2_json_1 = __importDefault(require("../../../build/contracts/TESTAssetHolder2.json"));
var TESTNitroAdjudicator_json_1 = __importDefault(require("../../../build/contracts/TESTNitroAdjudicator.json"));
var channel_1 = require("../../../src/contract/channel");
var channel_storage_1 = require("../../../src/contract/channel-storage");
var nitro_adjudicator_1 = require("../../../src/contract/transaction-creators/nitro-adjudicator");
var test_helpers_1 = require("../../test-helpers");
var src_1 = require("../../../src");
var provider = test_helpers_1.getTestProvider();
var NitroAdjudicator;
var AssetHolder1;
var AssetHolder2;
var chainId = '0x1234';
var participants = ['', '', ''];
var wallets = new Array(3);
var challengeDuration = 0x1000;
var appDefinition;
var addresses = {
    c: undefined,
    C: test_helpers_1.randomChannelId(),
    X: test_helpers_1.randomChannelId(),
    A: test_helpers_1.randomExternalDestination(),
    B: test_helpers_1.randomExternalDestination(),
    ETH: undefined,
    TOK: undefined,
};
for (var i = 0; i < 3; i++) {
    wallets[i] = ethers_1.Wallet.createRandom();
    participants[i] = wallets[i].address;
}
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, test_helpers_1.setupContracts(provider, TESTNitroAdjudicator_json_1.default, process.env.TEST_NITRO_ADJUDICATOR_ADDRESS)];
            case 1:
                NitroAdjudicator = _a.sent();
                return [4, test_helpers_1.setupContracts(provider, TESTAssetHolder_json_1.default, process.env.TEST_ASSET_HOLDER_ADDRESS)];
            case 2:
                AssetHolder1 = _a.sent();
                return [4, test_helpers_1.setupContracts(provider, TESTAssetHolder2_json_1.default, process.env.TEST_ASSET_HOLDER2_ADDRESS)];
            case 3:
                AssetHolder2 = _a.sent();
                addresses.ETH = AssetHolder1.address;
                addresses.TOK = AssetHolder2.address;
                appDefinition = test_helpers_1.getPlaceHolderContractAddress();
                return [2];
        }
    });
}); });
var accepts1 = '1 Asset Types';
var accepts2 = '2 Asset Types';
var oneState = {
    whoSignedWhat: [0, 0, 0],
    appData: [ethers_1.ethers.constants.HashZero],
};
var turnNumRecord = 5;
var channelNonce = 400;
describe('concludePushOutcomeAndTransferAll', function () {
    beforeEach(function () { return (channelNonce += 1); });
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    description | outcomeShortHand              | heldBefore                    | heldAfter                     | newOutcome | payouts                       | reasonString\n    ", " | ", "              | ", "              | ", "              | ", "      | ", "              | ", "\n    ", " | ", " | ", " | ", " | ", "      | ", " | ", "\n  "], ["\n    description | outcomeShortHand              | heldBefore                    | heldAfter                     | newOutcome | payouts                       | reasonString\n    ", " | ", "              | ", "              | ", "              | ", "      | ", "              | ", "\n    ", " | ", " | ", " | ", " | ", "      | ", " | ", "\n  "])), accepts1, { ETH: { A: 1 } }, { ETH: { c: 1 } }, { ETH: { c: 0 } }, {}, { ETH: { A: 1 } }, undefined, accepts2, { ETH: { A: 1 }, TOK: { A: 2 } }, { ETH: { c: 1 }, TOK: { c: 2 } }, { ETH: { c: 0 }, TOK: { c: 0 } }, {}, { ETH: { A: 1 }, TOK: { A: 2 } }, undefined)('$description', function (_a) {
        var description = _a.description, outcomeShortHand = _a.outcomeShortHand, heldBefore = _a.heldBefore, heldAfter = _a.heldAfter, newOutcome = _a.newOutcome, payouts = _a.payouts, reasonString = _a.reasonString;
        return __awaiter(void 0, void 0, void 0, function () {
            var channel, channelId, support, appData, whoSignedWhat, numStates, largestTurnNum, initialChannelStorageHash, outcome, states, i, _b, sigs, tx, receipt, blockTimestamp, expectedChannelStorageHash, _c, logs, events, expectedEvents_1;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        channel = { chainId: chainId, participants: participants, channelNonce: channelNonce };
                        channelId = channel_1.getChannelId(channel);
                        addresses.c = channelId;
                        support = oneState;
                        appData = support.appData, whoSignedWhat = support.whoSignedWhat;
                        numStates = appData.length;
                        largestTurnNum = turnNumRecord + 1;
                        initialChannelStorageHash = ethers_1.ethers.constants.HashZero;
                        _d = [
                            heldBefore,
                            outcomeShortHand,
                            newOutcome,
                            heldAfter,
                            payouts,
                        ].map(function (object) { return test_helpers_1.replaceAddressesAndBigNumberify(object, addresses); }), heldBefore = _d[0], outcomeShortHand = _d[1], newOutcome = _d[2], heldAfter = _d[3], payouts = _d[4];
                        test_helpers_1.resetMultipleHoldings(heldBefore, [AssetHolder1, AssetHolder2]);
                        outcome = test_helpers_1.computeOutcome(outcomeShortHand);
                        states = [];
                        for (i = 1; i <= numStates; i++) {
                            states.push({
                                isFinal: true,
                                channel: channel,
                                outcome: outcome,
                                appDefinition: appDefinition,
                                appData: appData[i - 1],
                                challengeDuration: challengeDuration,
                                turnNum: largestTurnNum + i - numStates,
                            });
                        }
                        return [4, NitroAdjudicator.setChannelStorageHash(channelId, initialChannelStorageHash)];
                    case 1: return [4, (_e.sent()).wait()];
                    case 2:
                        _e.sent();
                        _b = expect;
                        return [4, NitroAdjudicator.channelStorageHashes(channelId)];
                    case 3:
                        _b.apply(void 0, [_e.sent()]).toEqual(initialChannelStorageHash);
                        return [4, src_1.signStates(states, wallets, whoSignedWhat)];
                    case 4:
                        sigs = _e.sent();
                        tx = NitroAdjudicator.concludePushOutcomeAndTransferAll.apply(NitroAdjudicator, __spreadArrays(nitro_adjudicator_1.concludePushOutcomeAndTransferAllArgs(states, sigs, whoSignedWhat), [{ gasLimit: 3000000 }]));
                        if (!reasonString) return [3, 6];
                        return [4, devtools_1.expectRevert(function () { return tx; }, reasonString)];
                    case 5:
                        _e.sent();
                        return [3, 14];
                    case 6: return [4, tx];
                    case 7: return [4, (_e.sent()).wait()];
                    case 8:
                        receipt = _e.sent();
                        return [4, test_helpers_1.writeGasConsumption('./concludePushOutcomeAndTransferAll.gas.md', description, receipt.gasUsed)];
                    case 9:
                        _e.sent();
                        return [4, provider.getBlock(receipt.blockNumber)];
                    case 10:
                        blockTimestamp = (_e.sent()).timestamp;
                        expectedChannelStorageHash = channel_storage_1.channelDataToChannelStorageHash({
                            turnNumRecord: 0,
                            finalizesAt: blockTimestamp,
                            outcome: outcome,
                        });
                        _c = expect;
                        return [4, NitroAdjudicator.channelStorageHashes(channelId)];
                    case 11:
                        _c.apply(void 0, [_e.sent()]).toEqual(expectedChannelStorageHash);
                        return [4, tx];
                    case 12: return [4, (_e.sent()).wait()];
                    case 13:
                        logs = (_e.sent()).logs;
                        events = test_helpers_1.compileEventsFromLogs(logs, [AssetHolder1, AssetHolder2, NitroAdjudicator]);
                        expectedEvents_1 = [];
                        expectedEvents_1.push({
                            contract: NitroAdjudicator.address,
                            name: 'Concluded',
                            args: { channelId: channelId },
                        });
                        Object.keys(payouts).forEach(function (assetHolder) {
                            expectedEvents_1 = expectedEvents_1.concat(test_helpers_1.assetTransferredEventsFromPayouts(channelId, payouts[assetHolder], assetHolder));
                        });
                        expect(events).toMatchObject(expectedEvents_1);
                        test_helpers_1.checkMultipleHoldings(heldAfter, [AssetHolder1, AssetHolder2]);
                        test_helpers_1.checkMultipleAssetOutcomeHashes(channelId, newOutcome, [AssetHolder1, AssetHolder2]);
                        _e.label = 14;
                    case 14: return [2];
                }
            });
        });
    });
});
var templateObject_1;
//# sourceMappingURL=concludePushOutcomeAndTransferAll.test.js.map