"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var ethers_utils_1 = require("../ethers-utils");
function getDepositedEvent(eventResult) {
    var _a = ethers_utils_1.parseEventResult(eventResult), destination = _a.destination, amountDeposited = _a.amountDeposited, destinationHoldings = _a.destinationHoldings;
    return {
        destination: destination,
        amountDeposited: ethers_1.BigNumber.from(amountDeposited),
        destinationHoldings: ethers_1.BigNumber.from(destinationHoldings),
    };
}
exports.getDepositedEvent = getDepositedEvent;
function getAssetTransferredEvent(eventResult) {
    var _a = ethers_utils_1.parseEventResult(eventResult), channelId = _a.channelId, destination = _a.destination, amount = _a.amount;
    return {
        channelId: channelId,
        destination: destination,
        amount: ethers_1.BigNumber.from(amount),
    };
}
exports.getAssetTransferredEvent = getAssetTransferredEvent;
function convertBytes32ToAddress(bytes32) {
    var normalized = ethers_1.BigNumber.from(bytes32).toHexString();
    return ethers_1.utils.getAddress("0x" + normalized.slice(-40));
}
exports.convertBytes32ToAddress = convertBytes32ToAddress;
function convertAddressToBytes32(address) {
    var normalizedAddress = ethers_1.BigNumber.from(address).toHexString();
    if (normalizedAddress.length !== 42) {
        throw new Error("Address value is not right length. Expected length of 42 received length " + normalizedAddress.length + " instead.");
    }
    return ethers_1.utils.hexZeroPad(normalizedAddress, 32);
}
exports.convertAddressToBytes32 = convertAddressToBytes32;
//# sourceMappingURL=asset-holder.js.map