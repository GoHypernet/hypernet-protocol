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
const chalk_1 = __importDefault(require("chalk"));
const writeJsonFile = require("write-json-file");
const ethers_1 = require("ethers");
const constants_1 = require("../constants");
const deployer_1 = require("./deployer");
const deployer_with_cache_1 = require("./deployer-with-cache");
const server_1 = require("./server");
exports.ganacheIsRunning = (port) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(`http://localhost:${port}`);
    try {
        yield provider.getBlockNumber();
        return true;
    }
    catch (e) {
        return false;
    }
});
const say = (msg) => console.log(chalk_1.default.cyan(msg));
const sayError = (msg) => console.log(chalk_1.default.red(msg));
function startOwnGanache(p = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const port = Number(p.port || process.env.GANACHE_PORT || 8545);
        const chainId = Number(p.chainId || process.env.CHAIN_NETWORK_ID || 9001);
        const accounts = p.accounts || constants_1.ETHERLIME_ACCOUNTS;
        const timeout = Number(p.timeout || process.env.GANACHE_TIMEOUT || 5000);
        const gasLimit = Number(p.gasLimit || process.env.GANACHE_GAS_LIMIT || 1000000000);
        const gasPrice = Number(p.gasPrice || process.env.GANACHE_GAS_PRICE || 1);
        const server = new server_1.GanacheServer(port, chainId, accounts, timeout, gasLimit, gasPrice);
        process.on('SIGINT', () => server && server.close());
        process.on('SIGTERM', () => server && server.close());
        process.on('uncaughtException', e => {
            server && server.close();
            throw e;
        });
        process.on('exit', () => server && server.close());
        process.on('unhandledRejection', () => server && server.close());
        say(`Starting a ganache server on http://localhost:${port}`);
        yield server.ready();
        return server;
    });
}
exports.setupGanache = (deployerAccountIndex) => __awaiter(void 0, void 0, void 0, function* () {
    const useShared = process.env.USE_GANACHE_DEPLOYMENT_CACHE === 'true';
    const port = Number(process.env.GANACHE_PORT || 8545);
    let server;
    let deployer;
    let type;
    if (useShared) {
        say(`The USE_GANACHE_DEPLOYMENT_CACHE option is set. Using ganache in shared mode with cached deployments. Port = ${port}.`);
        const cacheFolder = process.env.GANACHE_CACHE_FOLDER;
        if (!cacheFolder) {
            sayError("Didn't find a GANACHE_CACHE_FOLDER in the env. Without this you can't use a shared ganache instance with cache.");
            throw Error('Missing GANACHE_CACHE_FOLDER in env.');
        }
        const foundGanache = yield exports.ganacheIsRunning(port);
        if (!foundGanache) {
            sayError(`Didn't find a ganache instance at http://localhost:${port}. To use the deployments cache you must start ganache separately. Did you run 'yarn start:shared-ganache'?`);
            throw Error(`Ganache not running on port ${port}`);
        }
        say(`Found shared ganache instance running on http://localhost:${port}.`);
        const deploymentsFile = path.join(process.cwd(), cacheFolder, `ganache-deployments-${port}.json`);
        if (!fs.existsSync(deploymentsFile)) {
            sayError(`Didn't find the deployments cache at ${deploymentsFile}.`);
            say('This probably means that another package is running a regular ganache instance (without deployment cache) on this port.');
            say('This is bad because it will lead to confusing behaviour from an invalid deployment cache, if this regular ganache instance is restarted.');
            say('Please change the GANACHE_PORT environment variable in one of these packages, or run them both with USE_GANACHE_DEPLOYMENT_CACHE set.');
            throw Error(`Deployments cache doesn't exist`);
        }
        say(`Using the deployments cache at ${deploymentsFile}.`);
        deployerAccountIndex = Number(deployerAccountIndex);
        if (!Number.isFinite(deployerAccountIndex))
            throw new Error(`Invalid deployerAccountIndex ${deployerAccountIndex}`);
        if (deployerAccountIndex < 0 || deployerAccountIndex >= constants_1.ETHERLIME_ACCOUNTS.length)
            throw new Error(`deployerAccountIndex ${deployerAccountIndex} out of range [0,${constants_1.ETHERLIME_ACCOUNTS.length}]`);
        const deployerAccountKey = constants_1.ETHERLIME_ACCOUNTS[deployerAccountIndex].privateKey;
        type = 'shared';
        deployer = new deployer_with_cache_1.GanacheNCacheDeployer(port, deploymentsFile, deployerAccountKey);
    }
    else {
        say('The USE_GANACHE_DEPLOYMENT_CACHE option is not set, so starting an individual ganache instance.');
        const foundGanache = yield exports.ganacheIsRunning(port);
        if (foundGanache) {
            sayError(`Found a ganache instance already running at http://localhost:${port}. Try changing your GANACHE_PORT env variable!`);
            throw Error(`Ganache already running on port ${port}`);
        }
        server = yield startOwnGanache();
        deployer = new deployer_1.GanacheDeployer(server.port);
        type = 'individual';
    }
    return { server, deployer, type };
});
function startSharedGanache(deploymentsPath, p = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const port = Number(p.port || process.env.GANACHE_PORT);
        if (isNaN(port)) {
            say(`No port provided. Did you set GANACHE_PORT in the env? Continuing with default.`);
        }
        if (yield exports.ganacheIsRunning(port)) {
            say(`A shared ganache instance is already running on http://localhost:${port}`);
            return undefined;
        }
        const server = yield startOwnGanache(Object.assign(Object.assign({}, p), { port }));
        say(`Deployments will be written to ${deploymentsPath}.`);
        writeJsonFile(deploymentsPath, { deploymentsFileVersion: '0.1', deployments: [] });
        server.onClose(() => fs.existsSync(deploymentsPath) && fs.unlinkSync(deploymentsPath));
        return server;
    });
}
exports.startSharedGanache = startSharedGanache;
//# sourceMappingURL=index.js.map