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
var ethers_1 = require("ethers");
var id = ethers_1.utils.id, keccak256 = ethers_1.utils.keccak256;
var TestEthAssetHolder_json_1 = __importDefault(require("../../../build/contracts/TestEthAssetHolder.json"));
var channel_1 = require("../../../src/contract/channel");
var test_helpers_1 = require("../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var AssetHolder;
var channelId;
var participants = ['', '', ''];
var wallets = new Array(3);
var chainId = '0x1234';
var channelNonce = 0x9999;
var outcomeContent = id('some outcome data');
for (var i = 0; i < 3; i++) {
    wallets[i] = ethers_1.Wallet.createRandom();
    participants[i] = wallets[i].address;
}
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, test_helpers_1.setupContracts(provider, TestEthAssetHolder_json_1.default, process.env.TEST_ETH_ASSET_HOLDER_ADDRESS)];
            case 1:
                AssetHolder = _a.sent();
                channel = { chainId: chainId, participants: participants, channelNonce: channelNonce };
                channelId = channel_1.getChannelId(channel);
                return [2];
        }
    });
}); });
describe('setOutcome', function () {
    it('Reverts when called directly from an EOA', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reasonString, regex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reasonString = 'Only the NitroAdjudicator is authorized';
                    regex = new RegExp('(' + 'VM Exception while processing transaction: revert ' + reasonString + ')');
                    return [4, expect(AssetHolder.setAssetOutcomeHash(channelId, keccak256(outcomeContent))).rejects.toThrow(regex)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=setOutcome.test.js.map