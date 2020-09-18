"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const ethers_1 = require("ethers");
const participants_1 = require("./participants");
const utils_1 = require("./utils");
const defaultVars = {
    appData: '0x0abc',
    participants: [participants_1.alice(), participants_1.bob()],
    appDefinition: ethers_1.constants.AddressZero,
    fundingStrategy: 'Direct',
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
exports.createChannelArgs = utils_1.fixture(defaultVars);
//# sourceMappingURL=create-channel.js.map