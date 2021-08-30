const { expect } = require("chai");
const { ethers } = require("hardhat")
const { BN, expectRevert } = require('@openzeppelin/test-helpers')
const NFR = require("../artifacts/contracts/NonFungibleRegistry.sol/NonFungibleRegistry.json")

describe("Registry Factory", function () {
  it("Test Registry Factory.", async function () {
    // get signers
    const [owner, addr1] = await ethers.getSigners()

    const registryName = "Gateways"
    const registrySymbol = "HNG"

    // deploy hypertoken contract
    const FactoryRegistry = await ethers.getContractFactory("RegistryFactory");
    const factoryregistry = await FactoryRegistry.deploy();
    registry_reciept = await factoryregistry.deployTransaction.wait();
    console.log("Factory Address:", factoryregistry.address)

    const factorytx = await factoryregistry.createRegistry(registryName, registrySymbol, owner.address);
    const factorytx_rcpt = await factorytx.wait(); 
    const registryAddress = factorytx_rcpt["events"][0]["address"];
    console.log("Registry Address:", registryAddress)

    const registryHandle = new ethers.Contract(registryAddress, NFR.abi, owner)
    expect(await registryHandle.name()).to.equal(registryName)
    expect(await registryHandle.symbol()).to.equal(registrySymbol)
    expect(await factoryregistry.registries(0)).to.equal(registryAddress)

  });
});