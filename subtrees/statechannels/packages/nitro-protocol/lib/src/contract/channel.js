"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
function getChannelId(channel) {
    var chainId = channel.chainId, participants = channel.participants, channelNonce = channel.channelNonce;
    return ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode(['uint256', 'address[]', 'uint256'], [chainId, participants, channelNonce]));
}
exports.getChannelId = getChannelId;
//# sourceMappingURL=channel.js.map