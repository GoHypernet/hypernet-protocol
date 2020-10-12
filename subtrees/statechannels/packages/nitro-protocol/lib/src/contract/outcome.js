"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var AssetOutcomeType;
(function (AssetOutcomeType) {
    AssetOutcomeType[AssetOutcomeType["AllocationOutcomeType"] = 0] = "AllocationOutcomeType";
    AssetOutcomeType[AssetOutcomeType["GuaranteeOutcomeType"] = 1] = "GuaranteeOutcomeType";
})(AssetOutcomeType = exports.AssetOutcomeType || (exports.AssetOutcomeType = {}));
function encodeGuarantee(guarantee) {
    return ethers_1.utils.defaultAbiCoder.encode(['tuple(bytes32 targetChannelId, bytes32[] destinations)'], [[guarantee.targetChannelId, guarantee.destinations]]);
}
exports.encodeGuarantee = encodeGuarantee;
function decodeGuarantee(encodedGuarantee) {
    var _a = ethers_1.utils.defaultAbiCoder.decode(['tuple(bytes32 targetChannelId, bytes32[] destinations)'], encodedGuarantee)[0], targetChannelId = _a.targetChannelId, destinations = _a.destinations;
    return { targetChannelId: targetChannelId, destinations: destinations };
}
exports.decodeGuarantee = decodeGuarantee;
function isGuarantee(allocationOrGuarantee) {
    return !isAllocation(allocationOrGuarantee);
}
exports.isGuarantee = isGuarantee;
function encodeAllocation(allocation) {
    return ethers_1.utils.defaultAbiCoder.encode(['tuple(bytes32 destination, uint256 amount)[]'], [allocation]);
}
exports.encodeAllocation = encodeAllocation;
function decodeAllocation(encodedAllocation) {
    var allocationItems = ethers_1.utils.defaultAbiCoder.decode(['tuple(bytes32 destination, uint256 amount)[]'], encodedAllocation)[0];
    return allocationItems.map(function (a) { return ({ destination: a.destination, amount: a.amount.toHexString() }); });
}
exports.decodeAllocation = decodeAllocation;
function isAllocation(allocationOrGuarantee) {
    return Array.isArray(allocationOrGuarantee);
}
exports.isAllocation = isAllocation;
function isGuaranteeOutcome(assetOutcome) {
    return 'guarantee' in assetOutcome;
}
exports.isGuaranteeOutcome = isGuaranteeOutcome;
function isAllocationOutcome(assetOutcome) {
    return 'allocationItems' in assetOutcome;
}
exports.isAllocationOutcome = isAllocationOutcome;
function encodeAssetOutcomeFromBytes(assetOutcomeType, encodedAllocationOrGuarantee) {
    return ethers_1.utils.defaultAbiCoder.encode(['tuple(uint8 assetOutcomeType, bytes allocationOrGuarantee)'], [{ assetOutcomeType: assetOutcomeType, allocationOrGuarantee: encodedAllocationOrGuarantee }]);
}
exports.encodeAssetOutcomeFromBytes = encodeAssetOutcomeFromBytes;
function decodeOutcomeItem(encodedAssetOutcome, assetHolderAddress) {
    var _a = ethers_1.utils.defaultAbiCoder.decode(['tuple(uint8 outcomeType, bytes allocationOrGuarantee)'], encodedAssetOutcome)[0], outcomeType = _a.outcomeType, allocationOrGuarantee = _a.allocationOrGuarantee;
    switch (outcomeType) {
        case AssetOutcomeType.AllocationOutcomeType:
            return { assetHolderAddress: assetHolderAddress, allocationItems: decodeAllocation(allocationOrGuarantee) };
        case AssetOutcomeType.GuaranteeOutcomeType:
            return { assetHolderAddress: assetHolderAddress, guarantee: decodeGuarantee(allocationOrGuarantee) };
        default:
            throw new Error("Received invalid outcome type " + outcomeType);
    }
}
exports.decodeOutcomeItem = decodeOutcomeItem;
function hashAssetOutcome(allocationOrGuarantee) {
    return ethers_1.utils.keccak256(encodeAssetOutcome(allocationOrGuarantee));
}
exports.hashAssetOutcome = hashAssetOutcome;
function encodeAssetOutcome(allocationOrGuarantee) {
    var encodedData;
    var outcomeType;
    if (isAllocation(allocationOrGuarantee)) {
        encodedData = encodeAllocation(allocationOrGuarantee);
        outcomeType = AssetOutcomeType.AllocationOutcomeType;
    }
    else {
        encodedData = encodeGuarantee(allocationOrGuarantee);
        outcomeType = AssetOutcomeType.GuaranteeOutcomeType;
    }
    return encodeAssetOutcomeFromBytes(outcomeType, encodedData);
}
exports.encodeAssetOutcome = encodeAssetOutcome;
function hashOutcome(outcome) {
    var encodedOutcome = encodeOutcome(outcome);
    return ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode(['bytes'], [encodedOutcome]));
}
exports.hashOutcome = hashOutcome;
function decodeOutcome(encodedOutcome) {
    var assetOutcomes = ethers_1.utils.defaultAbiCoder.decode(['tuple(address assetHolderAddress, bytes outcomeContent)[]'], encodedOutcome)[0];
    return assetOutcomes.map(function (a) { return decodeOutcomeItem(a.outcomeContent, a.assetHolderAddress); });
}
exports.decodeOutcome = decodeOutcome;
function encodeOutcome(outcome) {
    var encodedAssetOutcomes = outcome.map(function (o) {
        var encodedData;
        var outcomeType;
        if (isAllocationOutcome(o)) {
            encodedData = encodeAllocation(o.allocationItems);
            outcomeType = AssetOutcomeType.AllocationOutcomeType;
        }
        else {
            encodedData = encodeGuarantee(o.guarantee);
            outcomeType = AssetOutcomeType.GuaranteeOutcomeType;
        }
        return {
            assetHolderAddress: o.assetHolderAddress,
            outcomeContent: encodeAssetOutcomeFromBytes(outcomeType, encodedData),
        };
    });
    return ethers_1.utils.defaultAbiCoder.encode(['tuple(address assetHolderAddress, bytes outcomeContent)[]'], [encodedAssetOutcomes]);
}
exports.encodeOutcome = encodeOutcome;
//# sourceMappingURL=outcome.js.map