const HT = require("../deployments/rinkeby/governance/Hypertoken.sol/Hypertoken.json");
const HG = require("../deployments/rinkeby/governance/HypernetGovernor.sol/HypernetGovernor.json");
const RF = require("../deployments/rinkeby/identity/UpgradeableRegistryFactory.sol/UpgradeableRegistryFactory.json");
const NFR = require("../deployments/rinkeby/identity/NonFungibleRegistryEnumerableUpgradeable.sol/NonFungibleRegistryEnumerableUpgradeable.json");
const BM = require("../deployments/rinkeby/modules/BatchModule.sol/BatchModule.json");

// define some dynamic imports
const hAddress = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  } else if (hre.hardhatArguments.network == "DevNet") {
    return "0xAa588d3737B611baFD7bD713445b314BD453a5C8"
  } else if (hre.hardhatArguments.network == "rinkeby") {
    return "0x6D4eE7f794103672490830e15308A99eB7a89024"
  } else if (hre.hardhatArguments.network == "mumbai") {
    return ""
  } else if (hre.hardhatArguments.network == "fuji") {
    return ""
  } else {
    return "0xAa588d3737B611baFD7bD713445b314BD453a5C8";
  }
};

const govAddress = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  } else if (hre.hardhatArguments.network == "DevNet") {
    return "0xdDA6327139485221633A1FcD65f4aC932E60A2e1"
  } else if (hre.hardhatArguments.network == "rinkeby") {
    return "0x3353da0f24fCACd83832b09e9371a937195D2640"
  } else if (hre.hardhatArguments.network == "mumbai") {
    return ""
  } else if (hre.hardhatArguments.network == "fuji") {
    return ""
  } else {
    return "0xdDA6327139485221633A1FcD65f4aC932E60A2e1";
  }
};

const timelockAddress = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  } else if (hre.hardhatArguments.network == "DevNet") {
    return "0xeec918d74c746167564401103096D45BbD494B74"
  } else if (hre.hardhatArguments.network == "rinkeby") {
    return "0xc5b292502cDb63f6c19A9a85a29B5F5834b9146a"
  } else if (hre.hardhatArguments.network == "mumbai") {
    return ""
  } else if (hre.hardhatArguments.network == "fuji") {
    return ""
  } else {
    return "0xeec918d74c746167564401103096D45BbD494B74";
  }
};

const factoryAddress = function () {
  const hre = require("hardhat");
  if (hre.hardhatArguments.network == "dev") {
    return "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
  } else if (hre.hardhatArguments.network == "DevNet") {
    return "0x82D50AD3C1091866E258Fd0f1a7cC9674609D254"
  } else if (hre.hardhatArguments.network == "rinkeby") {
    return "0x60eFCb4dDA1bef87aA244006273e3DdDb0E4abCB"
  } else if (hre.hardhatArguments.network == "mumbai") {
    return "0x6cd4a3319B5E2173Fb44e21B5b506da35ada9899"
  } else if (hre.hardhatArguments.network == "fuji") {
    return "0xc5b292502cDb63f6c19A9a85a29B5F5834b9146a"
  } else {
    return "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  }
};

module.exports = {
  HT,
  HG,
  RF,
  NFR,
  BM,
  govAddress,
  timelockAddress,
  factoryAddress,
  hAddress,
};
