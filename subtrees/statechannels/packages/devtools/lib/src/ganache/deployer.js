"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const etherlime_lib_1 = require("etherlime-lib");
const etherlime_utils_1 = require("etherlime-utils");
const logger_1 = require("./logger");
class GanacheDeployer {
    constructor(port, privateKey) {
        this.etherlimeDeployer = new etherlime_lib_1.EtherlimeGanacheDeployer(privateKey, port);
    }
    deploy(contract, libraries = {}, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployedContract = yield this.etherlimeDeployer.deploy(contract, libraries, ...args);
            logger_1.logger.info(`Contract ${contract.contractName} deployed to ganache: ${etherlime_utils_1.colors.colorAddress(deployedContract.contractAddress)}`);
            return deployedContract.contractAddress;
        });
    }
}
exports.GanacheDeployer = GanacheDeployer;
//# sourceMappingURL=deployer.js.map