"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const lodash_1 = __importDefault(require("lodash"));
const participants_1 = require("./participants");
const utils_1 = require("./utils");
const defaultVars = {
    appData: '0x',
    isFinal: false,
    turnNum: 0,
    outcome: wallet_core_1.simpleEthAllocation([
        { destination: participants_1.alice().destination, amount: wallet_core_1.BN.from(1) },
        { destination: participants_1.bob().destination, amount: wallet_core_1.BN.from(3) },
    ]),
};
exports.stateVars = utils_1.fixture(defaultVars, utils_1.overwriteOutcome);
exports.stateVarsWithSignatures = utils_1.fixture(lodash_1.default.merge({ signatures: [] }, defaultVars), utils_1.overwriteOutcome);
//# sourceMappingURL=state-vars.js.map