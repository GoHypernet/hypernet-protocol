"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_channel_1 = require("../../handlers/update-channel");
const wallet_error_1 = require("../wallet-error");
test('passes typeguard', () => {
    const updateChannelError = new update_channel_1.UpdateChannelError(update_channel_1.UpdateChannelError.reasons.channelNotFound);
    expect(wallet_error_1.isWalletError(updateChannelError)).toBeTruthy();
});
test('fails typeguard', () => {
    const fakeError = { type: 'bogusError' };
    expect(wallet_error_1.isWalletError(fakeError)).toBeFalsy();
});
//# sourceMappingURL=wallet-error.test.js.map