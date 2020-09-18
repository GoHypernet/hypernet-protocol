"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var channel_1 = require("./channel");
var outcome_1 = require("./outcome");
function getFixedPart(state) {
    var appDefinition = state.appDefinition, challengeDuration = state.challengeDuration, channel = state.channel;
    var chainId = channel.chainId, participants = channel.participants, channelNonce = channel.channelNonce;
    return { chainId: chainId, participants: participants, channelNonce: channelNonce, appDefinition: appDefinition, challengeDuration: challengeDuration };
}
exports.getFixedPart = getFixedPart;
function getVariablePart(state) {
    return { outcome: outcome_1.encodeOutcome(state.outcome), appData: state.appData };
}
exports.getVariablePart = getVariablePart;
function hashAppPart(state) {
    var challengeDuration = state.challengeDuration, appDefinition = state.appDefinition, appData = state.appData;
    return ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode(['uint256', 'address', 'bytes'], [challengeDuration, appDefinition, appData]));
}
exports.hashAppPart = hashAppPart;
function hashState(state) {
    var turnNum = state.turnNum, isFinal = state.isFinal;
    var channelId = channel_1.getChannelId(state.channel);
    var appPartHash = hashAppPart(state);
    var outcomeHash = outcome_1.hashOutcome(state.outcome);
    return ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode([
        'tuple(uint256 turnNum, bool isFinal, bytes32 channelId, bytes32 appPartHash, bytes32 outcomeHash)',
    ], [{ turnNum: turnNum, isFinal: isFinal, channelId: channelId, appPartHash: appPartHash, outcomeHash: outcomeHash }]));
}
exports.hashState = hashState;
//# sourceMappingURL=state.js.map