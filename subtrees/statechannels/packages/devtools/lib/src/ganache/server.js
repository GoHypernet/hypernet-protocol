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
const child_process_1 = require("child_process");
const ethers_1 = require("ethers");
const tcp_port_used_1 = require("tcp-port-used");
const kill = require("tree-kill");
const etherlime_lib_1 = require("etherlime-lib");
const constants_1 = require("../constants");
const config_1 = require("./config");
const logger_1 = require("./logger");
function findClosingPosition(data) {
    let closePos = 0;
    let depth = 1;
    while (depth > 0) {
        const char = data[++closePos];
        if (char === '{')
            depth++;
        else if (char === '}')
            depth--;
        else if (closePos === data.length - 1)
            return -1;
    }
    return ++closePos;
}
function clean(newData) {
    newData = newData.replace(/>/g, '');
    newData = newData.replace(/</g, '');
    return newData;
}
function extractLogsFromVerboseGanacheOutput(buffer, newData = '') {
    logger_1.logger.trace({ buffer, newData }, 'Extracting logs');
    buffer = buffer.concat(clean(newData));
    const logLineStart = buffer.indexOf('{');
    let statement = '';
    if (logLineStart === -1) {
        statement = buffer;
        buffer = '';
    }
    else if (logLineStart > 0) {
        statement = buffer.slice(0, logLineStart);
        buffer = buffer.slice(logLineStart);
    }
    statement = statement.trim();
    if (statement) {
        logger_1.logger.info({ statement }, 'NON-JSON-RPC log line:');
    }
    if (buffer.length === 0) {
        return '';
    }
    if (buffer.indexOf('}') !== -1 && buffer.indexOf('}') < logLineStart) {
        logger_1.logger.error({ buffer, logLineStart }, 'Unexpected buffer');
        return '';
    }
    const logLineEnd = findClosingPosition(buffer);
    if (logLineEnd === -1) {
        logger_1.logger.trace({ buffer }, 'No end in sight...');
        return buffer;
    }
    const logLine = JSON.parse(buffer.slice(0, logLineEnd));
    if ('method' in logLine) {
        logger_1.logger.info(logLine, `> REQUEST: ${logLine.method} - ${logLine.id}`);
    }
    else if ('error' in logLine) {
        logger_1.logger.info(logLine, `< ERROR: request failed ${logLine.id}`);
    }
    else if ('result' in logLine) {
        logger_1.logger.info(logLine, `< RESULT: request succeeded ${logLine.id}`);
    }
    else {
        logger_1.logger.error(logLine, 'Log line is not a JSON-RPC message');
    }
    return extractLogsFromVerboseGanacheOutput(buffer.slice(logLineEnd));
}
class GanacheServer {
    constructor(port = 8545, chainId = 9001, accounts = constants_1.ETHERLIME_ACCOUNTS, timeout = 10000, gasLimit = 1000000000, gasPrice = 1) {
        this.port = port;
        this.chainId = chainId;
        this.timeout = timeout;
        this.buffer = '';
        logger_1.logger.info(`Starting ganache on port ${this.port} with network ID ${this.chainId}`);
        this.fundedPrivateKey = accounts[0].privateKey;
        const oneMillion = ethers_1.ethers.utils.parseEther('1000000');
        const opts = [
            [`--networkId ${this.chainId}`, `--port ${this.port}`],
            accounts.map(a => `--account ${a.privateKey},${a.amount || oneMillion}`),
            [`--gasLimit ${gasLimit}`, `--gasPrice ${gasPrice}`],
            config_1.SHOW_VERBOSE_GANACHE_OUTPUT ? ['--verbose'] : []
        ]
            .reduce((a, b) => a.concat(b))
            .join(' ');
        const cmd = `ganache-cli ${opts}`;
        this.server = child_process_1.spawn('npx', ['-c', cmd], { stdio: 'pipe' });
        this.server.stdout.on('data', data => {
            if (config_1.SHOW_VERBOSE_GANACHE_OUTPUT) {
                extractLogsFromVerboseGanacheOutput(this.buffer, data.toString());
            }
            else {
                logger_1.logger.info(data.toString());
            }
        });
        this.server.stderr.on('data', data => {
            logger_1.logger.error({ error: data.toString() }, `Server threw error`);
            throw new Error('Ganache server failed to start');
        });
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider(`http://localhost:${this.port}`);
    }
    static connect(port) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new ethers_1.ethers.providers.JsonRpcProvider(`http://localhost:${port}`);
            try {
                yield provider.getBlockNumber();
                return new GanacheServer(port);
            }
            catch (e) {
                return Promise.reject(`No ganache server to connect to locally on port ${port}`);
            }
        });
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            yield tcp_port_used_1.waitUntilUsed(this.port, 500, this.timeout);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            kill(this.server.pid);
            yield tcp_port_used_1.waitUntilFree(this.port, 500, this.timeout);
        });
    }
    onClose(listener) {
        this.server.on('close', listener);
    }
    deployContracts(deployments) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployer = new etherlime_lib_1.EtherlimeGanacheDeployer(undefined, Number(process.env.GANACHE_PORT));
            const deployedArtifacts = {};
            for (const deployment of deployments) {
                const artifact = deployment.artifact || deployment;
                let args = [];
                if (deployment.arguments) {
                    args = deployment.arguments(deployedArtifacts);
                }
                const deployedArtifact = yield deployer.deploy(artifact, undefined, ...args);
                deployedArtifacts[artifact.contractName] = {
                    address: deployedArtifact.contractAddress,
                    abi: JSON.stringify(artifact.abi)
                };
            }
            logger_1.logger.info({ deployedArtifacts }, 'Contracts deployed to chain');
            return deployedArtifacts;
        });
    }
}
exports.GanacheServer = GanacheServer;
//# sourceMappingURL=server.js.map