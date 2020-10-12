"use strict";
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
var fs_1 = __importDefault(require("fs"));
var ethers_1 = require("ethers");
var channel_storage_1 = require("../src/contract/channel-storage");
var outcome_1 = require("../src/contract/outcome");
exports.getTestProvider = function () {
    if (!process.env.GANACHE_PORT) {
        throw new Error('Missing environment variable GANACHE_PORT required');
    }
    return new ethers_1.ethers.providers.JsonRpcProvider("http://localhost:" + process.env.GANACHE_PORT);
};
function setupContracts(provider, artifact, address) {
    return __awaiter(this, void 0, void 0, function () {
        var signer, contract;
        return __generator(this, function (_a) {
            signer = provider.getSigner(0);
            contract = new ethers_1.ethers.Contract(address, artifact.abi, signer);
            return [2, contract];
        });
    });
}
exports.setupContracts = setupContracts;
function getPlaceHolderContractAddress() {
    return process.env.COUNTING_APP_ADDRESS;
}
exports.getPlaceHolderContractAddress = getPlaceHolderContractAddress;
exports.nonParticipant = ethers_1.ethers.Wallet.createRandom();
exports.clearedChallengeHash = function (turnNumRecord) {
    if (turnNumRecord === void 0) { turnNumRecord = 5; }
    return channel_storage_1.channelDataToChannelStorageHash({
        turnNumRecord: turnNumRecord,
        finalizesAt: 0,
    });
};
exports.ongoingChallengeHash = function (turnNumRecord) {
    if (turnNumRecord === void 0) { turnNumRecord = 5; }
    return channel_storage_1.channelDataToChannelStorageHash({
        turnNumRecord: turnNumRecord,
        finalizesAt: 1e12,
        challengerAddress: ethers_1.constants.AddressZero,
        outcome: [],
    });
};
exports.finalizedOutcomeHash = function (turnNumRecord, finalizesAt, outcome, state, challengerAddress) {
    if (turnNumRecord === void 0) { turnNumRecord = 5; }
    if (finalizesAt === void 0) { finalizesAt = 1; }
    if (outcome === void 0) { outcome = []; }
    if (state === void 0) { state = undefined; }
    if (challengerAddress === void 0) { challengerAddress = undefined; }
    return channel_storage_1.channelDataToChannelStorageHash({
        turnNumRecord: turnNumRecord,
        finalizesAt: finalizesAt,
        outcome: outcome,
        state: state,
        challengerAddress: challengerAddress,
    });
};
exports.newChallengeRegisteredEvent = function (contract, channelId) {
    var filter = contract.filters.ChallengeRegistered(channelId);
    return new Promise(function (resolve, reject) {
        contract.on(filter, function (eventChannelIdArg, eventTurnNumRecordArg, eventFinalizesAtArg, eventChallengerArg, eventIsFinalArg, eventFixedPartArg, eventChallengeVariablePartArg, event) {
            contract.removeAllListeners(filter);
            resolve([
                eventChannelIdArg,
                eventTurnNumRecordArg,
                eventFinalizesAtArg,
                eventChallengerArg,
                eventIsFinalArg,
                eventFixedPartArg,
                eventChallengeVariablePartArg,
            ]);
        });
    });
};
exports.newChallengeClearedEvent = function (contract, channelId) {
    var filter = contract.filters.ChallengeCleared(channelId);
    return new Promise(function (resolve, reject) {
        contract.on(filter, function (eventChannelId, eventTurnNumRecord, event) {
            contract.removeAllListeners(filter);
            resolve([eventChannelId, eventTurnNumRecord]);
        });
    });
};
exports.newConcludedEvent = function (contract, channelId) {
    var filter = contract.filters.Concluded(channelId);
    return new Promise(function (resolve, reject) {
        contract.on(filter, function (eventChannelId, event) {
            contract.removeAllListeners(filter);
            resolve([channelId]);
        });
    });
};
exports.newDepositedEvent = function (contract, destination) {
    var filter = contract.filters.Deposited(destination);
    return new Promise(function (resolve, reject) {
        contract.on(filter, function (eventDestination, amountDeposited, amountHeld, event) {
            contract.removeAllListeners(filter);
            resolve([eventDestination, amountDeposited, amountHeld]);
        });
    });
};
exports.newTransferEvent = function (contract, to) {
    var filter = contract.filters.Transfer(null, to);
    return new Promise(function (resolve, reject) {
        contract.on(filter, function (eventFrom, eventTo, amountTransferred, event) {
            contract.removeAllListeners(filter);
            resolve(amountTransferred);
        });
    });
};
exports.newAssetTransferredEvent = function (destination, payout) { return ({
    destination: destination.toLowerCase(),
    amount: payout,
}); };
function randomChannelId(channelNonce) {
    if (channelNonce === void 0) { channelNonce = 0; }
    var participants = [];
    for (var i = 0; i < 3; i++) {
        participants[i] = ethers_1.ethers.Wallet.createRandom().address;
    }
    var channelId = ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode(['uint256', 'address[]', 'uint256'], [1234, participants, channelNonce]));
    return channelId;
}
exports.randomChannelId = randomChannelId;
exports.randomExternalDestination = function () {
    return '0x' +
        ethers_1.ethers.Wallet.createRandom()
            .address.slice(2, 42)
            .padStart(64, '0')
            .toLowerCase();
};
function sendTransaction(provider, contractAddress, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var signer, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signer = provider.getSigner();
                    return [4, signer.sendTransaction(__assign({ to: contractAddress }, transaction))];
                case 1:
                    response = _a.sent();
                    return [4, response.wait()];
                case 2: return [2, _a.sent()];
            }
        });
    });
}
exports.sendTransaction = sendTransaction;
function allocationToParams(allocation) {
    var allocationBytes = outcome_1.encodeAllocation(allocation);
    var assetOutcomeHash;
    if (allocation.length === 0) {
        assetOutcomeHash = ethers_1.constants.HashZero;
    }
    else {
        assetOutcomeHash = outcome_1.hashAssetOutcome(allocation);
    }
    return [allocationBytes, assetOutcomeHash];
}
exports.allocationToParams = allocationToParams;
function guaranteeToParams(guarantee) {
    var guaranteeBytes = outcome_1.encodeGuarantee(guarantee);
    var assetOutcomeHash = outcome_1.hashAssetOutcome(guarantee);
    return [guaranteeBytes, assetOutcomeHash];
}
exports.guaranteeToParams = guaranteeToParams;
function replaceAddressesAndBigNumberify(object, addresses) {
    var newObject = {};
    Object.keys(object).forEach(function (key) {
        if (typeof object[key] === 'object') {
            newObject[addresses[key]] = replaceAddressesAndBigNumberify(object[key], addresses);
        }
        if (typeof object[key] === 'number') {
            newObject[addresses[key]] = ethers_1.BigNumber.from(object[key]);
        }
    });
    return newObject;
}
exports.replaceAddressesAndBigNumberify = replaceAddressesAndBigNumberify;
function resetMultipleHoldings(multipleHoldings, contractsArray) {
    var _this = this;
    Object.keys(multipleHoldings).forEach(function (assetHolder) {
        var holdings = multipleHoldings[assetHolder];
        Object.keys(holdings).forEach(function (destination) { return __awaiter(_this, void 0, void 0, function () {
            var amount;
            var _this = this;
            return __generator(this, function (_a) {
                amount = holdings[destination];
                contractsArray.forEach(function (contract) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(contract.address === assetHolder)) return [3, 4];
                                return [4, contract.setHoldings(destination, amount)];
                            case 1: return [4, (_b.sent()).wait()];
                            case 2:
                                _b.sent();
                                _a = expect;
                                return [4, contract.holdings(destination)];
                            case 3:
                                _a.apply(void 0, [(_b.sent()).eq(amount)]).toBe(true);
                                _b.label = 4;
                            case 4: return [2];
                        }
                    });
                }); });
                return [2];
            });
        }); });
    });
}
exports.resetMultipleHoldings = resetMultipleHoldings;
function checkMultipleHoldings(multipleHoldings, contractsArray) {
    var _this = this;
    Object.keys(multipleHoldings).forEach(function (assetHolder) {
        var holdings = multipleHoldings[assetHolder];
        Object.keys(holdings).forEach(function (destination) { return __awaiter(_this, void 0, void 0, function () {
            var amount;
            var _this = this;
            return __generator(this, function (_a) {
                amount = holdings[destination];
                contractsArray.forEach(function (contract) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(contract.address === assetHolder)) return [3, 2];
                                _a = expect;
                                return [4, contract.holdings(destination)];
                            case 1:
                                _a.apply(void 0, [(_b.sent()).eq(amount)]).toBe(true);
                                _b.label = 2;
                            case 2: return [2];
                        }
                    });
                }); });
                return [2];
            });
        }); });
    });
}
exports.checkMultipleHoldings = checkMultipleHoldings;
function checkMultipleAssetOutcomeHashes(channelId, outcome, contractsArray) {
    var _this = this;
    Object.keys(outcome).forEach(function (assetHolder) {
        var assetOutcome = outcome[assetHolder];
        var allocationAfter = [];
        Object.keys(assetOutcome).forEach(function (destination) {
            var amount = assetOutcome[destination];
            allocationAfter.push({ destination: destination, amount: amount });
        });
        var _a = allocationToParams(allocationAfter), expectedNewAssetOutcomeHash = _a[1];
        contractsArray.forEach(function (contract) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(contract.address === assetHolder)) return [3, 2];
                        _a = expect;
                        return [4, contract.assetOutcomeHashes(channelId)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(expectedNewAssetOutcomeHash);
                        _b.label = 2;
                    case 2: return [2];
                }
            });
        }); });
    });
}
exports.checkMultipleAssetOutcomeHashes = checkMultipleAssetOutcomeHashes;
function computeOutcome(outcomeShortHand) {
    var outcome = [];
    Object.keys(outcomeShortHand).forEach(function (assetHolder) {
        var allocation = [];
        Object.keys(outcomeShortHand[assetHolder]).forEach(function (destination) {
            return allocation.push({
                destination: destination,
                amount: ethers_1.BigNumber.from(outcomeShortHand[assetHolder][destination]).toHexString(),
            });
        });
        var assetOutcome = {
            assetHolderAddress: assetHolder,
            allocationItems: allocation,
        };
        outcome.push(assetOutcome);
    });
    return outcome;
}
exports.computeOutcome = computeOutcome;
function assetTransferredEventsFromPayouts(channelId, singleAssetPayouts, assetHolder) {
    var assetTransferredEvents = [];
    Object.keys(singleAssetPayouts).forEach(function (destination) {
        if (singleAssetPayouts[destination] && ethers_1.BigNumber.from(singleAssetPayouts[destination]).gt(0)) {
            assetTransferredEvents.push({
                contract: assetHolder,
                name: 'AssetTransferred',
                args: { channelId: channelId, destination: destination, amount: singleAssetPayouts[destination] },
            });
        }
    });
    return assetTransferredEvents;
}
exports.assetTransferredEventsFromPayouts = assetTransferredEventsFromPayouts;
function compileEventsFromLogs(logs, contractsArray) {
    var events = [];
    logs.forEach(function (log) {
        contractsArray.forEach(function (contract) {
            if (log.address === contract.address) {
                events.push(__assign(__assign({}, contract.interface.parseLog(log)), { contract: log.address }));
            }
        });
    });
    return events;
}
exports.compileEventsFromLogs = compileEventsFromLogs;
function writeGasConsumption(filename, description, gas) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fs_1.default.appendFile(filename, description + ':\n' + gas.toString() + ' gas\n\n', function (err) {
                        if (err)
                            throw err;
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.writeGasConsumption = writeGasConsumption;
//# sourceMappingURL=test-helpers.js.map