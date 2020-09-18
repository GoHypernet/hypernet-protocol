"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devtools_1 = require("@statechannels/devtools");
const ethers_1 = require("ethers");
const config_1 = require("../src/config");
const deploy_1 = require("../deployment/deploy");
async function setup() {
    const account = {
        privateKey: config_1.defaultConfig.serverPrivateKey,
        amount: ethers_1.utils.parseEther('100').toString(),
    };
    const ganacheServer = new devtools_1.GanacheServer(8545, 1337, [account]);
    await ganacheServer.ready();
    const deployedArtifacts = await deploy_1.deploy();
    process.env = { ...process.env, ...deployedArtifacts };
    global.__ARTIFACTS__ = deployedArtifacts;
    global.__GANACHE_SERVER__ = ganacheServer;
}
exports.default = setup;
//# sourceMappingURL=chain-setup.js.map