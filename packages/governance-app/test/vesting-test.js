const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("Vesting", function () {
  it("Test vesting contract.", async function () {
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

    const award = 100
    const timeNow = Date.now()
    const startTime = timeNow
    const cliffTime = timeNow+30
    const endTime = timeNow+60
    // deploy Vesting contract
    const Vester = await ethers.getContractFactory("Vester");
    const vester = await Vester.deploy(hypertoken.address, addr1.address, award, startTime, cliffTime, endTime);
    await vester.deployTransaction.wait();

    const tx1 = await hypertoken.transfer(vester.address, award)
    const tx1_reciept = await tx1.wait()

    expect(await vester.vestingAmount()).to.equal(award)
    expect(await vester.vestingBegin()).to.equal(startTime)
    expect(await vester.vestingCliff()).to.equal(cliffTime)
    expect(await vester.vestingEnd()).to.equal(endTime)
    expect(await vester.recipient()).to.equal(addr1.address)
    expect(await hypertoken.balanceOf(vester.address)).to.equal(award)
  });
});