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
var test_helpers_1 = require("../../test-helpers");
var outcome_1 = require("../../../src/contract/outcome");
var provider = test_helpers_1.getTestProvider();
var AssetHolder;
var addresses = {
    c: undefined,
    C: test_helpers_1.randomChannelId(),
    X: test_helpers_1.randomChannelId(),
    A: test_helpers_1.randomExternalDestination(),
    B: test_helpers_1.randomExternalDestination(),
};
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
var reason0 = 'transferAll | submitted data does not match stored assetOutcomeHash';
describe('transferAll', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    name                              | heldBefore | setOutcome      | newOutcome | heldAfter             | payouts         | reason\n    ", " | ", "  | ", "           | ", "      | ", "                 | ", "       | ", "\n    ", " | ", "  | ", "       | ", "      | ", "                 | ", "       | ", "\n    ", " | ", "  | ", "       | ", "      | ", "             | ", "       | ", "\n    ", " | ", "  | ", "       | ", "  | ", "                 | ", "       | ", "\n    ", " | ", "  | ", "       | ", "      | ", "       | ", "           | ", "\n    ", " | ", "  | ", "       | ", "      | ", "       | ", "           | ", "\n    ", " | ", "  | ", "       | ", "  | ", "       | ", "           | ", "\n    ", " | ", "  | ", " | ", "      | ", "             | ", " | ", "\n    ", " | ", "  | ", " | ", "  | ", "             | ", "       | ", "\n    ", " | ", "  | ", " | ", "  | ", "             | ", " | ", "\n    ", " | ", "  | ", " | ", "      | ", " | ", "           | ", "\n    ", " | ", "  | ", " | ", "  | ", " | ", "           | ", "\n    ", " | ", "  | ", " | ", "  | ", " | ", "           | ", "\n  "], ["\n    name                              | heldBefore | setOutcome      | newOutcome | heldAfter             | payouts         | reason\n    ", " | ", "  | ", "           | ", "      | ", "                 | ", "       | ", "\n    ", " | ", "  | ", "       | ", "      | ", "                 | ", "       | ", "\n    ", " | ", "  | ", "       | ", "      | ", "             | ", "       | ", "\n    ", " | ", "  | ", "       | ", "  | ", "                 | ", "       | ", "\n    ", " | ", "  | ", "       | ", "      | ", "       | ", "           | ", "\n    ", " | ", "  | ", "       | ", "      | ", "       | ", "           | ", "\n    ", " | ", "  | ", "       | ", "  | ", "       | ", "           | ", "\n    ", " | ", "  | ", " | ", "      | ", "             | ", " | ", "\n    ", " | ", "  | ", " | ", "  | ", "             | ", "       | ", "\n    ", " | ", "  | ", " | ", "  | ", "             | ", " | ", "\n    ", " | ", "  | ", " | ", "      | ", " | ", "           | ", "\n    ", " | ", "  | ", " | ", "  | ", " | ", "           | ", "\n    ", " | ", "  | ", " | ", "  | ", " | ", "           | ", "\n  "])), ' 0. outcome not set         ', { c: 1 }, {}, {}, {}, { A: 1 }, reason0, ' 1. funded          -> 1 EOA', { c: 1 }, { A: 1 }, {}, {}, { A: 1 }, undefined, ' 2. overfunded      -> 1 EOA', { c: 2 }, { A: 1 }, {}, { c: 1 }, { A: 1 }, undefined, ' 3. underfunded     -> 1 EOA', { c: 1 }, { A: 2 }, { A: 1 }, {}, { A: 1 }, undefined, ' 4. funded      -> 1 channel', { c: 1 }, { C: 1 }, {}, { c: 0, C: 1 }, {}, undefined, ' 5. overfunded  -> 1 channel', { c: 2 }, { C: 1 }, {}, { c: 1, C: 1 }, {}, undefined, ' 6. underfunded -> 1 channel', { c: 1 }, { C: 2 }, { C: 1 }, { c: 0, C: 1 }, {}, undefined, ' 7. -> 2 EOA       full/full', { c: 2 }, { A: 1, B: 1 }, {}, { c: 0 }, { A: 1, B: 1 }, undefined, ' 8. -> 2 EOA         full/no', { c: 1 }, { A: 1, B: 1 }, { B: 1 }, { c: 0 }, { A: 1 }, undefined, ' 9. -> 2 EOA    full/partial', { c: 3 }, { A: 2, B: 2 }, { B: 1 }, { c: 0 }, { A: 2, B: 1 }, undefined, '10. -> 2 chan      full/full', { c: 2 }, { C: 1, X: 1 }, {}, { c: 0, C: 1, X: 1 }, {}, undefined, '11. -> 2 chan        full/no', { c: 1 }, { C: 1, X: 1 }, { X: 1 }, { c: 0, C: 1, X: 0 }, {}, undefined, '12. -> 2 chan   full/partial', { c: 3 }, { C: 2, X: 2 }, { X: 1 }, { c: 0, C: 2, X: 1 }, {}, undefined)("$name: heldBefore: $heldBefore, setOutcome: $setOutcome, newOutcome: $newOutcome, heldAfter: $heldAfter, payouts: $payouts", function (_a) {
        var name = _a.name, heldBefore = _a.heldBefore, setOutcome = _a.setOutcome, newOutcome = _a.newOutcome, heldAfter = _a.heldAfter, payouts = _a.payouts, reason = _a.reason;
        return __awaiter(void 0, void 0, void 0, function () {
            var nonce, channelId, allocation, _b, assetOutcomeHash, _c, tx, events, expectedEvents_1, allocationAfter_1, _d, expectedNewOutcomeHash, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        nonce = ethers_1.BigNumber.from(ethers_1.utils.id(name))
                            .mask(30)
                            .toNumber();
                        channelId = test_helpers_1.randomChannelId(nonce);
                        addresses.c = channelId;
                        heldBefore = test_helpers_1.replaceAddressesAndBigNumberify(heldBefore, addresses);
                        setOutcome = test_helpers_1.replaceAddressesAndBigNumberify(setOutcome, addresses);
                        newOutcome = test_helpers_1.replaceAddressesAndBigNumberify(newOutcome, addresses);
                        heldAfter = test_helpers_1.replaceAddressesAndBigNumberify(heldAfter, addresses);
                        payouts = test_helpers_1.replaceAddressesAndBigNumberify(payouts, addresses);
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
                        Object.keys(setOutcome).forEach(function (key) {
                            return allocation.push({ destination: key, amount: setOutcome[key] });
                        });
                        _b = test_helpers_1.allocationToParams(allocation), assetOutcomeHash = _b[1];
                        return [4, AssetHolder.setAssetOutcomeHashPermissionless(channelId, assetOutcomeHash)];
                    case 1: return [4, (_f.sent()).wait()];
                    case 2:
                        _f.sent();
                        _c = expect;
                        return [4, AssetHolder.assetOutcomeHashes(channelId)];
                    case 3:
                        _c.apply(void 0, [_f.sent()]).toBe(assetOutcomeHash);
                        tx = AssetHolder.transferAll(channelId, outcome_1.encodeAllocation(allocation));
                        if (!reason) return [3, 5];
                        return [4, devtools_1.expectRevert(function () { return tx; }, reason)];
                    case 4:
                        _f.sent();
                        return [3, 9];
                    case 5: return [4, tx];
                    case 6: return [4, (_f.sent()).wait()];
                    case 7:
                        events = (_f.sent()).events;
                        expectedEvents_1 = [];
                        Object.keys(payouts).forEach(function (destination) {
                            if (payouts[destination] && payouts[destination].gt(0)) {
                                expectedEvents_1.push({
                                    event: 'AssetTransferred',
                                    args: { channelId: channelId, destination: destination, amount: payouts[destination] },
                                });
                            }
                        });
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
                        Object.keys(newOutcome).forEach(function (key) {
                            allocationAfter_1.push({ destination: key, amount: newOutcome[key] });
                        });
                        _d = test_helpers_1.allocationToParams(allocationAfter_1), expectedNewOutcomeHash = _d[1];
                        _e = expect;
                        return [4, AssetHolder.assetOutcomeHashes(channelId)];
                    case 8:
                        _e.apply(void 0, [_f.sent()]).toEqual(expectedNewOutcomeHash);
                        _f.label = 9;
                    case 9: return [2];
                }
            });
        });
    });
});
var templateObject_1;
//# sourceMappingURL=transferAll.test.js.map