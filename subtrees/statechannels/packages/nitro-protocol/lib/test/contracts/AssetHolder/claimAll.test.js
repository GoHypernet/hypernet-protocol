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
var asset_holder_1 = require("../../../src/contract/transaction-creators/asset-holder");
var test_helpers_1 = require("../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var addresses = {
    t: undefined,
    g: undefined,
    I: test_helpers_1.randomExternalDestination(),
    A: test_helpers_1.randomExternalDestination(),
    B: test_helpers_1.randomExternalDestination(),
};
var AssetHolder;
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, test_helpers_1.setupContracts(provider, TESTAssetHolder_json_1.default, process.env.TEST_ASSET_HOLDER_ADDRESS)];
            case 1:
                AssetHolder = _a.sent();
                return [2];
        }
    });
}); });
var reason5 = 'claimAll | submitted data does not match assetOutcomeHash stored against targetChannelId';
var reason6 = 'claimAll | submitted data does not match assetOutcomeHash stored against guarantorChannelId';
describe('claimAll', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    name                                               | heldBefore | guaranteeDestinations | tOutcomeBefore        | tOutcomeAfter   | heldAfter | payouts         | reason\n    ", " | ", "  | ", "    | ", " | ", " | ", " | ", "       | ", "\n    ", " | ", "  | ", "         | ", "       | ", "       | ", " | ", "       | ", "\n    ", " | ", "  | ", "    | ", " | ", " | ", " | ", "       | ", "\n    ", " | ", "  | ", "         | ", "       | ", "       | ", " | ", "       | ", "\n    ", "                    | ", "  | ", "         | ", "                 | ", "       | ", " | ", "       | ", "\n    ", "                     | ", "  | ", "                 | ", "       | ", "       | ", " | ", "       | ", "\n    ", " | ", " | ", "         | ", "       | ", "           | ", " | ", " | ", "\n    ", " | ", " | ", "              | ", "       | ", "           | ", " | ", " | ", "\n  "], ["\n    name                                               | heldBefore | guaranteeDestinations | tOutcomeBefore        | tOutcomeAfter   | heldAfter | payouts         | reason\n    ", " | ", "  | ", "    | ", " | ", " | ", " | ", "       | ", "\n    ", " | ", "  | ", "         | ", "       | ", "       | ", " | ", "       | ", "\n    ", " | ", "  | ", "    | ", " | ", " | ", " | ", "       | ", "\n    ", " | ", "  | ", "         | ", "       | ", "       | ", " | ", "       | ", "\n    ", "                    | ", "  | ", "         | ", "                 | ", "       | ", " | ", "       | ", "\n    ", "                     | ", "  | ", "                 | ", "       | ", "       | ", " | ", "       | ", "\n    ", " | ", " | ", "         | ", "       | ", "           | ", " | ", " | ", "\n    ", " | ", " | ", "              | ", "       | ", "           | ", " | ", " | ", "\n  "])), '1. straight-through guarantee, 3 destinations', { g: 5 }, ['I', 'A', 'B'], { I: 5, A: 5, B: 5 }, { A: 5, B: 5 }, { g: 0 }, { I: 5 }, undefined, '2. swap guarantee,             2 destinations', { g: 5 }, ['B', 'A'], { A: 5, B: 5 }, { A: 5 }, { g: 0 }, { B: 5 }, undefined, '3. swap guarantee,             3 destinations', { g: 5 }, ['I', 'B', 'A'], { I: 5, A: 5, B: 5 }, { A: 5, B: 5 }, { g: 0 }, { I: 5 }, undefined, '4. straight-through guarantee, 2 destinations', { g: 5 }, ['A', 'B'], { A: 5, B: 5 }, { B: 5 }, { g: 0 }, { A: 5 }, undefined, '5. allocation not on chain', { g: 5 }, ['B', 'A'], {}, { A: 5 }, { g: 0 }, { B: 5 }, reason5, '6. guarantee not on chain', { g: 5 }, [], { A: 5, B: 5 }, { A: 5 }, { g: 0 }, { B: 5 }, reason6, '7. swap guarantee, overfunded, 2 destinations', { g: 12 }, ['B', 'A'], { A: 5, B: 5 }, {}, { g: 2 }, { A: 5, B: 5 }, undefined, '8. underspecified guarantee, overfunded      ', { g: 12 }, ['B'], { A: 5, B: 5 }, {}, { g: 2 }, { A: 5, B: 5 }, undefined)('$name', function (_a) {
        var name = _a.name, heldBefore = _a.heldBefore, guaranteeDestinations = _a.guaranteeDestinations, tOutcomeBefore = _a.tOutcomeBefore, tOutcomeAfter = _a.tOutcomeAfter, heldAfter = _a.heldAfter, payouts = _a.payouts, reason = _a.reason;
        return __awaiter(void 0, void 0, void 0, function () {
            var tNonce, gNonce, targetId, guarantorId, allocation, _b, outcomeHash, _c, guarantee, _d, gOutcomeContentHash, _e, tx, expectedEvents_1, logs, events, allocationAfter_1, _f, expectedNewOutcomeHash, _g;
            var _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        tNonce = ethers_1.BigNumber.from(ethers_1.utils.id(name))
                            .mask(30)
                            .toNumber();
                        gNonce = ethers_1.BigNumber.from(ethers_1.utils.id(name + 'g'))
                            .mask(30)
                            .toNumber();
                        targetId = test_helpers_1.randomChannelId(tNonce);
                        guarantorId = test_helpers_1.randomChannelId(gNonce);
                        addresses.t = targetId;
                        addresses.g = guarantorId;
                        _h = [
                            heldBefore,
                            tOutcomeBefore,
                            tOutcomeAfter,
                            heldAfter,
                            payouts,
                        ].map(function (object) { return test_helpers_1.replaceAddressesAndBigNumberify(object, addresses); }), heldBefore = _h[0], tOutcomeBefore = _h[1], tOutcomeAfter = _h[2], heldAfter = _h[3], payouts = _h[4];
                        guaranteeDestinations = guaranteeDestinations.map(function (x) { return addresses[x]; });
                        new Set(__spreadArrays(Object.keys(heldAfter), Object.keys(heldBefore))).forEach(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                            var amount, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        amount = heldBefore[key] ? heldBefore[key] : ethers_1.BigNumber.from(0);
                                        return [4, AssetHolder.setHoldings(key, amount)];
                                    case 1: return [4, (_b.sent()).wait()];
                                    case 2:
                                        _b.sent();
                                        _a = expect;
                                        return [4, AssetHolder.holdings(key)];
                                    case 3:
                                        _a.apply(void 0, [(_b.sent()).eq(amount)]).toBe(true);
                                        return [2];
                                }
                            });
                        }); });
                        allocation = [];
                        Object.keys(tOutcomeBefore).forEach(function (key) {
                            return allocation.push({ destination: key, amount: tOutcomeBefore[key] });
                        });
                        _b = test_helpers_1.allocationToParams(allocation), outcomeHash = _b[1];
                        return [4, AssetHolder.setAssetOutcomeHashPermissionless(targetId, outcomeHash)];
                    case 1: return [4, (_j.sent()).wait()];
                    case 2:
                        _j.sent();
                        _c = expect;
                        return [4, AssetHolder.assetOutcomeHashes(targetId)];
                    case 3:
                        _c.apply(void 0, [_j.sent()]).toBe(outcomeHash);
                        guarantee = {
                            destinations: guaranteeDestinations,
                            targetChannelId: targetId,
                        };
                        if (!(guaranteeDestinations.length > 0)) return [3, 7];
                        _d = test_helpers_1.guaranteeToParams(guarantee), gOutcomeContentHash = _d[1];
                        return [4, AssetHolder.setAssetOutcomeHashPermissionless(guarantorId, gOutcomeContentHash)];
                    case 4: return [4, (_j.sent()).wait()];
                    case 5:
                        _j.sent();
                        _e = expect;
                        return [4, AssetHolder.assetOutcomeHashes(guarantorId)];
                    case 6:
                        _e.apply(void 0, [_j.sent()]).toBe(gOutcomeContentHash);
                        _j.label = 7;
                    case 7:
                        tx = AssetHolder.claimAll.apply(AssetHolder, asset_holder_1.claimAllArgs(guarantorId, guarantee, allocation));
                        if (!reason) return [3, 9];
                        return [4, devtools_1.expectRevert(function () { return tx; }, reason)];
                    case 8:
                        _j.sent();
                        return [3, 13];
                    case 9:
                        expectedEvents_1 = [];
                        Object.keys(payouts).forEach(function (assetHolder) {
                            expectedEvents_1 = test_helpers_1.assetTransferredEventsFromPayouts(guarantorId, payouts, AssetHolder.address);
                        });
                        return [4, tx];
                    case 10: return [4, (_j.sent()).wait()];
                    case 11:
                        logs = (_j.sent()).logs;
                        events = test_helpers_1.compileEventsFromLogs(logs, [AssetHolder]);
                        expect(events).toMatchObject(expectedEvents_1);
                        Object.keys(heldAfter).forEach(function (key) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = expect;
                                    return [4, AssetHolder.holdings(key)];
                                case 1: return [2, _a.apply(void 0, [_b.sent()]).toEqual(heldAfter[key])];
                            }
                        }); }); });
                        allocationAfter_1 = [];
                        Object.keys(tOutcomeAfter).forEach(function (key) {
                            allocationAfter_1.push({ destination: key, amount: tOutcomeAfter[key] });
                        });
                        _f = test_helpers_1.allocationToParams(allocationAfter_1), expectedNewOutcomeHash = _f[1];
                        _g = expect;
                        return [4, AssetHolder.assetOutcomeHashes(targetId)];
                    case 12:
                        _g.apply(void 0, [_j.sent()]).toEqual(expectedNewOutcomeHash);
                        _j.label = 13;
                    case 13: return [2];
                }
            });
        });
    });
});
var templateObject_1;
//# sourceMappingURL=claimAll.test.js.map