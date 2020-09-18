"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("fp-ts/lib/Either");
const function_1 = require("fp-ts/lib/function");
const actions_1 = require("../protocols/actions");
const wallet_error_1 = require("../errors/wallet-error");
const helpers_1 = require("./helpers");
class CloseChannelError extends wallet_error_1.WalletError {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
        this.type = wallet_error_1.WalletError.errors.CloseChannelError;
    }
}
exports.CloseChannelError = CloseChannelError;
CloseChannelError.reasons = {
    noSupportedState: 'no supported state',
    notMyTurn: 'not my turn',
    channelMissing: 'channel not found',
};
const ensureSupportedStateExists = (cs) => helpers_1.hasSupportedState(cs)
    ? Either_1.right(cs)
    : Either_1.left(new CloseChannelError(CloseChannelError.reasons.noSupportedState));
function ensureItIsMyTurn(cs) {
    if (helpers_1.isMyTurn(cs))
        return Either_1.right(cs);
    return Either_1.left(new CloseChannelError(CloseChannelError.reasons.notMyTurn));
}
function closeChannel(channelState) {
    const { channelId } = channelState;
    const signStateAction = (sv) => actions_1.signState({ ...sv, channelId, isFinal: true, turnNum: sv.turnNum + 1 });
    return function_1.pipe(channelState, ensureSupportedStateExists, Either_1.chain(ensureItIsMyTurn), Either_1.map(helpers_1.supported), Either_1.map(signStateAction));
}
exports.closeChannel = closeChannel;
//# sourceMappingURL=close-channel.js.map