const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("Vesting", function () {
    let hypertoken;
    let vester;
    let owner;
    let addr1; 

    const award = ethers.utils.parseEther("100");
    const timeNow = Date.now();
    const startTime = timeNow;
    const cliffTime = timeNow+30;
    const endTime = timeNow+60;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        // deploy hypertoken contract
        const Hypertoken = await ethers.getContractFactory("Hypertoken");
        hypertoken = await Hypertoken.deploy();
        await hypertoken.deployTransaction.wait();

        // deploy Vesting contract
        const Vester = await ethers.getContractFactory("Vester");
        vester = await Vester.deploy(hypertoken.address, addr1.address, award, startTime, cliffTime, endTime);
        await vester.deployTransaction.wait();
	});

    it("Test vesting contract.", async function () {
        let tx = await hypertoken.transfer(vester.address, award);
        tx.wait();

        tx = await vester.connect(addr1).delegate(addr1.address);
        tx.wait();

        expect(await vester.vestingAmount()).to.equal(award);
        expect(await vester.vestingBegin()).to.equal(startTime);
        expect(await vester.vestingCliff()).to.equal(cliffTime);
        expect(await vester.vestingEnd()).to.equal(endTime);
        expect(await vester.recipient()).to.equal(addr1.address);
        expect(await hypertoken.balanceOf(vester.address)).to.equal(award);
        expect(await hypertoken.getVotes(addr1.address)).to.equal(award);
    });
});