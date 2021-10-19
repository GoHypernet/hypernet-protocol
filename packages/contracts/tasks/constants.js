const HT = require("../artifacts/contracts/governance/Hypertoken.sol/Hypertoken.json");
const HG = require("../artifacts/contracts/governance/HypernetGovernor.sol/HypernetGovernor.json");
const RF = require("../artifacts/contracts/identity/UpgradeableRegistryFactory.sol/UpgradeableRegistryFactory.json");
const NFR = require("../artifacts/contracts/identity/NonFungibleRegistryEnumerableUpgradeable.sol/NonFungibleRegistryEnumerableUpgradeable.json");

// define some dynamic imports
const hAddress = function(){
    const hre = require("hardhat");
    if (hre.hardhatArguments.network == 'dev') {
        return "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    } else {
        return "0xAa588d3737B611baFD7bD713445b314BD453a5C8";
    }
}

const govAddress = function(){
    const hre = require("hardhat");
    if (hre.hardhatArguments.network == 'dev') {
        return "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    } else {
        return "0x75c35C980C0d37ef46DF04d31A140b65503c0eEd";
    }
}

const timelockAddress = function(){
    const hre = require("hardhat");
    if (hre.hardhatArguments.network == 'dev') {
        return "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    } else {
        return "0x82D50AD3C1091866E258Fd0f1a7cC9674609D254";
    }
}

const factoryAddress = function(){
    const hre = require("hardhat");
    if (hre.hardhatArguments.network == 'dev') {
        return "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
    } else {
        return "0xf204a4Ef082f5c04bB89F7D5E6568B796096735a";
    }
}

module.exports = {
  HT,
  HG,
  RF,
  NFR,
  govAddress,
  timelockAddress,
  factoryAddress,
  hAddress
};

