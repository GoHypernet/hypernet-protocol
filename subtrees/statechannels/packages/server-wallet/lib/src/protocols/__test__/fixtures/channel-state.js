"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const states_1 = require("../../../wallet/__test__/fixtures/states");
const utils_1 = require("../../../wallet/__test__/fixtures/utils");
const participants_1 = require("../../../wallet/__test__/fixtures/participants");
const defaultChannelState = {
    channelId: '0x1234',
    myIndex: 0,
    participants: [participants_1.alice(), participants_1.bob()],
    supported: states_1.stateWithHashSignedBy()({ turnNum: 3 }),
    latest: states_1.stateWithHashSignedBy()({ turnNum: 3 }),
    latestSignedByMe: states_1.stateWithHashSignedBy()({ turnNum: 3 }),
    funding: () => '0x00',
};
exports.channelStateFixture = utils_1.fixture(defaultChannelState);
//# sourceMappingURL=channel-state.js.map