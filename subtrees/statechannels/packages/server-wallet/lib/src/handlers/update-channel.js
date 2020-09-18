"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("fp-ts/lib/Either");
const function_1 = require("fp-ts/lib/function");
const actions_1 = require("../protocols/actions");
const wallet_error_1 = require("../errors/wallet-error");
const helpers_1 = require("./helpers");
class UpdateChannelError extends wallet_error_1.WalletError {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
        this.type = wallet_error_1.WalletError.errors.UpdateChannelError;
    }
}
exports.UpdateChannelError = UpdateChannelError;
UpdateChannelError.reasons = {
    channelNotFound: 'channel not found',
    invalidLatestState: 'must have latest state',
    notInRunningStage: 'channel must be in running state',
    notMyTurn: 'it is not my turn',
};
const ensureSupportedStateExists = (cs) => helpers_1.hasSupportedState(cs)
    ? Either_1.right(cs)
    : Either_1.left(new UpdateChannelError(UpdateChannelError.reasons.invalidLatestState));
function ensureItIsMyTurn(cs) {
    if (helpers_1.isMyTurn(cs))
        return Either_1.right(cs);
    return Either_1.left(new UpdateChannelError(UpdateChannelError.reasons.notMyTurn));
}
function hasRunningTurnNumber(cs) {
    if (cs.supported.turnNum < 3)
        return Either_1.left(new UpdateChannelError(UpdateChannelError.reasons.notInRunningStage));
    return Either_1.right(cs);
}
const incrementTurnNumber = (args) => (cs) => ({
    ...args,
    turnNum: cs.supported.turnNum + 1,
    isFinal: false,
});
function updateChannel(args, channelState) {
    const signStateVars = (sv) => actions_1.signState({ ...sv, channelId: args.channelId });
    return function_1.pipe(channelState, ensureSupportedStateExists, Either_1.chain(hasRunningTurnNumber), Either_1.chain(ensureItIsMyTurn), Either_1.map(incrementTurnNumber(args)), Either_1.map(signStateVars));
}
exports.updateChannel = updateChannel;
//# sourceMappingURL=update-channel.js.map