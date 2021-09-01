require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("hardhat-gas-reporter");

const HG = require("./artifacts/contracts/HypernetGovernor.sol/HypernetGovernor.json")
const RF = require("./artifacts/contracts/RegistryFactory.sol/RegistryFactory.json")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("governanceParameters", "Prints Governance contracts parameters.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    // set governance address based on network
    let govAddress;
    if (network["name"] == "hardhat") {
        govAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    } else {
        govAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    }
    const govHandle = new hre.ethers.Contract(govAddress, HG.abi, accounts[0]);

    console.log(network["name"]);
    let name = await govHandle.name();
    let votingDelay = await govHandle.votingDelay();
    let votingPeriod = await govHandle.votingPeriod();
    let proposalThreshold = await govHandle.proposalThreshold();
    console.log("Governance Name:", name);
    console.log("Voting Delay (blocks):", votingDelay.toString());
    console.log("Voting Period (blocks):", votingPeriod.toString());
    console.log("Proposal Quorum (vote threshold):", proposalThreshold.toString());
  });

  task("proposeRegistry", "Propose a new NonFungibleRegistry.")
  .addParam("name", "Name for proposed registry.")
  .addParam("symbol", "Symbol for proposed registry.")
  .addParam("owner", "Address of Owner of proposed registry.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    // set governance address based on network
    let govAddress;
    let factoryAddress;
    if (network["name"] == "hardhat") {
        govAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
        factoryAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    } else {
        govAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
        factoryAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    }
    const govHandle = new hre.ethers.Contract(govAddress, HG.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(factoryAddress, RF.abi, accounts[0]);

    const proposalDescription = taskArgs.name;
    const descriptionHash = hre.ethers.utils.id(proposalDescription);
    const registrySymbol = taskArgs.symbol;
    const registryOwner = taskArgs.owner;
    const transferCalldata = factoryHandle.interface.encodeFunctionData('createRegistry',[proposalDescription, registrySymbol, registryOwner])

    const proposalID = await govHandle.hashProposal(
        [govAddress],
        [0],
        [transferCalldata],
        descriptionHash
    );
    // propose a new registry
    const tx = await govHandle["propose(address[],uint256[],bytes[],string)"](
        [govAddress],
        [0],
        [transferCalldata],
        proposalDescription
    );
    const tx_reciept = await tx.wait();
    console.log("Proposal ID:", proposalID.toString());
  });

  task("proposalState", "Check the state of an existing proposal")
  .addParam("id", "ID of an existing proposal.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    // set governance address based on network
    let govAddress;
    let factoryAddress;
    if (network["name"] == "hardhat") {
        govAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    } else {
        govAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    }
    const govHandle = new hre.ethers.Contract(govAddress, HG.abi, accounts[0]);

    const proposalID = taskArgs.id;
    const proposalState = await govHandle.state(proposalID)

    console.log("Proposal ID:", proposalID.toString());
    console.log("Proposal State:", proposalState)
  });

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
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: [3000, 6000]
      }
    },
    dev: {
      url: 'http://127.0.0.1:8569'
    }
  },
  gasReporter: {
    enabled: true
  }
};
