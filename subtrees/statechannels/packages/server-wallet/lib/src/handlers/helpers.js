"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasStateSignedByMe = (cs) => !!cs.latestSignedByMe;
exports.hasSupportedState = (cs) => !!cs.supported;
exports.isMyTurn = (cs) => (cs.supported.turnNum + 1) % cs.supported.participants.length === cs.myIndex;
exports.latest = (cs) => cs.latest;
exports.supported = (cs) => cs.supported;
exports.latestSignedByMe = (cs) => cs.latestSignedByMe;
//# sourceMappingURL=helpers.js.map