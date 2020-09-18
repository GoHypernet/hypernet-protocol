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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ethers_1 = require("ethers");
var linker_1 = __importDefault(require("solc/linker"));
var easy_table_1 = __importDefault(require("easy-table"));
var gasConsumed = {};
var GasReporter = (function () {
    function GasReporter(globalConfig, options) {
        this.startBlockNum = 0;
        this.globalConfig = globalConfig;
        this.options = options;
        this.provider = new ethers_1.providers.JsonRpcProvider("http://localhost:" + (process.env.GANACHE_PORT || 8545));
    }
    GasReporter.prototype.onTestStart = function () {
    };
    GasReporter.prototype.getLastError = function () {
    };
    GasReporter.prototype.onTestResult = function () {
    };
    GasReporter.prototype.onRunStart = function () {
        if (!this.options.contractArtifactFolder) {
            console.log("The contractArtifactFolder was not set in options, assuming a default folder of '/build/contracts/'");
            this.options.contractArtifactFolder = 'build/contracts';
        }
    };
    GasReporter.prototype.onRunComplete = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.generateFinalResults()
                .then(function () {
                resolve();
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    GasReporter.prototype.generateFinalResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var endBlockNum, contractCalls;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.provider.getBlockNumber()];
                    case 1:
                        endBlockNum = _a.sent();
                        return [4, this.parseContractCalls(this.startBlockNum, endBlockNum, this.options.contractArtifactFolder)];
                    case 2:
                        contractCalls = _a.sent();
                        this.outputGasInfo(contractCalls);
                        return [4, this.saveResultsToFile(process.env.CIRCLE_SHA1)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    GasReporter.prototype.parseContractCalls = function (startBlockNum, endBlockNum, contractFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var networkId, contractCalls, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.provider.getNetwork()];
                    case 1:
                        networkId = (_a.sent()).chainId;
                        return [4, this.parseContractArtifactFolder(contractFolder, networkId)];
                    case 2:
                        contractCalls = _a.sent();
                        i = startBlockNum;
                        _a.label = 3;
                    case 3:
                        if (!(i <= endBlockNum)) return [3, 6];
                        return [4, this.parseBlock(i, contractCalls)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3, 3];
                    case 6: return [2, contractCalls];
                }
            });
        });
    };
    GasReporter.prototype.parseContractArtifactFolder = function (contractFolder, networkId) {
        var _this = this;
        var contractCalls = {};
        var contractArtifacts = fs_1.default.readdirSync(contractFolder);
        contractArtifacts.forEach(function (artifact) {
            var fileLocation = path_1.default.join(contractFolder, artifact);
            var fileContent = fs_1.default.readFileSync(fileLocation, 'utf8');
            var parsedArtifact = JSON.parse(fileContent);
            _this.parseInterfaceAndAddress(parsedArtifact, networkId, contractCalls);
            _this.parseCode(parsedArtifact, contractCalls);
        });
        return contractCalls;
    };
    GasReporter.prototype.parseCode = function (parsedArtifact, contractCalls) {
        var lookup = {};
        for (var _i = 0, _a = Object.keys(contractCalls); _i < _a.length; _i++) {
            var contractName = _a[_i];
            if (contractCalls[contractName].address) {
                lookup[contractName] = contractCalls[contractName].address;
            }
        }
        if (parsedArtifact.deployedBytecode) {
            var linkedCode = linker_1.default.linkBytecode(parsedArtifact.deployedBytecode, lookup);
            contractCalls[parsedArtifact.contractName].code = linkedCode;
        }
    };
    GasReporter.prototype.parseInterfaceAndAddress = function (parsedArtifact, networkId, contractCalls) {
        if (parsedArtifact.abi && parsedArtifact.contractName) {
            var contractInterface = new ethers_1.utils.Interface(parsedArtifact.abi);
            contractCalls[parsedArtifact.contractName] = {
                methodCalls: {},
                code: '',
                interface: contractInterface
            };
            if (parsedArtifact.networks[networkId]) {
                contractCalls[parsedArtifact.contractName].address =
                    parsedArtifact.networks[networkId].address;
            }
        }
    };
    GasReporter.prototype.outputGasInfo = function (contractCalls) {
        var _loop_1 = function (contractName) {
            var contractStats = {
                deployment: 0,
                methods: {}
            };
            if (contractCalls[contractName].deploy) {
                var deployGas = contractCalls[contractName].deploy.gasData;
                if (deployGas[1] && deployGas[1] !== deployGas[0]) {
                    throw new Error('Multiple deployments with differing gas costs detected!');
                }
                contractStats.deployment = deployGas[0];
            }
            var methodCalls = contractCalls[contractName].methodCalls;
            Object.keys(methodCalls).forEach(function (methodName) {
                var method = methodCalls[methodName];
                var total = method.gasData.reduce(function (acc, datum) { return acc + datum; }, 0);
                var average = Math.round(total / method.gasData.length);
                var min = Math.min.apply(Math, method.gasData);
                var max = Math.max.apply(Math, method.gasData);
                var stats = { calls: method.calls, min: min, max: max, avg: average };
                contractStats.methods[methodName] = stats;
            });
            if (contractStats.deployment > 0) {
                gasConsumed[contractName] = contractStats;
            }
        };
        for (var _i = 0, _a = Object.keys(contractCalls); _i < _a.length; _i++) {
            var contractName = _a[_i];
            _loop_1(contractName);
        }
        console.log(this.objectToEasyTable(gasConsumed, false).toString());
    };
    GasReporter.prototype.objectToEasyTable = function (gasConsumed, markdown) {
        function addCell(table, column, entry) {
            if (!markdown) {
                table.cell(column, entry.toString());
            }
            else {
                table.cell(column + ' |', entry.toString() + ' |');
            }
        }
        var table = new easy_table_1.default();
        if (markdown) {
            addCell(table, 'Contract', 'Contract');
            addCell(table, 'Deployment', 'Deployment');
            addCell(table, 'Method', 'Method');
            addCell(table, 'Calls', 'Calls');
            addCell(table, 'Min', 'Min');
            addCell(table, 'Avg', 'Avg');
            addCell(table, 'Max', 'Max');
            table.newRow();
            addCell(table, 'Contract', '---');
            addCell(table, 'Deployment', '---');
            addCell(table, 'Method', '---');
            addCell(table, 'Calls', '---');
            addCell(table, 'Min', '---');
            addCell(table, 'Avg', '---');
            addCell(table, 'Max', '---');
            table.newRow();
        }
        Object.keys(gasConsumed).forEach(function (contract) {
            var contractStats = gasConsumed[contract];
            addCell(table, 'Contract', contract);
            addCell(table, 'Deployment', contractStats.deployment);
            addCell(table, 'Method', '*');
            addCell(table, 'Calls', '*');
            addCell(table, 'Min', '*');
            addCell(table, 'Avg', '*');
            addCell(table, 'Max', '*');
            table.newRow();
            Object.keys(contractStats.methods).forEach(function (method) {
                addCell(table, 'Contract', '*');
                addCell(table, 'Deployment', '*');
                addCell(table, 'Method', method);
                var methodStats = contractStats.methods[method];
                addCell(table, 'Calls', methodStats.calls);
                addCell(table, 'Min', methodStats.min);
                addCell(table, 'Avg', methodStats.avg);
                addCell(table, 'Max', methodStats.max);
                table.newRow();
            });
        });
        return table;
    };
    GasReporter.prototype.parseBlock = function (blockNum, contractCalls) {
        return __awaiter(this, void 0, void 0, function () {
            var block, _i, _a, transHash, transaction, transactionReceipt, code, _b, _c, contractName, contractCall, details, code, _d, _e, contractName, contractCall;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4, this.provider.getBlock(blockNum)];
                    case 1:
                        block = _f.sent();
                        _i = 0, _a = block.transactions;
                        _f.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3, 9];
                        transHash = _a[_i];
                        return [4, this.provider.getTransaction(transHash)];
                    case 3:
                        transaction = _f.sent();
                        return [4, this.provider.getTransactionReceipt(transHash)];
                    case 4:
                        transactionReceipt = _f.sent();
                        if (!transaction.to) return [3, 6];
                        return [4, this.provider.getCode(transaction.to)];
                    case 5:
                        code = _f.sent();
                        for (_b = 0, _c = Object.keys(contractCalls); _b < _c.length; _b++) {
                            contractName = _c[_b];
                            contractCall = contractCalls[contractName];
                            if (contractCall.code.localeCompare(code, undefined, { sensitivity: 'base' }) === 0) {
                                details = contractCall.interface.parseTransaction(transaction);
                                if (details != null) {
                                    if (!contractCall.methodCalls[details.name]) {
                                        contractCall.methodCalls[details.name] = {
                                            gasData: [],
                                            calls: 0
                                        };
                                    }
                                    contractCall.methodCalls[details.name].gasData.push(transactionReceipt.gasUsed.toNumber());
                                    contractCall.methodCalls[details.name].calls++;
                                }
                            }
                        }
                        return [3, 8];
                    case 6:
                        if (!transactionReceipt.contractAddress) return [3, 8];
                        return [4, this.provider.getCode(transactionReceipt.contractAddress)];
                    case 7:
                        code = _f.sent();
                        for (_d = 0, _e = Object.keys(contractCalls); _d < _e.length; _d++) {
                            contractName = _e[_d];
                            contractCall = contractCalls[contractName];
                            if (contractCall.code.localeCompare(code, undefined, { sensitivity: 'base' }) === 0) {
                                if (!contractCall.deploy) {
                                    contractCall.deploy = { calls: 0, gasData: [] };
                                }
                                contractCall.deploy.calls++;
                                contractCall.deploy.gasData.push(transactionReceipt.gasUsed.toNumber());
                            }
                        }
                        _f.label = 8;
                    case 8:
                        _i++;
                        return [3, 2];
                    case 9: return [2];
                }
            });
        });
    };
    GasReporter.prototype.saveResultsToFile = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var results, resultsString, date;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = {
                            date: Date.now(),
                            networkName: this.provider.network.name,
                            revision: hash,
                            gasConsumed: gasConsumed
                        };
                        resultsString = JSON.stringify(results, null, 4) + '\n';
                        return [4, fs_1.default.appendFile('./gas.json', resultsString, function (err) {
                                if (err)
                                    throw err;
                                console.log('Wrote json to gas.json');
                            })];
                    case 1:
                        _a.sent();
                        date = new Date(Date.now());
                        return [4, fs_1.default.appendFile('./gas.md', '\n\n\n# date: ' +
                                date.toUTCString() +
                                '\nnetworkName: ' +
                                this.provider.network.name +
                                '\nrevision: ' +
                                hash +
                                '\n' +
                                this.objectToEasyTable(gasConsumed, true)
                                    .print()
                                    .toString(), function (err) {
                                if (err)
                                    throw err;
                                console.log('Wrote table to gas.md');
                            })];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return GasReporter;
}());
exports.GasReporter = GasReporter;
module.exports = GasReporter;
//# sourceMappingURL=index.js.map