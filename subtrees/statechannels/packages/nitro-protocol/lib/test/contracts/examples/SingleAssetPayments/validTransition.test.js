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
var SingleAssetPayments_json_1 = __importDefault(require("../../../../build/contracts/SingleAssetPayments.json"));
var outcome_1 = require("../../../../src/contract/outcome");
var test_helpers_1 = require("../../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var singleAssetPayments;
var numParticipants = 3;
var addresses = {
    A: test_helpers_1.randomExternalDestination(),
    B: test_helpers_1.randomExternalDestination(),
    C: test_helpers_1.randomExternalDestination(),
};
var guarantee = {
    targetChannelId: HashZero,
    destinations: [addresses.A],
};
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, test_helpers_1.setupContracts(provider, SingleAssetPayments_json_1.default, process.env.SINGLE_ASSET_PAYMENT_ADDRESS)];
            case 1:
                singleAssetPayments = _a.sent();
                return [2];
        }
    });
}); });
describe('validTransition', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    isValid  | numAssets | isAllocation      | balancesA             | turnNumB | balancesB             | description\n    ", "  | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", "  | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", "  | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", " | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", "   | ", " | ", "     | ", " | ", "\n  "], ["\n    isValid  | numAssets | isAllocation      | balancesA             | turnNumB | balancesB             | description\n    ", "  | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", "  | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", "  | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", " | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", "   | ", " | ", "     | ", " | ", "\n    ", " | ", " | ", "   | ", " | ", "     | ", " | ", "\n  "])), true, [1, 1], [true, true], { A: 1, B: 1, C: 1 }, 3, { A: 0, B: 2, C: 1 }, 'A pays B 1 wei', true, [1, 1], [true, true], { A: 1, B: 1, C: 1 }, 4, { A: 1, B: 0, C: 2 }, 'B pays C 1 wei', true, [1, 1], [true, true], { A: 1, B: 1, C: 1 }, 5, { A: 1, B: 2, C: 0 }, 'C pays B 1 wei', false, [1, 1], [true, true], { A: 1, B: 1, C: 1 }, 5, { A: 0, B: 2, C: 1 }, 'A pays B 1 wei (not their move)', false, [1, 1], [false, false], { A: 1, B: 1, C: 1 }, 3, { A: 1, B: 2, C: 1 }, 'Guarantee', false, [1, 1], [true, true], { A: 1, B: 1, C: 1 }, 3, { A: 1, B: 2, C: 1 }, 'Total amounts increase', false, [1, 1], [true, true], { A: 1, B: 1, C: 1 }, 3, { A: 2, B: 0, C: 1 }, 'A pays themself 1 wei', false, [2, 2], [true, true], { A: 1, B: 1, C: 1 }, 3, { A: 2, B: 0, C: 1 }, 'More than one asset')('$description', function (_a) {
        var isValid = _a.isValid, isAllocation = _a.isAllocation, numAssets = _a.numAssets, balancesA = _a.balancesA, turnNumB = _a.turnNumB, balancesB = _a.balancesB;
        return __awaiter(void 0, void 0, void 0, function () {
            var allocationA, outcomeA, variablePartA, allocationB, outcomeB, variablePartB, isValidFromCall;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        balancesA = test_helpers_1.replaceAddressesAndBigNumberify(balancesA, addresses);
                        allocationA = [];
                        Object.keys(balancesA).forEach(function (key) {
                            return allocationA.push({ destination: key, amount: balancesA[key] });
                        });
                        if (isAllocation[0]) {
                            outcomeA = [
                                { assetHolderAddress: ethers_1.ethers.constants.AddressZero, allocationItems: allocationA },
                            ];
                        }
                        else {
                            outcomeA = [
                                {
                                    assetHolderAddress: ethers_1.ethers.constants.AddressZero,
                                    guarantee: guarantee,
                                },
                            ];
                        }
                        if (numAssets[0] === 2) {
                            outcomeA.push(outcomeA[0]);
                        }
                        variablePartA = {
                            outcome: outcome_1.encodeOutcome(outcomeA),
                            appData: HashZero,
                        };
                        balancesB = test_helpers_1.replaceAddressesAndBigNumberify(balancesB, addresses);
                        allocationB = [];
                        Object.keys(balancesB).forEach(function (key) {
                            return allocationB.push({ destination: key, amount: balancesB[key] });
                        });
                        if (isAllocation[1]) {
                            outcomeB = [
                                { assetHolderAddress: ethers_1.ethers.constants.AddressZero, allocationItems: allocationB },
                            ];
                        }
                        else {
                            outcomeB = [{ assetHolderAddress: ethers_1.ethers.constants.AddressZero, guarantee: guarantee }];
                        }
                        if (numAssets[1] === 2) {
                            outcomeB.push(outcomeB[0]);
                        }
                        variablePartB = {
                            outcome: outcome_1.encodeOutcome(outcomeB),
                            appData: HashZero,
                        };
                        if (!isValid) return [3, 2];
                        return [4, singleAssetPayments.validTransition(variablePartA, variablePartB, turnNumB, numParticipants)];
                    case 1:
                        isValidFromCall = _b.sent();
                        expect(isValidFromCall).toBe(true);
                        return [3, 4];
                    case 2: return [4, devtools_1.expectRevert(function () {
                            return singleAssetPayments.validTransition(variablePartA, variablePartB, turnNumB, numParticipants);
                        })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2];
                }
            });
        });
    });
});
var templateObject_1;
//# sourceMappingURL=validTransition.test.js.map