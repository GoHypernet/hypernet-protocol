"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("fp-ts/lib/Either");
const function_1 = require("fp-ts/lib/function");
const wallet_error_1 = require("../errors/wallet-error");
class JoinChannelError extends wallet_error_1.WalletError {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
        this.type = wallet_error_1.WalletError.errors.JoinChannelError;
    }
}
exports.JoinChannelError = JoinChannelError;
JoinChannelError.reasons = {
    channelNotFound: 'channel not found',
    invalidTurnNum: 'latest state must be turn 0',
    alreadySignedByMe: 'already signed prefund setup',
};
const hasStateSignedByMe = (cs) => !!cs.latestSignedByMe;
const ensureNotSignedByMe = (cs) => hasStateSignedByMe(cs)
    ? Either_1.left(new JoinChannelError(JoinChannelError.reasons.alreadySignedByMe))
    : Either_1.right(cs);
function ensureLatestStateIsPrefundSetup(cs) {
    if (cs.latest.turnNum === 0)
        return Either_1.right(cs);
    return Either_1.left(new JoinChannelError(JoinChannelError.reasons.invalidTurnNum));
}
function latest(cs) {
    return cs.latest;
}
function joinChannel(args, channelState) {
    const signStateAction = (sv) => ({
        type: 'SignState',
        channelId: args.channelId,
        ...sv,
    });
    return function_1.pipe(channelState, ensureNotSignedByMe, Either_1.chain(ensureLatestStateIsPrefundSetup), Either_1.map(latest), Either_1.map(signStateAction));
}
exports.joinChannel = joinChannel;
//# sourceMappingURL=join-channel.js.map