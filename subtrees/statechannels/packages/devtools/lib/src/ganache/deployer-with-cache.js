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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const etherlime_utils_1 = require("etherlime-utils");
const writeJsonFile = require("write-json-file");
const lockfile_1 = __importDefault(require("lockfile"));
const deployer_1 = require("./deployer");
const logger_1 = require("./logger");
class KeyExistsError extends Error {
    constructor(key, address) {
        super(`Key already exists for contract ${key.name}!`);
        this.address = address;
    }
}
class GanacheNCacheDeployer {
    constructor(port, deploymentsPath, privateKey) {
        this.port = port;
        this.deploymentsPath = deploymentsPath;
        this.deployer = new deployer_1.GanacheDeployer(port, privateKey);
    }
    get etherlimeDeployer() {
        return this.deployer.etherlimeDeployer;
    }
    deploy(contract, libraries = {}, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contractName: name, bytecode } = contract;
            const lockPath = `${path.join(process.cwd(), process.env.GANACHE_CACHE_FOLDER || '', name)}.lock`;
            yield new Promise((resolve, reject) => lockfile_1.default.lock(lockPath, { wait: 300000 }, result => {
                !result ? resolve() : reject(result);
            }));
            const cacheKey = { name, libraries, bytecode, args };
            const existingAddress = this.addressFromCache(cacheKey);
            if (existingAddress) {
                logger_1.logger.info(`Contract ${etherlime_utils_1.colors.colorName(name)} already exists address: ${etherlime_utils_1.colors.colorAddress(existingAddress)}`);
                return existingAddress;
            }
            const contractAddress = yield this.deployer.deploy(contract, libraries, ...args);
            try {
                yield this.addToCache(cacheKey, contractAddress);
                return contractAddress;
            }
            catch (e) {
                if (e instanceof KeyExistsError) {
                    const conflictAddress = e.address;
                    logger_1.logger.warn(`Contract ${etherlime_utils_1.colors.colorName(name)} already exists at address: ${etherlime_utils_1.colors.colorAddress(conflictAddress)}. We also deployed it at ${etherlime_utils_1.colors.colorAddress(contractAddress)}, due to a race condition.`);
                    return conflictAddress;
                }
                else {
                    throw e;
                }
            }
            finally {
                yield new Promise((resolve, reject) => lockfile_1.default.unlock(lockPath, result => {
                    result ? reject(result) : resolve();
                }));
            }
        });
    }
    addToCache(key, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployments = this.loadDeployments();
            if (deployments) {
                const existingDeployment = this.findDeployment(deployments, key);
                if (existingDeployment) {
                    throw new KeyExistsError(key, existingDeployment.address);
                }
            }
            const newDeployment = Object.assign(Object.assign({}, key), { address });
            const newDeployments = deployments || [];
            newDeployments.push(newDeployment);
            const fileData = { deploymentsFileVersion: '0.1', deployments: newDeployments };
            yield writeJsonFile(this.deploymentsPath, fileData);
        });
    }
    findDeployment(deployments, key) {
        const { name, libraries, args, bytecode } = key;
        return deployments.find(deployment => {
            if (deployment.name !== name || deployment.bytecode !== bytecode) {
                return false;
            }
            if (deployment.args.length !== args.length) {
                return false;
            }
            for (let i = 0; i < args.length; i++) {
                if (deployment.args[i] !== args[i]) {
                    return false;
                }
            }
            let librariesMatch = true;
            for (const libraryName of Object.keys(deployment.libraries)) {
                librariesMatch =
                    librariesMatch && libraries[libraryName] === deployment.libraries[libraryName];
            }
            return librariesMatch;
        });
    }
    addressFromCache(key) {
        const deployments = this.loadDeployments();
        if (!deployments) {
            return undefined;
        }
        const existingDeployment = this.findDeployment(deployments, key);
        return existingDeployment && existingDeployment.address;
    }
    loadDeployments() {
        if (fs.existsSync(this.deploymentsPath)) {
            const raw = fs.readFileSync(this.deploymentsPath);
            const parsed = JSON.parse(raw.toString());
            if ('deploymentsFileVersion' in parsed && parsed.deploymentsFileVersion === '0.1') {
                return parsed.deployments;
            }
        }
        return undefined;
    }
}
exports.GanacheNCacheDeployer = GanacheNCacheDeployer;
//# sourceMappingURL=deployer-with-cache.js.map