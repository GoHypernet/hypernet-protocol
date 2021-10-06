const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("Governance", function () {
    let hypertoken;
    let timelock;
    let hypernetgovernor;
    let owner;
    let addr1; 

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners()

        const Hypertoken = await ethers.getContractFactory("Hypertoken");
        hypertoken = await Hypertoken.deploy();
        await hypertoken.deployTransaction.wait();

        // deploy timelock contract
        const Timelock = await ethers.getContractFactory("TimelockController");
        timelock = await Timelock.deploy(1, [], []);
        await timelock.deployTransaction.wait();

        // deploy hypernet governor contract
        const HypernetGovernor = await ethers.getContractFactory("HypernetGovernor");
        hypernetgovernor = await HypernetGovernor.deploy(hypertoken.address, timelock.address);
        await hypernetgovernor.deployTransaction.wait();

        // give the governor contract the Proposer role in the timelock contract
        let tx = await timelock.grantRole(timelock.PROPOSER_ROLE(), hypernetgovernor.address);
        tx.wait();

        // give the governor contract the Executor role in the timelock contract
        tx = await timelock.grantRole(timelock.EXECUTOR_ROLE(), hypernetgovernor.address);
        tx.wait();

        // deployer address should now renounce admin role for security
        tx = await timelock.renounceRole(timelock.TIMELOCK_ADMIN_ROLE(), owner.address);
        await tx.wait();
	});

    it("Test vote delegation.", async function () {
        let tx = await hypertoken.delegate(owner.address);
        tx.wait();

        // give some tokens to the timelock contract
        tx = await hypertoken.transfer(timelock.address, ethers.utils.parseEther("1000"))
        tx.wait()

        // if delegate() is not called, the account has no voting power
        expect(await hypertoken.balanceOf(timelock.address)).to.equal(ethers.utils.parseEther("1000"));
        expect(await hypertoken.getVotes(timelock.address)).to.equal(ethers.utils.parseEther("0"));
        expect(await hypertoken.getVotes(owner.address)).to.equal(ethers.utils.parseEther("99999000"));

    });

    it("Test governance proposal.", async function () {

        let tx = await hypertoken.delegate(owner.address);
        tx.wait();

        // Example of proposal creation, this one transfers tokens from governor contract
        // to a target address
        // create proposal call data
        let proposalDescription = "Proposal #1: Give grant to address" // Human readable description
        let descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
        let transferCalldata = hypertoken.interface.encodeFunctionData('transfer', [addr1.address, 7]); // encode the function to be called 
        let proposalID = await hypernetgovernor.hashProposal(
            [hypertoken.address],
            [0],
            [transferCalldata],
            descriptionHash
        ); // pre-compute the proposal ID for easy lookup later

        // propose a vote
        let governorWithSigner = hypernetgovernor.connect(owner)
        tx = await hypernetgovernor["propose(address[],uint256[],bytes[],string)"](
            [hypertoken.address],
            [0],
            [transferCalldata],
            proposalDescription
        );
        tx.wait()

        // give some tokens to addr1 to force a new block in testing environment
        tx = await hypertoken.transfer(addr1.address, 1000)
        tx.wait()
        expect(await hypertoken.balanceOf(addr1.address)).to.equal(1000);

        // check state of proposal, should be 1 for Active
        expect(await hypernetgovernor.state(proposalID)).to.equal(1);

        tx = await hypernetgovernor.castVote(proposalID, 1)
        tx.wait()

        // check who has voted
        expect(await hypernetgovernor.hasVoted(proposalID, owner.address)).to.equal(true);
        expect(await hypernetgovernor.hasVoted(proposalID, addr1.address)).to.equal(false);

        // get the blocknumber for a Proposal (i.e "timestamp" it was submitted on)
        const snapshot = await hypernetgovernor.proposalSnapshot(proposalID);

        // get the blocknumber at which the Proposal voting period is done
        const deadline = await hypernetgovernor.proposalDeadline(proposalID);

        // get the required number of votes for successful quorum at a particular block number
        const quorum = await hypernetgovernor.quorum(snapshot);

        // get Proposal details (defined in GovernorCompatibilityBravo.sol)
        const proposal = await hypernetgovernor.proposals(proposalID);
    });
});