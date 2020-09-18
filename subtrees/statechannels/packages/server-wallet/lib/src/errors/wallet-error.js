"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WalletError extends Error {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
    }
}
exports.WalletError = WalletError;
WalletError.errors = {
    ChannelError: 'ChannelError',
    JoinChannelError: 'JoinChannelError',
    CloseChannelError: 'CloseChannelError',
    UpdateChannelError: 'UpdateChannelError',
    NonceError: 'NonceError',
    StoreError: 'StoreError',
    OnchainError: 'OnchainError',
};
function hasOwnProperty(obj, prop) {
    return obj.hasOwnProperty(prop);
}
function isWalletError(error) {
    var _a;
    if (!((_a = error) === null || _a === void 0 ? void 0 : _a.type))
        return false;
    if (!(typeof error.type === 'string' || error.type instanceof String))
        return false;
    return hasOwnProperty(WalletError.errors, error.type);
}
exports.isWalletError = isWalletError;
//# sourceMappingURL=wallet-error.js.map