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
var TESTAssetHolder_json_1 = __importDefault(require("../../../build/contracts/TESTAssetHolder.json"));
var TESTAssetHolder2_json_1 = __importDefault(require("../../../build/contracts/TESTAssetHolder2.json"));
var TESTNitroAdjudicator_json_1 = __importDefault(require("../../../build/contracts/TESTNitroAdjudicator.json"));
var channel_1 = require("../../../src/contract/channel");
var outcome_1 = require("../../../src/contract/outcome");
var state_1 = require("../../../src/contract/state");
var test_helpers_1 = require("../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var NitroAdjudicator;
var AssetHolder1;
var AssetHolder2;
var addresses = {
    c: undefined,
    C: test_helpers_1.randomChannelId(),
    X: test_helpers_1.randomChannelId(),
    A: test_helpers_1.randomExternalDestination(),
    B: test_helpers_1.randomExternalDestination(),
    ETH: undefined,
    TOK: undefined,
};
var chainId = '0x1234';
var participants = ['', '', ''];
var wallets = new Array(3);
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
                return [2];
        }
    });
}); });
var description2 = 'NitroAdjudicator accepts a pushOutcomeAndTransferAll tx for a finalized channel, and 2x Asset types transferred';
var channelNonce = 1101;
var storedTurnNumRecord = 5;
var declaredTurnNumRecord = storedTurnNumRecord;
var finalized = true;
describe('pushOutcomeAndTransferAll', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    description     | setOutcome                    | heldBefore                    | newOutcome | heldAfter                     | payouts                       | reasonString\n    ", " | ", " | ", " | ", "      | ", " | ", " | ", "\n  "], ["\n    description     | setOutcome                    | heldBefore                    | newOutcome | heldAfter                     | payouts                       | reasonString\n    ", " | ", " | ", " | ", "      | ", " | ", " | ", "\n  "])), description2, { ETH: { A: 1 }, TOK: { A: 2 } }, { ETH: { c: 1 }, TOK: { c: 2 } }, {}, { ETH: { c: 0 }, TOK: { c: 0 } }, { ETH: { A: 1 }, TOK: { A: 2 } }, undefined)('$description', function (_a) {
        var setOutcome = _a.setOutcome, heldBefore = _a.heldBefore, newOutcome = _a.newOutcome, heldAfter = _a.heldAfter, payouts = _a.payouts, reasonString = _a.reasonString;
        return __awaiter(void 0, void 0, void 0, function () {
            var channel, channelId, finalizesAt, outcome, state, challengerAddress, initialChannelStorageHash, tx0, _b, stateHash, encodedOutcome, tx1, regex, logs, events, expectedEvents_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        channel = { chainId: chainId, channelNonce: channelNonce, participants: participants };
                        channelId = channel_1.getChannelId(channel);
                        addresses.c = channelId;
                        finalizesAt = finalized ? 1 : 1e12;
                        _c = [
                            heldBefore,
                            setOutcome,
                            newOutcome,
                            heldAfter,
                            payouts,
                        ].map(function (object) { return test_helpers_1.replaceAddressesAndBigNumberify(object, addresses); }), heldBefore = _c[0], setOutcome = _c[1], newOutcome = _c[2], heldAfter = _c[3], payouts = _c[4];
                        test_helpers_1.resetMultipleHoldings(heldBefore, [AssetHolder1, AssetHolder2]);
                        outcome = test_helpers_1.computeOutcome(setOutcome);
                        state = {
                            turnNum: 0,
                            isFinal: false,
                            channel: channel,
                            outcome: outcome,
                            appDefinition: ethers_1.ethers.constants.AddressZero,
                            appData: '0x00',
                            challengeDuration: 0x1,
                        };
                        challengerAddress = participants[state.turnNum % participants.length];
                        initialChannelStorageHash = test_helpers_1.finalizedOutcomeHash(storedTurnNumRecord, finalizesAt, outcome, state, challengerAddress);
                        return [4, NitroAdjudicator.setChannelStorageHash(channelId, initialChannelStorageHash)];
                    case 1:
                        tx0 = _d.sent();
                        return [4, tx0.wait()];
                    case 2:
                        _d.sent();
                        _b = expect;
                        return [4, NitroAdjudicator.channelStorageHashes(channelId)];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(initialChannelStorageHash);
                        stateHash = state_1.hashState(state);
                        encodedOutcome = outcome_1.encodeOutcome(outcome);
                        tx1 = NitroAdjudicator.pushOutcomeAndTransferAll(channelId, declaredTurnNumRecord, finalizesAt, stateHash, challengerAddress, encodedOutcome, { gasLimit: 300000 });
                        if (!reasonString) return [3, 5];
                        regex = new RegExp('^' + 'VM Exception while processing transaction: revert ' + reasonString + '$');
                        return [4, devtools_1.expectRevert(function () { return tx1; }, regex)];
                    case 4:
                        _d.sent();
                        return [3, 8];
                    case 5: return [4, tx1];
                    case 6: return [4, (_d.sent()).wait()];
                    case 7:
                        logs = (_d.sent()).logs;
                        events = test_helpers_1.compileEventsFromLogs(logs, [AssetHolder1, AssetHolder2, NitroAdjudicator]);
                        expectedEvents_1 = [];
                        Object.keys(payouts).forEach(function (assetHolder) {
                            expectedEvents_1 = expectedEvents_1.concat(test_helpers_1.assetTransferredEventsFromPayouts(channelId, payouts[assetHolder], assetHolder));
                        });
                        expect(events).toMatchObject(expectedEvents_1);
                        test_helpers_1.checkMultipleHoldings(heldAfter, [AssetHolder1, AssetHolder2]);
                        test_helpers_1.checkMultipleAssetOutcomeHashes(channelId, newOutcome, [AssetHolder1, AssetHolder2]);
                        _d.label = 8;
                    case 8: return [2];
                }
            });
        });
    });
});
var templateObject_1;
//# sourceMappingURL=pushOutcomeAndTransferAll.test.js.map