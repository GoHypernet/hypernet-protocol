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
var AddressZero = ethers_1.ethers.constants.AddressZero;
var TestErc20AssetHolder_json_1 = __importDefault(require("../../../build/contracts/TestErc20AssetHolder.json"));
var Token_json_1 = __importDefault(require("../../../build/contracts/Token.json"));
var channel_1 = require("../../../src/contract/channel");
var test_helpers_1 = require("../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var signer0 = provider.getSigner(0);
var signer0Address;
var ERC20AssetHolder;
var Token;
var chainId = '0x1234';
var participants = [];
for (var i = 0; i < 3; i++) {
    participants[i] = ethers_1.Wallet.createRandom({ extraEntropy: ethers_1.utils.id('erc20-deposit-test') }).address;
}
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, test_helpers_1.setupContracts(provider, TestErc20AssetHolder_json_1.default, process.env.TEST_TOKEN_ASSET_HOLDER_ADDRESS)];
            case 1:
                ERC20AssetHolder = _a.sent();
                return [4, test_helpers_1.setupContracts(provider, Token_json_1.default, process.env.TEST_TOKEN_ADDRESS)];
            case 2:
                Token = _a.sent();
                return [4, signer0.getAddress()];
            case 3:
                signer0Address = _a.sent();
                return [2];
        }
    });
}); });
var description0 = 'Deposits Tokens (expectedHeld = 0)';
var description1 = 'Reverts deposit of Tokens (expectedHeld > holdings)';
var description2 = 'Reverts deposit of Tokens (expectedHeld + amount < holdings)';
var description3 = 'Deposits Tokens (amount < holdings < amount + expectedHeld)';
describe('deposit', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    description     | channelNonce | held | expectedHeld | amount | heldAfter | reasonString\n    ", " | ", "         | ", " | ", "         | ", "   | ", "      | ", "\n    ", " | ", "         | ", " | ", "         | ", "   | ", "      | ", "\n    ", " | ", "         | ", " | ", "         | ", "   | ", "      | ", "\n    ", " | ", "         | ", " | ", "         | ", "   | ", "      | ", "\n  "], ["\n    description     | channelNonce | held | expectedHeld | amount | heldAfter | reasonString\n    ", " | ", "         | ", " | ", "         | ", "   | ", "      | ", "\n    ", " | ", "         | ", " | ", "         | ", "   | ", "      | ", "\n    ", " | ", "         | ", " | ", "         | ", "   | ", "      | ", "\n    ", " | ", "         | ", " | ", "         | ", "   | ", "      | ", "\n  "])), description0, 0, 0, 0, 1, 1, undefined, description1, 1, 0, 1, 2, 0, 'Deposit | holdings[destination] is less than expected', description2, 2, 3, 1, 1, 3, 'Deposit | holdings[destination] already meets or exceeds expectedHeld + amount', description3, 3, 3, 2, 2, 4, undefined)('$description', function (_a) {
        var channelNonce = _a.channelNonce, held = _a.held, expectedHeld = _a.expectedHeld, amount = _a.amount, reasonString = _a.reasonString, heldAfter = _a.heldAfter;
        return __awaiter(void 0, void 0, void 0, function () {
            var destinationChannel, destination, balance, allowance, _b, _c, events, _d, amountTransferred, balanceBefore, _e, _f, tx, events, depositedEvent, amountTransferred, allocatedAmount, balanceAfter, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        held = ethers_1.BigNumber.from(held);
                        expectedHeld = ethers_1.BigNumber.from(expectedHeld);
                        amount = ethers_1.BigNumber.from(amount);
                        heldAfter = ethers_1.BigNumber.from(heldAfter);
                        destinationChannel = { chainId: chainId, channelNonce: channelNonce, participants: participants };
                        destination = channel_1.getChannelId(destinationChannel);
                        return [4, Token.balanceOf(signer0Address)];
                    case 1:
                        balance = _j.sent();
                        return [4, expect(balance.gte(held.add(amount))).toBe(true)];
                    case 2:
                        _j.sent();
                        return [4, Token.increaseAllowance(ERC20AssetHolder.address, held.add(amount))];
                    case 3: return [4, (_j.sent()).wait()];
                    case 4:
                        _j.sent();
                        _c = (_b = ethers_1.BigNumber).from;
                        return [4, Token.allowance(signer0Address, ERC20AssetHolder.address)];
                    case 5:
                        allowance = _c.apply(_b, [_j.sent()]);
                        expect(allowance
                            .sub(amount)
                            .sub(held)
                            .gte(0)).toBe(true);
                        if (!(held > 0)) return [3, 9];
                        return [4, ERC20AssetHolder.deposit(destination, 0, held)];
                    case 6: return [4, (_j.sent()).wait()];
                    case 7:
                        events = (_j.sent()).events;
                        _d = expect;
                        return [4, ERC20AssetHolder.holdings(destination)];
                    case 8:
                        _d.apply(void 0, [_j.sent()]).toEqual(held);
                        amountTransferred = getTransferEvent(events).data;
                        expect(held.eq(amountTransferred)).toBe(true);
                        _j.label = 9;
                    case 9:
                        _f = (_e = ethers_1.BigNumber).from;
                        return [4, Token.balanceOf(signer0Address)];
                    case 10:
                        balanceBefore = _f.apply(_e, [_j.sent()]);
                        tx = ERC20AssetHolder.deposit(destination, expectedHeld, amount);
                        if (!reasonString) return [3, 12];
                        return [4, devtools_1.expectRevert(function () { return tx; }, reasonString)];
                    case 11:
                        _j.sent();
                        return [3, 18];
                    case 12: return [4, tx];
                    case 13: return [4, (_j.sent()).wait()];
                    case 14:
                        events = (_j.sent()).events;
                        depositedEvent = getDepositedEvent(events);
                        expect(depositedEvent).toMatchObject({
                            destination: destination,
                            amountDeposited: heldAfter.sub(held),
                            destinationHoldings: heldAfter,
                        });
                        amountTransferred = ethers_1.BigNumber.from(getTransferEvent(events).data);
                        expect(heldAfter.sub(held).eq(amountTransferred)).toBe(true);
                        return [4, ERC20AssetHolder.holdings(destination)];
                    case 15:
                        allocatedAmount = _j.sent();
                        return [4, expect(allocatedAmount).toEqual(heldAfter)];
                    case 16:
                        _j.sent();
                        _h = (_g = ethers_1.BigNumber).from;
                        return [4, Token.balanceOf(signer0Address)];
                    case 17:
                        balanceAfter = _h.apply(_g, [_j.sent()]);
                        expect(balanceAfter.eq(balanceBefore.sub(amountTransferred))).toBe(true);
                        _j.label = 18;
                    case 18: return [2];
                }
            });
        });
    });
});
var getDepositedEvent = function (events) { return events.find(function (_a) {
    var event = _a.event;
    return event === 'Deposited';
}).args; };
var getTransferEvent = function (events) {
    return events.find(function (_a) {
        var topics = _a.topics;
        return topics[0] === Token.filters.Transfer(AddressZero).topics[0];
    });
};
var templateObject_1;
//# sourceMappingURL=deposit.test.js.map