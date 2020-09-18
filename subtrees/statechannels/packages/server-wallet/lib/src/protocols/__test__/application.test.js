"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const jest_either_1 = __importDefault(require("@pacote/jest-either"));
const application_1 = require("../application");
const participants_1 = require("../../wallet/__test__/fixtures/participants");
const application_protocol_state_1 = require("./fixtures/application-protocol-state");
expect.extend(jest_either_1.default);
const outcome = wallet_core_1.simpleEthAllocation([{ amount: wallet_core_1.BN.from(5), destination: participants_1.alice().destination }]);
const prefundState = { outcome, turnNum: 0 };
const postFundState = { outcome, turnNum: 3 };
const closingState = { outcome, turnNum: 4, isFinal: true };
const runningState = { outcome, turnNum: 7 };
const closingState2 = { outcome, turnNum: 8, isFinal: true };
const funded = () => wallet_core_1.BN.from(5);
const notFunded = () => wallet_core_1.BN.from(0);
const signState = (state) => ({ type: 'SignState', ...state });
test.each `
  supported        | latestSignedByMe | latest           | funding   | action                      | cond                                                                  | result
  ${prefundState}  | ${prefundState}  | ${prefundState}  | ${funded} | ${signState(postFundState)} | ${'when the prefund state is supported, and the channel is funded'}   | ${'signs the postfund state'}
  ${closingState}  | ${postFundState} | ${closingState}  | ${funded} | ${signState(closingState)}  | ${'when the postfund state is supported, and the channel is closing'} | ${'signs the final state'}
  ${closingState2} | ${runningState}  | ${closingState2} | ${funded} | ${signState(closingState2)} | ${'when the postfund state is supported, and the channel is closing'} | ${'signs the final state'}
`('$result $cond', ({ supported, latest, latestSignedByMe, funding, action }) => {
    const ps = application_protocol_state_1.applicationProtocolState({ app: { supported, latest, latestSignedByMe, funding } });
    expect(application_1.protocol(ps)).toMatchObject(action);
});
test.each `
  supported        | latestSignedByMe | latest           | funding      | cond
  ${undefined}     | ${prefundState}  | ${prefundState}  | ${funded}    | ${'when I have signed the prefund state, but it is not supported'}
  ${undefined}     | ${undefined}     | ${undefined}     | ${funded}    | ${'when there is no state'}
  ${prefundState}  | ${postFundState} | ${postFundState} | ${funded}    | ${'when the prefund state is supported, and I have signed the postfund state'}
  ${postFundState} | ${postFundState} | ${postFundState} | ${funded}    | ${'when the postfund state is supported'}
  ${closingState}  | ${closingState}  | ${closingState}  | ${funded}    | ${'when I have signed a final state'}
  ${prefundState}  | ${prefundState}  | ${prefundState}  | ${notFunded} | ${'when the prefund state is supported, and the channel is not funded'}
`('takes no action $cond', ({ supported, latest, latestSignedByMe, funding }) => {
    const ps = application_protocol_state_1.applicationProtocolState({ app: { supported, latest, latestSignedByMe, funding } });
    expect(application_1.protocol(ps)).toBeUndefined();
});
//# sourceMappingURL=application.test.js.map