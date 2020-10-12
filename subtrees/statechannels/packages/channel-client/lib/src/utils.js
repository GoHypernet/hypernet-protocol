"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
/*
 This channel ID calculation revolves around `hashMessage` taking in a
 string but since the concat of the arguments are unique to each channel
 the channel ID should be different as a result.
*/
function calculateChannelId(participants, appDefinition) {
    let message = '';
    participants.forEach(p => (message += p.participantId));
    message += appDefinition;
    return ethers_1.utils.hashMessage(message);
}
exports.calculateChannelId = calculateChannelId;
//# sourceMappingURL=utils.js.map