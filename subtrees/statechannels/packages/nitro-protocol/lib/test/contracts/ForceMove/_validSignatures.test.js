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
var ethers_1 = require("ethers");
var id = ethers_1.utils.id;
var TESTForceMove_json_1 = __importDefault(require("../../../build/contracts/TESTForceMove.json"));
var test_helpers_1 = require("../../test-helpers");
var signatures_1 = require("../../../src/signatures");
var provider = test_helpers_1.getTestProvider();
var ForceMove;
jest.setTimeout(10000);
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
describe('_validSignatures (participants sign only their own states)', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    nParticipants | largestTurnNum\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n  "], ["\n    nParticipants | largestTurnNum\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n  "])), 2, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 3, 2, 3, 3, 3, 4, 3, 5)('works for, largestTurnNum = $largestTurnNum, nParticipants = $nParticipants', function (_a) {
        var nParticipants = _a.nParticipants, largestTurnNum = _a.largestTurnNum;
        return __awaiter(void 0, void 0, void 0, function () {
            var nStates, addresses, sigs, stateHashes, whoSignedWhat, i, turnNum, i, wallet, offset, sig, _b, brokenSigs, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        nStates = nParticipants;
                        addresses = [];
                        sigs = [];
                        stateHashes = [];
                        whoSignedWhat = [];
                        for (i = 0; i < nStates; i++) {
                            turnNum = largestTurnNum - nStates + i;
                            stateHashes[i] = id('state-data' + turnNum);
                        }
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < nParticipants)) return [3, 4];
                        wallet = ethers_1.Wallet.createRandom();
                        addresses[i] = wallet.address;
                        offset = (largestTurnNum + nParticipants - i) % nParticipants;
                        whoSignedWhat[i] = nStates - 1 - offset;
                        return [4, signatures_1.sign(wallet, stateHashes[whoSignedWhat[i]])];
                    case 2:
                        sig = _d.sent();
                        sigs[i] = { v: sig.v, r: sig.r, s: sig.s };
                        _d.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4:
                        _b = expect;
                        return [4, ForceMove.validSignatures(largestTurnNum, addresses, stateHashes, sigs, whoSignedWhat)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true);
                        brokenSigs = sigs.reverse();
                        _c = expect;
                        return [4, ForceMove.validSignatures(largestTurnNum, addresses, stateHashes, brokenSigs, whoSignedWhat)];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(false);
                        return [2];
                }
            });
        });
    });
});
describe('_validSignatures (participants all sign a single state)', function () {
    it.each(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    nParticipants | largestTurnNum\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n  "], ["\n    nParticipants | largestTurnNum\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n    ", "          | ", "\n  "])), 2, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7)('works for, largestTurnNum = $largestTurnNum, nParticipants = $nParticipants', function (_a) {
        var nParticipants = _a.nParticipants, largestTurnNum = _a.largestTurnNum;
        return __awaiter(void 0, void 0, void 0, function () {
            var addresses, sigs, stateHashes, whoSignedWhat, i, wallet, sig, _b, brokenSigs, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        addresses = [];
                        sigs = [];
                        stateHashes = [id('state-data' + largestTurnNum)];
                        whoSignedWhat = [];
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < nParticipants)) return [3, 4];
                        wallet = ethers_1.Wallet.createRandom();
                        addresses[i] = wallet.address;
                        whoSignedWhat[i] = 0;
                        return [4, signatures_1.sign(wallet, stateHashes[whoSignedWhat[i]])];
                    case 2:
                        sig = _d.sent();
                        sigs[i] = { v: sig.v, r: sig.r, s: sig.s };
                        _d.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4:
                        _b = expect;
                        return [4, ForceMove.validSignatures(largestTurnNum, addresses, stateHashes, sigs, whoSignedWhat)];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(true);
                        brokenSigs = sigs.reverse();
                        _c = expect;
                        return [4, ForceMove.validSignatures(largestTurnNum, addresses, stateHashes, brokenSigs, whoSignedWhat)];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe(false);
                        return [2];
                }
            });
        });
    });
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=_validSignatures.test.js.map