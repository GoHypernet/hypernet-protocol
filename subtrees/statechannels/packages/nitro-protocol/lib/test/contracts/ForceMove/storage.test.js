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
var TESTForceMove_json_1 = __importDefault(require("../../../build/contracts/TESTForceMove.json"));
var channel_storage_1 = require("../../../src/contract/channel-storage");
var test_helpers_1 = require("../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var ForceMove;
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
var zeroData = {
    stateHash: ethers_1.ethers.constants.HashZero,
    outcomeHash: ethers_1.ethers.constants.HashZero,
    challengerAddress: ethers_1.ethers.constants.AddressZero,
};
describe('storage', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    turnNumRecord | finalizesAt\n    ", "       | ", "\n    ", "     | ", "\n  "], ["\n    turnNumRecord | finalizesAt\n    ", "       | ", "\n    ", "     | ", "\n  "])), 0x42, 0x9001, 123456, 789)('Hashing and data retrieval', function (storage) { return __awaiter(void 0, void 0, void 0, function () {
        var blockchainStorage, blockchainHash, clientHash, expected, _a, _b, _c, turnNumRecord, finalizesAt, f;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    blockchainStorage = __assign(__assign({}, storage), zeroData);
                    return [4, ForceMove.hashChannelData(blockchainStorage)];
                case 1:
                    blockchainHash = _d.sent();
                    clientHash = channel_storage_1.channelDataToChannelStorageHash(storage);
                    expected = __assign(__assign({}, storage), { fingerprint: '0x' + clientHash.slice(2 + 24) });
                    expect(clientHash).toEqual(blockchainHash);
                    _a = expect;
                    return [4, ForceMove.matchesHash(blockchainStorage, blockchainHash)];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe(true);
                    _b = expect;
                    return [4, ForceMove.matchesHash(blockchainStorage, clientHash)];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toBe(true);
                    expect(channel_storage_1.parseChannelStorageHash(clientHash)).toMatchObject(expected);
                    return [4, ForceMove.setChannelStorage(ethers_1.ethers.constants.HashZero, blockchainStorage)];
                case 4: return [4, (_d.sent()).wait()];
                case 5:
                    _d.sent();
                    return [4, ForceMove.getChannelStorage(ethers_1.ethers.constants.HashZero)];
                case 6:
                    _c = _d.sent(), turnNumRecord = _c.turnNumRecord, finalizesAt = _c.finalizesAt, f = _c.fingerprint;
                    expect({ turnNumRecord: turnNumRecord, finalizesAt: finalizesAt, fingerprint: f._hex }).toMatchObject(expected);
                    return [2];
            }
        });
    }); });
});
describe('_requireChannelOpen', function () {
    var channelId;
    beforeEach(function () {
        channelId = test_helpers_1.randomChannelId();
    });
    it('works when the slot is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4, ForceMove.channelStorageHashes(channelId)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual(ethers_1.ethers.constants.HashZero);
                    return [4, ForceMove.requireChannelOpen(channelId)];
                case 2:
                    _b.sent();
                    return [2];
            }
        });
    }); });
    it.each(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    result       | turnNumRecord | finalizesAt\n    ", " | ", "         | ", "\n    ", " | ", "         | ", "\n    ", "   | ", "        | ", "\n    ", "   | ", "      | ", "\n    ", "   | ", "          | ", "\n    ", "   | ", "          | ", "\n  "], ["\n    result       | turnNumRecord | finalizesAt\n    ", " | ", "         | ", "\n    ", " | ", "         | ", "\n    ", "   | ", "        | ", "\n    ", "   | ", "      | ", "\n    ", "   | ", "          | ", "\n    ", "   | ", "          | ", "\n  "])), 'reverts', 42, 1e12, 'reverts', 42, 0x9001, 'works', 123, '0x00', 'works', 0xabc, '0x00', 'works', 1, '0x00', 'works', 0, '0x00')('$result with turnNumRecord: $turnNumRecord, finalizesAt: $finalizesAt', function (_a) {
        var turnNumRecord = _a.turnNumRecord, finalizesAt = _a.finalizesAt, result = _a.result;
        return __awaiter(void 0, void 0, void 0, function () {
            var blockchainStorage, _b, tx, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        blockchainStorage = __assign({ turnNumRecord: turnNumRecord, finalizesAt: finalizesAt }, zeroData);
                        return [4, ForceMove.setChannelStorage(channelId, blockchainStorage)];
                    case 1: return [4, (_d.sent()).wait()];
                    case 2:
                        _d.sent();
                        _b = expect;
                        return [4, ForceMove.channelStorageHashes(channelId)];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(channel_storage_1.channelDataToChannelStorageHash(blockchainStorage));
                        tx = ForceMove.requireChannelOpen(channelId);
                        if (!(result === 'reverts')) return [3, 5];
                        return [4, devtools_1.expectRevert(function () { return tx; }, 'Channel not open.')];
                    case 4:
                        _c = _d.sent();
                        return [3, 7];
                    case 5: return [4, tx];
                    case 6:
                        _c = _d.sent();
                        _d.label = 7;
                    case 7:
                        _c;
                        return [2];
                }
            });
        });
    });
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=storage.test.js.map