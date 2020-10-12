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
var test_helpers_1 = require("../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var ForceMove;
var participants = ['', '', ''];
var wallets = new Array(3);
for (var i = 0; i < 3; i++) {
    wallets[i] = ethers_1.Wallet.createRandom();
    participants[i] = wallets[i].address;
}
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
describe('_acceptableWhoSignedWhat (expect a boolean)', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    whoSignedWhat | largestTurnNum | nParticipants | nStates | expectedResult\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "          | ", "          | ", "    | ", "\n  "], ["\n    whoSignedWhat | largestTurnNum | nParticipants | nStates | expectedResult\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "           | ", "          | ", "    | ", "\n    ", "  | ", "          | ", "          | ", "    | ", "\n  "])), [0, 1, 2], 2, 3, 3, true, [0, 1, 2], 5, 3, 3, true, [0, 0, 1], 2, 3, 2, true, [0, 0, 0], 2, 3, 1, true, [0, 0, 0], 8, 3, 1, true, [0, 0, 2], 2, 3, 3, false, [0, 0, 2], 11, 3, 3, false)('returns $expectedResult for whoSignedWhat = $whoSignedWhat, largestTurnNum = $largestTurnNum, nParticipants = $nParticipants, nStates = $nStates', function (_a) {
        var whoSignedWhat = _a.whoSignedWhat, largestTurnNum = _a.largestTurnNum, nParticipants = _a.nParticipants, nStates = _a.nStates, expectedResult = _a.expectedResult;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = expect;
                        return [4, ForceMove.acceptableWhoSignedWhat(whoSignedWhat, largestTurnNum, nParticipants, nStates)];
                    case 1:
                        _b.apply(void 0, [_c.sent()]).toBe(expectedResult);
                        return [2];
                }
            });
        });
    });
});
describe('_acceptableWhoSignedWhat (expect revert)', function () {
    it.each(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    whoSignedWhat | largestTurnNum | nParticipants | nStates | reasonString\n    ", "     | ", "           | ", "          | ", "    | ", "\n  "], ["\n    whoSignedWhat | largestTurnNum | nParticipants | nStates | reasonString\n    ", "     | ", "           | ", "          | ", "    | ", "\n  "])), [0, 0], 2, 3, 1, '_validSignatures: whoSignedWhat must be the same length as participants')('reverts for whoSignedWhat = $whoSignedWhat, largestTurnNum = $largestTurnNum, nParticipants = $nParticipants, nStates = $nStates', function (_a) {
        var whoSignedWhat = _a.whoSignedWhat, largestTurnNum = _a.largestTurnNum, nParticipants = _a.nParticipants, nStates = _a.nStates, reasonString = _a.reasonString;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, devtools_1.expectRevert(function () {
                            return ForceMove.acceptableWhoSignedWhat(whoSignedWhat, largestTurnNum, nParticipants, nStates);
                        }, reasonString)];
                    case 1:
                        _b.sent();
                        return [2];
                }
            });
        });
    });
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=_acceptableWhoSignedWhat.test.js.map