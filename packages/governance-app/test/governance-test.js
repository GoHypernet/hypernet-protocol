const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("Governance", function () {
  it("Test governance functions.", async function () {
    // get signers
    const [owner, addr1] = await ethers.getSigners()

    // deploy hypertoken contract
    const Hypertoken = await ethers.getContractFactory("Hypertoken");
    const hypertoken = await Hypertoken.deploy();
    hypertoken_reciept = await hypertoken.deployTransaction.wait();
    const totalSupply = await hypertoken.totalSupply()
    console.log("Hypertoken Address:", hypertoken.address)
    console.log("Hypertoken Supply:", totalSupply.toString())
    console.log("Hypertoken Gas Fee:", hypertoken_reciept.gasUsed.toString())

    // all tokens are currently owned by owner signer
    // delegate all votes to self
    // if delegate() is not called, the account has no voting power
    const txvotes = await hypertoken.delegate(owner.address)
    const txvotes_receipt = txvotes.wait()

    // deploy timelock contract
    const Timelock = await ethers.getContractFactory("TimelockController");
    const timelock = await Timelock.deploy(1, [], []);
    const timelock_reciept = await timelock.deployTransaction.wait();
    console.log("Timelock Address:", timelock.address)
    console.log("Timelock Gas Fee:", timelock_reciept.gasUsed.toString())

    // deploy hypernet governor contract
    const HypernetGovernor = await ethers.getContractFactory("HypernetGovernor");
    const hypernetgovernor = await HypernetGovernor.deploy(hypertoken.address, timelock.address);
    const hypernetgovernor_reciept = await hypernetgovernor.deployTransaction.wait();
    console.log("Governor address:", hypernetgovernor.address)
    console.log("Governor Gas Fee:", hypernetgovernor_reciept.gasUsed.toString())

    // give the governor contract the Proposer role in the timelock contract
    const tx1 = await timelock.grantRole(timelock.PROPOSER_ROLE(), hypernetgovernor.address)
    const tx1_reciept = await tx1.wait()

    // deployer address should now renounce admin role for security
    const tx2 = await timelock.renounceRole(timelock.TIMELOCK_ADMIN_ROLE(), owner.address)
    const tx2_reciept = await tx2.wait()

    // give some tokens to the Governor contract
    const tx3 = await hypertoken.transfer(hypernetgovernor.address, 1000)
    const tx3_reciept = await tx3.wait()
    expect(await hypertoken.balanceOf(hypernetgovernor.address)).to.equal(1000);

    // hardhat extension to etheres, get token metadata
    const token = await ethers.getContractAt('Hypertoken', hypertoken.address);
    const governor = await ethers.getContractAt('HypernetGovernor', hypernetgovernor.address);
    const governorWithSigner = governor.connect(owner)

    // Example of proposal creation, this one transfers tokens from governor contract
    // to a target address
    // create proposal call data
    const proposalDescription = "Proposal #1: Give grant to address" // Human readable description
    const descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
    const transferCalldata = token.interface.encodeFunctionData('transfer', [addr1.address, 7]); // encode the function to be called 
    const proposalID = await governorWithSigner.hashProposal(
        [token.address],
        [0],
        [transferCalldata],
        descriptionHash
    ); // pre-compute the proposal ID for easy lookup later

    // propose a vote
    const tx4 = await governorWithSigner["propose(address[],uint256[],bytes[],string)"](
        [token.address],
        [0],
        [transferCalldata],
        proposalDescription
    );
    const tx4_reciept = await tx4.wait()

    // check state of proposal, should be 1 for Active
    expect(await governorWithSigner.state(proposalID)).to.equal(1);

    const tx5 = await governorWithSigner.castVote(proposalID, 1)
    const tx5_reciept = tx5.wait()

    // give some tokens to addr1 to force a new block in testing environment
    const tx6 = await hypertoken.transfer(addr1.address, 1000)
    const tx6_reciept = await tx6.wait()
    expect(await hypertoken.balanceOf(addr1.address)).to.equal(1000);

    // check who has voted
    expect(await governorWithSigner.hasVoted(proposalID, owner.address)).to.equal(true);
    expect(await governorWithSigner.hasVoted(proposalID, addr1.address)).to.equal(false);

    // get the blocknumber for a Proposal (i.e "timestamp" it was submitted on)
    const snapshot = await governorWithSigner.proposalSnapshot(proposalID);
    console.log("Proposal Start Block:", snapshot.toString());

    // get the blocknumber at which the Proposal voting period is done
    const deadline = await governorWithSigner.proposalDeadline(proposalID);
    console.log("Proposal Block Deadline:", deadline.toString());

    // get the required number of votes for successful quorum at a particular block number
    const quorum = await governorWithSigner.quorum(snapshot);
    console.log("Proposal Quorum:", quorum.toString());

    // get Proposal details (defined in GovernorCompatibilityBravo.sol)
    const proposal = await governorWithSigner.proposals(proposalID);
    console.log("Proposal Originator:", proposal[1]);
    console.log("Proposal ETA:", proposal[2].toString());
    console.log("Proposal Votes For:", proposal[5].toString());
    console.log("Proposal Votes Against:", proposal[6].toString());
    console.log("Proposal Executed:", proposal[8]);
  });
});