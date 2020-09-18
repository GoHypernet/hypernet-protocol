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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = __importDefault(require("ethers"));
const privateKeyWithEth = '0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d';
function getGanacheProvider() {
    return new ethers_1.default.providers.JsonRpcProvider(`http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`);
}
exports.getGanacheProvider = getGanacheProvider;
function getPrivateKeyWithEth() {
    return privateKeyWithEth;
}
exports.getPrivateKeyWithEth = getPrivateKeyWithEth;
function getWalletWithEthAndProvider() {
    const ganacheProvider = new ethers_1.default.providers.JsonRpcProvider(`http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`);
    return new ethers_1.default.Wallet(privateKeyWithEth, ganacheProvider);
}
exports.getWalletWithEthAndProvider = getWalletWithEthAndProvider;
function getNetworkId() {
    return __awaiter(this, void 0, void 0, function* () {
        const ganacheProvider = new ethers_1.default.providers.JsonRpcProvider(`http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`);
        return (yield ganacheProvider.getNetwork()).chainId;
    });
}
exports.getNetworkId = getNetworkId;
function getNetworkName(networkId) {
    switch (Number(networkId)) {
        case 1:
            return 'live';
        case 3:
            return 'ropsten';
        case 4:
            return 'rinkeby';
        case 5:
            return 'goerli';
        case 42:
            return 'kovan';
        default:
            return 'development';
    }
}
exports.getNetworkName = getNetworkName;
//# sourceMappingURL=network-setup.js.map