"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nitro_protocol_1 = require("@statechannels/nitro-protocol");
const ethers_1 = require("ethers");
const config_1 = require("../config");
const rpcEndpoint = config_1.defaultConfig.rpcEndpoint;
const provider = new ethers_1.providers.JsonRpcProvider(rpcEndpoint);
const walletWithProvider = new ethers_1.ethers.Wallet(config_1.defaultConfig.serverSignerPrivateKey, provider);
async function ethAssetHolder() {
    let ethAssetHolderFactory;
    try {
        ethAssetHolderFactory = await ethers_1.ContractFactory.fromSolidity(nitro_protocol_1.ContractArtifacts.EthAssetHolderArtifact, walletWithProvider);
    }
    catch (err) {
        if (err.message.match('bytecode must be a valid hex string')) {
            throw new Error(`Contract not deployed on network ${config_1.defaultConfig.chainNetworkID}`);
        }
        throw err;
    }
    if (!config_1.defaultConfig.ethAssetHolderAddress) {
        throw new Error('ETH_ASSET_HOLDER_ADDRESS not defined');
    }
    const contract = await ethAssetHolderFactory.attach(config_1.defaultConfig.ethAssetHolderAddress);
    return contract;
}
exports.ethAssetHolder = ethAssetHolder;
//# sourceMappingURL=blockchain.js.map