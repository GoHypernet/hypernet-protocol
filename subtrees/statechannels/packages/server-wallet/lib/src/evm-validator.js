"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_core_1 = require("@statechannels/wallet-core");
const nitro_protocol_1 = require("@statechannels/nitro-protocol");
const PureEVM = __importStar(require("pure-evm"));
const ethers_1 = require("ethers");
const app_bytecode_1 = require("./models/app-bytecode");
const logger_1 = require("./logger");
const config_1 = require("./config");
const MISSING = '0x';
const bytecodeCache = {};
exports.validateTransitionWithEVM = async (from, to, tx) => {
    var _a;
    if (from.appDefinition !== to.appDefinition) {
        logger_1.logger.error('Invalid transition', {
            error: new Error('States are using different appDefinitions'),
        });
        return false;
    }
    const bytecode = (_a = bytecodeCache[from.appDefinition], (_a !== null && _a !== void 0 ? _a : (bytecodeCache[from.appDefinition] =
        (await app_bytecode_1.AppBytecode.getBytecode(config_1.defaultConfig.chainNetworkID, from.appDefinition, tx)) ||
            MISSING)));
    if (bytecode === MISSING) {
        return true;
    }
    const { data } = nitro_protocol_1.createValidTransitionTransaction(wallet_core_1.toNitroState(from), wallet_core_1.toNitroState(to));
    const result = PureEVM.exec(Uint8Array.from(Buffer.from(bytecode.substr(2), 'hex')), Uint8Array.from(Buffer.from(data ? data.toString().substr(2) : '0x00', 'hex')));
    return result.length === 32 && ethers_1.utils.defaultAbiCoder.decode(['bool'], result)[0];
};
//# sourceMappingURL=evm-validator.js.map