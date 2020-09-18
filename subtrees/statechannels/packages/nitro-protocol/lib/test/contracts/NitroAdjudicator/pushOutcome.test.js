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
var TestErc20AssetHolder_json_1 = __importDefault(require("../../../build/contracts/TestErc20AssetHolder.json"));
var TestEthAssetHolder_json_1 = __importDefault(require("../../../build/contracts/TestEthAssetHolder.json"));
var TESTNitroAdjudicator_json_1 = __importDefault(require("../../../build/contracts/TESTNitroAdjudicator.json"));
var channel_1 = require("../../../src/contract/channel");
var outcome_1 = require("../../../src/contract/outcome");
var nitro_adjudicator_1 = require("../../../src/contract/transaction-creators/nitro-adjudicator");
var revert_reasons_1 = require("../../../src/contract/transaction-creators/revert-reasons");
var test_helpers_1 = require("../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var TestNitroAdjudicator;
var ETHAssetHolder;
var ERC20AssetHolder;
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
                TestNitroAdjudicator = _a.sent();
                return [4, test_helpers_1.setupContracts(provider, TestEthAssetHolder_json_1.default, process.env.TEST_ETH_ASSET_HOLDER_ADDRESS)];
            case 2:
                ETHAssetHolder = _a.sent();
                return [4, test_helpers_1.setupContracts(provider, TestErc20AssetHolder_json_1.default, process.env.TEST_TOKEN_ASSET_HOLDER_ADDRESS)];
            case 3:
                ERC20AssetHolder = _a.sent();
                return [2];
        }
    });
}); });
var description1 = 'TestNitroAdjudicator accepts a pushOutcome tx for a finalized channel, and 2x AssetHolder storage updated correctly';
var description2 = 'TestNitroAdjudicator rejects a pushOutcome tx for a not-finalized channel';
var description3 = 'TestNitroAdjudicator rejects a pushOutcome tx when declaredTurnNumRecord is incorrect';
var description4 = 'AssetHolders reject a setOutcome when outcomeHash already exists';
describe('pushOutcome', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    description     | channelNonce | storedTurnNumRecord | declaredTurnNumRecord | finalized | outcomeHashExits | reasonString\n    ", " | ", "      | ", "                | ", "                  | ", "   | ", "         | ", "\n    ", " | ", "      | ", "                | ", "                  | ", "  | ", "         | ", "\n    ", " | ", "      | ", "                | ", "                  | ", "   | ", "         | ", "\n    ", " | ", "      | ", "                | ", "                  | ", "   | ", "          | ", "\n  "], ["\n    description     | channelNonce | storedTurnNumRecord | declaredTurnNumRecord | finalized | outcomeHashExits | reasonString\n    ", " | ", "      | ", "                | ", "                  | ", "   | ", "         | ", "\n    ", " | ", "      | ", "                | ", "                  | ", "  | ", "         | ", "\n    ", " | ", "      | ", "                | ", "                  | ", "   | ", "         | ", "\n    ", " | ", "      | ", "                | ", "                  | ", "   | ", "          | ", "\n  "])), description1, 1101, 5, 5, true, false, undefined, description2, 1102, 5, 5, false, false, revert_reasons_1.CHANNEL_NOT_FINALIZED, description3, 1103, 4, 5, true, false, revert_reasons_1.WRONG_CHANNEL_STORAGE, description4, 1104, 5, 5, true, true, 'Outcome hash already exists')('$description', function (_a) {
        var channelNonce = _a.channelNonce, storedTurnNumRecord = _a.storedTurnNumRecord, declaredTurnNumRecord = _a.declaredTurnNumRecord, finalized = _a.finalized, outcomeHashExits = _a.outcomeHashExits, reasonString = _a.reasonString;
        return __awaiter(void 0, void 0, void 0, function () {
            var channel, channelId, finalizesAt, A, B, C, D, outcome, state, challengerAddress, initialChannelStorageHash, tx, _b, transactionRequest, regex, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        channel = { chainId: chainId, channelNonce: channelNonce, participants: participants };
                        channelId = channel_1.getChannelId(channel);
                        finalizesAt = finalized ? 1 : 1e12;
                        A = test_helpers_1.randomExternalDestination();
                        B = test_helpers_1.randomExternalDestination();
                        C = test_helpers_1.randomExternalDestination();
                        D = test_helpers_1.randomExternalDestination();
                        outcome = [
                            {
                                assetHolderAddress: ETHAssetHolder.address,
                                allocationItems: [
                                    { destination: A, amount: '1' },
                                    { destination: B, amount: '2' },
                                ],
                            },
                            {
                                assetHolderAddress: ERC20AssetHolder.address,
                                allocationItems: [
                                    { destination: C, amount: '3' },
                                    { destination: D, amount: '4' },
                                ],
                            },
                        ];
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
                        return [4, TestNitroAdjudicator.setChannelStorageHash(channelId, initialChannelStorageHash)];
                    case 1:
                        tx = _e.sent();
                        return [4, tx.wait()];
                    case 2:
                        _e.sent();
                        _b = expect;
                        return [4, TestNitroAdjudicator.channelStorageHashes(channelId)];
                    case 3:
                        _b.apply(void 0, [_e.sent()]).toEqual(initialChannelStorageHash);
                        transactionRequest = nitro_adjudicator_1.createPushOutcomeTransaction(declaredTurnNumRecord, finalizesAt, state, outcome);
                        if (!outcomeHashExits) return [3, 5];
                        return [4, test_helpers_1.sendTransaction(provider, TestNitroAdjudicator.address, transactionRequest)];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5:
                        if (!reasonString) return [3, 7];
                        regex = new RegExp('(' + 'VM Exception while processing transaction: revert ' + reasonString + ')');
                        return [4, devtools_1.expectRevert(function () { return test_helpers_1.sendTransaction(provider, TestNitroAdjudicator.address, transactionRequest); }, regex)];
                    case 6:
                        _e.sent();
                        return [3, 11];
                    case 7: return [4, test_helpers_1.sendTransaction(provider, TestNitroAdjudicator.address, transactionRequest)];
                    case 8:
                        _e.sent();
                        _c = expect;
                        return [4, ETHAssetHolder.assetOutcomeHashes(channelId)];
                    case 9:
                        _c.apply(void 0, [_e.sent()]).toEqual(outcome_1.hashAssetOutcome(outcome[0].allocationItems));
                        _d = expect;
                        return [4, ERC20AssetHolder.assetOutcomeHashes(channelId)];
                    case 10:
                        _d.apply(void 0, [_e.sent()]).toEqual(outcome_1.hashAssetOutcome(outcome[1].allocationItems));
                        _e.label = 11;
                    case 11: return [2];
                }
            });
        });
    });
});
var templateObject_1;
//# sourceMappingURL=pushOutcome.test.js.map