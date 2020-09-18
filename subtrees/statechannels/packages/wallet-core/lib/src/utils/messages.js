"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function convertToParticipant(participant) {
    return Object.assign(Object.assign({}, participant), { destination: _1.makeDestination(participant.destination) });
}
exports.convertToParticipant = convertToParticipant;
//# sourceMappingURL=messages.js.map