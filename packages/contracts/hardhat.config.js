require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-ethers");
require("@atixlabs/hardhat-time-n-mine");
require("@openzeppelin/hardhat-upgrades");

require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("hardhat-tracer");
require("ethers");

require("./tasks/general-tasks.js");
require("./tasks/governance-tasks.js");
require("./tasks/registry-tasks.js");

const urlOverride = process.env.ETH_PROVIDER_URL;
const mnemonic =
  process.env.MNEMONIC ||
  "test test test test test test test test test test test junk";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "10000000000000000000000",
      },
      mining: {
        auto: true,
        interval: [3000, 6000],
      },
      chainId: 31337,
    },
    dev: {
      accounts: {
        accountsBalance: "10000000000000000000000",
        mnemonic,
      },
      chainId: 31337,
      url: "http://127.0.0.1:8569",
    },
    DevNet: {
      accounts: {
        mnemonic,
      },
      url: "https://eth-provider-dev.hypernetlabs.io",
    },
    mainnet: { // ethereum mainnet
        accounts: { mnemonic },
        chainId: 1,
        url: urlOverride || "https://f8334b5b-ad76-4d4a-8443-88d05097eb8b.hypernetlabs.io/http/",
    },
    rinkeby: { // ethereum tesnet
      accounts: { mnemonic },
      chainId: 4,
      url: urlOverride || "https://station-hundred-assure-neighborhood.trycloudflare.com/http/",
    },
    mumbai: { // polygon testnet
        accounts: { mnemonic },
        chainId: 80001,
        url: urlOverride || "https://matic-mumbai.chainstacklabs.com",
        gas: 6000000,
        gasPrice: 8000000000
    },
    polygon: { // polygon mainnet
        accounts: { mnemonic },
        chainId: 137,
        url: urlOverride || "https://rpc-mainnet.matic.quiknode.pro",
    },
    fuji: { // avalanche testnet
        accounts: { mnemonic },
        chainId: 43113,
        url: urlOverride || "https://f0fa7eba-0c1b-4f3f-bc37-67ba6ae2b60a.hypernetlabs.io/http/ext/bc/C/rpc",
    },
    avalanche: { // avalanche mainnet
        accounts: { mnemonic },
        chainId: 43114,
        url: urlOverride || "https://053e1c5c-66fd-49c3-b267-42ab5f9202c6.hypernetlabs.io/http/ext/bc/C/rpc",
    },
    fantom: { // fantom mainnet
        accounts: { mnemonic },
        chainId: 250,
        url: urlOverride || "https://lyrics-prepared-here-powerpoint.trycloudflare.com/rpc/",
    },
  },
  gasReporter: {
    enabled: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};