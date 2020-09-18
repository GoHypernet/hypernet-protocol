"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nitro_protocol_1 = require("@statechannels/nitro-protocol");
const devtools_1 = require("@statechannels/devtools");
const config_1 = require("../src/config");
async function deploy() {
    const deployer = new devtools_1.GanacheDeployer(8545, config_1.defaultConfig.serverPrivateKey);
    const { EthAssetHolderArtifact, TokenArtifact, Erc20AssetHolderArtifact, NitroAdjudicatorArtifact, } = nitro_protocol_1.ContractArtifacts;
    const NITRO_ADJUDICATOR_ADDRESS = await deployer.deploy(NitroAdjudicatorArtifact);
    const ERC20_ADDRESS = await deployer.deploy(TokenArtifact, {}, 0);
    const ERC20_ASSET_HOLDER_ADDRESS = await deployer.deploy(Erc20AssetHolderArtifact, {}, NITRO_ADJUDICATOR_ADDRESS, ERC20_ADDRESS);
    const ETH_ASSET_HOLDER_ADDRESS = await deployer.deploy(EthAssetHolderArtifact, {}, NITRO_ADJUDICATOR_ADDRESS);
    return {
        NITRO_ADJUDICATOR_ADDRESS,
        ERC20_ADDRESS,
        ERC20_ASSET_HOLDER_ADDRESS,
        ETH_ASSET_HOLDER_ADDRESS,
    };
}
exports.deploy = deploy;
//# sourceMappingURL=deploy.js.map