"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@ethersproject/constants");
function getBool(val) {
    switch (val) {
        case undefined:
        case null:
        case 'null':
        case 'false':
        case 'FALSE':
        case '0':
            return false;
        default:
            return true;
    }
}
exports.GIT_VERSION = process.env.GIT_VERSION;
exports.NODE_ENV = process.env.NODE_ENV;
exports.CHAIN_NETWORK_ID = process.env.CHAIN_NETWORK_ID || '0';
exports.INFURA_API_KEY = process.env.INFURA_API_KEY;
exports.CLEAR_STORAGE_ON_START = getBool(process.env.CLEAR_STORAGE_ON_START);
exports.ETH_ASSET_HOLDER_ADDRESS = process.env.ETH_ASSET_HOLDER_ADDRESS || constants_1.AddressZero;
exports.HUB_PARTICIPANT_ID = 'firebase:simple-hub';
exports.HUB_ADDRESS = process.env.HUB_ADDRESS || '0xaaaa84838319627Fa056fC3FC29ab94d479B8502';
exports.HUB_DESTINATION = process.env.HUB_DESTINATION;
exports.LOG_DESTINATION = process.env.LOG_DESTINATION
    ? process.env.LOG_DESTINATION === 'console'
        ? 'console'
        : `${process.env.LOG_DESTINATION}/wallet.log`
    : undefined;
exports.NITRO_ADJUDICATOR_ADDRESS = process.env.NITRO_ADJUDICATOR_ADDRESS || constants_1.AddressZero;
exports.TRIVIAL_APP_ADDRESS = process.env.TRIVIAL_APP_ADDRESS || constants_1.AddressZero;
exports.USE_INDEXED_DB = getBool(process.env.USE_INDEXED_DB);
exports.CHALLENGE_DURATION = Number(process.env.CHALLENGE_DURATION || 300);
exports.JEST_WORKER_ID = process.env.JEST_WORKER_ID;
exports.ADD_LOGS = !!exports.LOG_DESTINATION;
exports.LOG_LEVEL = exports.ADD_LOGS
    ? process.env.LOG_LEVEL
        ? process.env.LOG_LEVEL
        : 'info'
    : 'silent';
exports.HUB = {
    destination: exports.HUB_DESTINATION,
    signingAddress: exports.HUB_ADDRESS,
    participantId: 'firebase:simple-hub'
};
exports.TARGET_NETWORK = process.env.TARGET_NETWORK || 'development';
exports.FAUCET_LINK = exports.TARGET_NETWORK === 'goerli' ? 'https://goerli-faucet.slock.it/' : 'https://faucet.ropsten.be/';
//# sourceMappingURL=config.js.map