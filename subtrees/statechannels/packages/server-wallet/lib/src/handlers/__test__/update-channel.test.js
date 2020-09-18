"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_either_1 = __importDefault(require("@pacote/jest-either"));
const update_channel_1 = require("../update-channel");
const update_channel_2 = require("../fixtures/update-channel");
const actions_1 = require("../../protocols/__test__/fixtures/actions");
const channel_state_1 = require("../../protocols/__test__/fixtures/channel-state");
expect.extend(jest_either_1.default);
test('validUpdate', () => {
    const result = update_channel_1.updateChannel(update_channel_2.updateChannelFixture(), channel_state_1.channelStateFixture());
    expect(result).toEqualRight(actions_1.signStateFixture());
});
const invalidLatest = new update_channel_1.UpdateChannelError(update_channel_1.UpdateChannelError.reasons.invalidLatestState);
const runningTurnNumber = new update_channel_1.UpdateChannelError(update_channel_1.UpdateChannelError.reasons.notInRunningStage);
const notMyTurn = new update_channel_1.UpdateChannelError(update_channel_1.UpdateChannelError.reasons.notMyTurn);
const noSupportedState = { ...channel_state_1.channelStateFixture(), supported: undefined };
test.each `
  updateChannelArgs         | channelState                                      | result
  ${update_channel_2.updateChannelFixture()} | ${noSupportedState}                               | ${invalidLatest}
  ${update_channel_2.updateChannelFixture()} | ${channel_state_1.channelStateFixture({ supported: { turnNum: 1 } })} | ${runningTurnNumber}
  ${update_channel_2.updateChannelFixture()} | ${channel_state_1.channelStateFixture({ supported: { turnNum: 4 } })} | ${notMyTurn}
`('error cases $result', ({ updateChannelArgs, channelState, result }) => {
    expect(update_channel_1.updateChannel(updateChannelArgs, channelState)).toEqualLeft(result);
});
//# sourceMappingURL=update-channel.test.js.map