"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_either_1 = __importDefault(require("@pacote/jest-either"));
const close_channel_1 = require("../close-channel");
const actions_1 = require("../../protocols/__test__/fixtures/actions");
const channel_state_1 = require("../../protocols/__test__/fixtures/channel-state");
expect.extend(jest_either_1.default);
test('validClose', () => {
    const cs = channel_state_1.channelStateFixture();
    expect(close_channel_1.closeChannel(cs)).toMatchRight(actions_1.signStateFixture({ isFinal: true, turnNum: cs.supported.turnNum + 1 }));
});
const notMyTurnErr = new close_channel_1.CloseChannelError(close_channel_1.CloseChannelError.reasons.notMyTurn);
const noSupportedStateErr = new close_channel_1.CloseChannelError(close_channel_1.CloseChannelError.reasons.noSupportedState);
const noSupportedState = channel_state_1.channelStateFixture({}, { supported: undefined });
const evenTurnedSupportedState = channel_state_1.channelStateFixture({ supported: { turnNum: 4 } });
test.each `
  channelState                | error
  ${noSupportedState}         | ${noSupportedStateErr}
  ${evenTurnedSupportedState} | ${notMyTurnErr}
`('error cases $error', ({ channelState, error }) => {
    expect(close_channel_1.closeChannel(channelState)).toEqualLeft(error);
});
//# sourceMappingURL=close-channel.test.js.map