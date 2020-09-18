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
var parseUnits = ethers_1.ethers.utils.parseUnits;
var TestEthAssetHolder_json_1 = __importDefault(require("../../../build/contracts/TestEthAssetHolder.json"));
var channel_1 = require("../../../src/contract/channel");
var test_helpers_1 = require("../../test-helpers");
var provider = test_helpers_1.getTestProvider();
var ETHAssetHolder;
var chainId = '0x1234';
var participants = [];
for (var i = 0; i < 3; i++) {
    participants[i] = ethers_1.Wallet.createRandom().address;
}
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, test_helpers_1.setupContracts(provider, TestEthAssetHolder_json_1.default, process.env.TEST_ETH_ASSET_HOLDER_ADDRESS)];
            case 1:
                ETHAssetHolder = _a.sent();
                return [2];
        }
    });
}); });
var description0 = 'Deposits ETH (msg.value = amount , expectedHeld = 0)';
var description1 = 'Reverts deposit of ETH (msg.value = amount, expectedHeld > holdings)';
var description2 = 'Deposits ETH (msg.value = amount, expectedHeld + amount < holdings)';
var description3 = 'Deposits ETH (msg.value = amount,  amount < holdings < amount + expectedHeld)';
describe('deposit', function () {
    it.each(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    description     | channelNonce | held   | expectedHeld | amount | msgValue | heldAfterString | reasonString\n    ", " | ", "         | ", " | ", "       | ", " | ", "   | ", "          | ", "\n    ", " | ", "         | ", " | ", "       | ", " | ", "   | ", "          | ", "\n    ", " | ", "         | ", " | ", "       | ", " | ", "   | ", "          | ", "\n    ", " | ", "         | ", " | ", "       | ", " | ", "   | ", "          | ", "\n  "], ["\n    description     | channelNonce | held   | expectedHeld | amount | msgValue | heldAfterString | reasonString\n    ", " | ", "         | ", " | ", "       | ", " | ", "   | ", "          | ", "\n    ", " | ", "         | ", " | ", "       | ", " | ", "   | ", "          | ", "\n    ", " | ", "         | ", " | ", "       | ", " | ", "   | ", "          | ", "\n    ", " | ", "         | ", " | ", "       | ", " | ", "   | ", "          | ", "\n  "])), description0, 0, '0', '0', '1', '1', '1', undefined, description1, 1, '0', '1', '2', '2', '0', 'Deposit | holdings[destination] is less than expected', description2, 2, '3', '1', '1', '1', '3', 'Deposit | holdings[destination] already meets or exceeds expectedHeld + amount', description3, 3, '3', '2', '2', '2', '4', undefined)('$description', function (_a) {
        var description = _a.description, channelNonce = _a.channelNonce, held = _a.held, expectedHeld = _a.expectedHeld, amount = _a.amount, msgValue = _a.msgValue, reasonString = _a.reasonString, heldAfterString = _a.heldAfterString;
        return __awaiter(void 0, void 0, void 0, function () {
            var heldAfter, destinationChannel, destination, tx0, events, depositedEvent, _b, tx, _c, gasUsed, events, event, allocatedAmount;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        held = parseUnits(held, 'wei');
                        expectedHeld = parseUnits(expectedHeld, 'wei');
                        amount = parseUnits(amount, 'wei');
                        msgValue = parseUnits(msgValue, 'wei');
                        heldAfter = parseUnits(heldAfterString, 'wei');
                        destinationChannel = { chainId: chainId, channelNonce: channelNonce, participants: participants };
                        destination = channel_1.getChannelId(destinationChannel);
                        if (!(held > 0)) return [3, 4];
                        tx0 = ETHAssetHolder.deposit(destination, '0x00', held, {
                            value: held,
                        });
                        return [4, tx0];
                    case 1: return [4, (_d.sent()).wait()];
                    case 2:
                        events = (_d.sent()).events;
                        depositedEvent = getDepositedEvent(events);
                        _b = expect;
                        return [4, ETHAssetHolder.holdings(destination)];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).toEqual(held);
                        expect(depositedEvent).toMatchObject({
                            destination: destination,
                            amountDeposited: ethers_1.BigNumber.from(held),
                            destinationHoldings: ethers_1.BigNumber.from(held),
                        });
                        _d.label = 4;
                    case 4:
                        tx = ETHAssetHolder.deposit(destination, expectedHeld, amount, {
                            value: msgValue,
                        });
                        if (!reasonString) return [3, 6];
                        return [4, devtools_1.expectRevert(function () { return tx; }, reasonString)];
                    case 5:
                        _d.sent();
                        return [3, 12];
                    case 6: return [4, tx];
                    case 7: return [4, (_d.sent()).wait()];
                    case 8:
                        _c = _d.sent(), gasUsed = _c.gasUsed, events = _c.events;
                        return [4, test_helpers_1.writeGasConsumption('./deposit.gas.md', description, gasUsed)];
                    case 9:
                        _d.sent();
                        event = getDepositedEvent(events);
                        expect(event).toMatchObject({
                            destination: destination,
                            amountDeposited: heldAfter.sub(held),
                            destinationHoldings: heldAfter,
                        });
                        return [4, ETHAssetHolder.holdings(destination)];
                    case 10:
                        allocatedAmount = _d.sent();
                        return [4, expect(allocatedAmount).toEqual(heldAfter)];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12: return [2];
                }
            });
        });
    });
});
var getDepositedEvent = function (events) { return events.find(function (_a) {
    var event = _a.event;
    return event === 'Deposited';
}).args; };
var templateObject_1;
//# sourceMappingURL=deposit.test.js.map