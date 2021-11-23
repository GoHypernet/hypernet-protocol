require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-ethers");
require("@atixlabs/hardhat-time-n-mine");
require("@openzeppelin/hardhat-upgrades");

require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("hardhat-tracer");

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
        mnemonic,
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
      url: 'http://127.0.0.1:8545'
    },
    DevNet: {
      accounts: {
        mnemonic,
      },
      url: "https://eth-provider-dev.hypernetlabs.io",
    },
    rinkeby: {
      accounts: { mnemonic },
      chainId: 4,
      url: urlOverride || "http://localhost:8545",
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
