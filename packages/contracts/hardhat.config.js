require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("hardhat-gas-reporter");

const HT = require("./artifacts/contracts/Hypertoken.sol/Hypertoken.json")
const HG = require("./artifacts/contracts/HypernetGovernor.sol/HypernetGovernor.json")
const RF = require("./artifacts/contracts/RegistryFactory.sol/RegistryFactory.json")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("sendhypertoken", "Send hypertoken to another account")
  .addParam("recipient", "Address of the recipient")
  .addParam("amount", "Amount of Hypertoken to send")
  .setAction(async (taskArgs) => {
  const [owner] = await hre.ethers.getSigners();

  // set token address based on network
  let hAddress;
  if (network["name"] == "hardhat") {
      hAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  } else {
      hAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  }

  const hypertoken = new hre.ethers.Contract(hAddress, HT.abi, owner);
  const recipient = taskArgs.recipient;
  const amount = taskArgs.amount;
  const tx = await hypertoken.transfer(recipient, amount);
  const tx_rcpt = await tx.wait();
  const balR = await hypertoken.balanceOf(recipient)
  const balS = await hypertoken.balanceOf(owner.address)

  console.log("Balance of sender:", balS.toString())
  console.log("Balance of recipient:", balR.toString())
});

task("delegateVote", "Delegate your voting power")
  .addParam("delegate", "Address of the delegate (can be self)")
  .setAction(async (taskArgs) => {
  const [owner] = await hre.ethers.getSigners();

  // set token address based on network
  let hAddress;
  if (network["name"] == "hardhat") {
      hAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  } else {
      hAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  }

  const hypertoken = new hre.ethers.Contract(hAddress, HT.abi, owner);
  const delegate = taskArgs.delegate;
  const amount = taskArgs.amount;
  const tx = await hypertoken.delegate(delegate);
  const tx_rcpt = await tx.wait();
  const votePowerDelegate = await hypertoken.getVotes(delegate)
  const votePowerOwner = await hypertoken.getVotes(owner.address)

  console.log("Voting power of Owner:", votePowerOwner.toString())
  console.log("Voting power of Delegate:", votePowerDelegate.toString())
});

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
    const proposalStart = await govHandle.proposalSnapshot(proposalID)
    const proposalDeadline = await govHandle.proposalDeadline(proposalID)
    const proposal = await govHandle.proposals(proposalID);

    console.log("Proposal ID:", proposalID.toString());
    console.log("Proposal State:", proposalState.toString());
    console.log("Proposal Start Block:", proposalStart.toString());
    console.log("Proposal Deadline Block:", proposalDeadline.toString());

    console.log("Proposal Originator:", proposal[1]);
    console.log("Proposal ETA:", proposal[2].toString());
    console.log("Proposal Votes For:", proposal[5].toString());
    console.log("Proposal Votes Against:", proposal[6].toString());
    console.log("Proposal Executed:", proposal[8]);
  });

  task("castVote", "Cast a vote for an existing proposal")
  .addParam("id", "ID of an existing proposal.")
  .addParam("support","Against (0), For (1), Abstain (2)")
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
    const support = taskArgs.support;
    const tx = await govHandle.castVote(proposalID, support)
    const tx_rcpt = tx.wait()
    const proposal = await govHandle.proposals(proposalID);

    console.log("Proposal Originator:", proposal[1]);
    console.log("Proposal ETA:", proposal[2].toString());
    console.log("Proposal Votes For:", proposal[5].toString());
    console.log("Proposal Votes Against:", proposal[6].toString());
    console.log("Proposal Executed:", proposal[8]);
  });

  task("executeProposal", "Execute a proposal that has been successfully passed.")
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
    const { targets, values, signatures, calldatas } = await govHandle.getActions(proposalID);
    console.log("Executing Proposal:", proposalID);
    console.log("Target Addresses:", targets);
    console.log("Proposal Values:", values);
    console.log("Proposal Signatures:", signatures);
    console.log("Call Datas:", calldatas);
    const tx = await govHandle["execute(uint256)"](proposalID);
    const tx_rcp = tx.wait();
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
