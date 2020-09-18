"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const channel_1 = require("../../../models/__test__/fixtures/channel");
const participants_1 = require("./participants");
const utils_1 = require("./utils");
const defaultVars = {
    appData: '0x0abc',
    channelId: channel_1.channel().channelId,
    allocations: [
        {
            token: '0x00',
            allocationItems: [
                { destination: participants_1.alice().destination, amount: wallet_core_1.BN.from(1) },
                { destination: participants_1.bob().destination, amount: wallet_core_1.BN.from(3) },
            ],
        },
    ],
};
exports.updateChannelArgs = utils_1.fixture(defaultVars);
//# sourceMappingURL=update-channel.js.map