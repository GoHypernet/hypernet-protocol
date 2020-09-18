"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var outcome_1 = require("./outcome");
var state_1 = require("./state");
var CHANNEL_DATA_TYPE = "tuple(\n  uint256 turnNumRecord,\n  uint256 finalizesAt,\n  bytes32 stateHash,\n  address challengerAddress,\n  bytes32 outcomeHash\n)";
var CHANNEL_DATA_LITE_TYPE = "tuple(\n  uint256 finalizesAt,\n  bytes32 stateHash,\n  address challengerAddress,\n  bytes32 outcomeHash\n)";
function channelDataToChannelStorageHash(channelData) {
    var turnNumRecord = channelData.turnNumRecord, finalizesAt = channelData.finalizesAt;
    var hash = ethers_1.utils.keccak256(encodeChannelData(channelData));
    var fingerprint = ethers_1.utils.hexDataSlice(hash, 12);
    var storage = '0x' +
        ethers_1.utils.hexZeroPad(ethers_1.utils.hexlify(turnNumRecord), 6).slice(2) +
        ethers_1.utils.hexZeroPad(ethers_1.utils.hexlify(finalizesAt), 6).slice(2) +
        fingerprint.slice(2);
    return storage;
}
exports.channelDataToChannelStorageHash = channelDataToChannelStorageHash;
function parseChannelStorageHash(channelStorageHash) {
    validateHexString(channelStorageHash);
    var cursor = 2;
    var turnNumRecord = '0x' + channelStorageHash.slice(cursor, (cursor += 12));
    var finalizesAt = '0x' + channelStorageHash.slice(cursor, (cursor += 12));
    var fingerprint = '0x' + channelStorageHash.slice(cursor);
    return {
        turnNumRecord: asNumber(turnNumRecord),
        finalizesAt: asNumber(finalizesAt),
        fingerprint: fingerprint,
    };
}
exports.parseChannelStorageHash = parseChannelStorageHash;
var asNumber = function (s) { return ethers_1.BigNumber.from(s).toNumber(); };
function channelDataStruct(_a) {
    var finalizesAt = _a.finalizesAt, state = _a.state, challengerAddress = _a.challengerAddress, turnNumRecord = _a.turnNumRecord, outcome = _a.outcome;
    var isOpen = finalizesAt === 0;
    if (isOpen && (outcome || state || challengerAddress)) {
        console.warn("Invalid open channel storage: " + JSON.stringify(outcome || state || challengerAddress));
    }
    var stateHash = isOpen || !state ? ethers_1.constants.HashZero : state_1.hashState(state);
    var outcomeHash = isOpen || !outcome ? ethers_1.constants.HashZero : outcome_1.hashOutcome(outcome);
    challengerAddress = challengerAddress || ethers_1.constants.AddressZero;
    return { turnNumRecord: turnNumRecord, finalizesAt: finalizesAt, stateHash: stateHash, challengerAddress: challengerAddress, outcomeHash: outcomeHash };
}
exports.channelDataStruct = channelDataStruct;
function encodeChannelData(data) {
    return ethers_1.utils.defaultAbiCoder.encode([CHANNEL_DATA_TYPE], [channelDataStruct(data)]);
}
exports.encodeChannelData = encodeChannelData;
function channelDataLiteStruct(_a) {
    var finalizesAt = _a.finalizesAt, challengerAddress = _a.challengerAddress, state = _a.state, outcome = _a.outcome;
    return {
        finalizesAt: finalizesAt,
        challengerAddress: challengerAddress,
        stateHash: state ? state_1.hashState(state) : ethers_1.constants.HashZero,
        outcomeHash: outcome ? outcome_1.hashOutcome(outcome) : ethers_1.constants.HashZero,
    };
}
exports.channelDataLiteStruct = channelDataLiteStruct;
function encodeChannelStorageLite(channelDataLite) {
    return ethers_1.utils.defaultAbiCoder.encode([CHANNEL_DATA_LITE_TYPE], [channelDataLiteStruct(channelDataLite)]);
}
exports.encodeChannelStorageLite = encodeChannelStorageLite;
function validateHexString(hexString) {
    if (!ethers_1.utils.isHexString(hexString)) {
        throw new Error("Not a hex string: " + hexString);
    }
    if (hexString.length !== 66) {
        throw new Error("Incorrect length: " + hexString.length);
    }
}
//# sourceMappingURL=channel-storage.js.map