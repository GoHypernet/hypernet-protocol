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

        // deletate votes to the owner address
        tx = await hypertoken.delegate(owner.address);
        tx.wait();

        // give some tokens to the timelock contract
        tx = await hypertoken.transfer(timelock.address, ethers.utils.parseEther("1000"))
        tx.wait()
	});

    it("Test vote delegation.", async function () {
        // if delegate() is not called, the account has no voting power
        expect(await hypertoken.balanceOf(timelock.address)).to.equal(ethers.utils.parseEther("1000"));
        expect(await hypertoken.getVotes(timelock.address)).to.equal(ethers.utils.parseEther("0"));
        expect(await hypertoken.getVotes(owner.address)).to.equal(ethers.utils.parseEther("99999000"));

    });

    it("Test successful execution of proposal.", async function () {
        // create proposal call data
        let proposalDescription = "Proposal #1: Give grant to address" // Human readable description
        let descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
        let transferCalldata = hypertoken.interface.encodeFunctionData('transfer', [addr1.address, ethers.utils.parseEther("7")]); // encode the function to be called 
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

        // fast forward 1 block to get the proposal into active state
        hre.timeAndMine.mine(1);

        // check state of proposal, should be 1 for Active
        expect(await hypernetgovernor.state(proposalID)).to.equal(1);

        tx = await hypernetgovernor.castVote(proposalID, 1)
        tx.wait()

        // check who has voted
        expect(await hypernetgovernor.hasVoted(proposalID, owner.address)).to.equal(true);
        expect(await hypernetgovernor.hasVoted(proposalID, addr1.address)).to.equal(false);

        // fast forward 20 blocks to get past proposal deadline
        hre.timeAndMine.mine(290);

        // check state of proposal, should be 4 for passed
        expect(await hypernetgovernor.state(proposalID)).to.equal(4);

        // queue the proposal
        tx = await hypernetgovernor["queue(uint256)"](proposalID);
        tx.wait();
        expect(await hypernetgovernor.state(proposalID)).to.equal(5);

        // execute the proposal
        tx = await hypernetgovernor["execute(uint256)"](proposalID);
        tx.wait();
        expect(await hypernetgovernor.state(proposalID)).to.equal(7);
        expect(await hypertoken.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("7"));
        expect(await hypertoken.balanceOf(timelock.address)).to.equal(ethers.utils.parseEther("993"));
    });
});