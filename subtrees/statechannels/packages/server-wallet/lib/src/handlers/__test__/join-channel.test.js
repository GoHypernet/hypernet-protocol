"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_either_1 = __importDefault(require("@pacote/jest-either"));
const Either_1 = require("fp-ts/lib/Either");
const join_channel_1 = require("../join-channel");
const join_channel_2 = require("../fixtures/join-channel");
const channel_state_1 = require("../../protocols/__test__/fixtures/channel-state");
const channel_1 = require("../../models/__test__/fixtures/channel");
const states_1 = require("../../wallet/__test__/fixtures/states");
const signing_wallets_1 = require("../../wallet/__test__/fixtures/signing-wallets");
expect.extend(jest_either_1.default);
const prefundVars = { turnNum: 0, appData: '0x0f00' };
const runningVars = { turnNum: 7, appData: '0x0f00' };
test.each `
  input                                                                        | result
  ${channel_1.channel({ vars: [states_1.stateSignedBy([signing_wallets_1.bob()])(prefundVars)] }).protocolState}      | ${{ type: 'SignState', ...prefundVars }}
  ${channel_state_1.channelStateFixture({ latest: prefundVars }, { latestSignedByMe: undefined })} | ${{ type: 'SignState', ...prefundVars }}
`('happy path', ({ input, result }) => {
    expect(join_channel_1.joinChannel(join_channel_2.joinChannelFixture(), input)).toMatchObject(Either_1.right(result));
});
test.each `
  row  | input                                                                            | result
  ${1} | ${channel_state_1.channelStateFixture({ latestSignedByMe: prefundVars })}                          | ${new Error('already signed prefund setup')}
  ${2} | ${channel_1.channel({ vars: [states_1.stateSignedBy([signing_wallets_1.alice()])(prefundVars)] }).protocolState}        | ${new Error('already signed prefund setup')}
  ${3} | ${channel_1.channel({ vars: [states_1.stateSignedBy([signing_wallets_1.alice(), signing_wallets_1.bob()])(prefundVars)] }).protocolState} | ${new Error('already signed prefund setup')}
  ${4} | ${channel_state_1.channelStateFixture({ latest: runningVars }, { latestSignedByMe: undefined })}     | ${new Error('latest state must be turn 0')}
`('error cases $row', ({ input, result }) => {
    expect(join_channel_1.joinChannel(join_channel_2.joinChannelFixture(), input)).toMatchObject(Either_1.left(result));
});
//# sourceMappingURL=join-channel.test.js.map