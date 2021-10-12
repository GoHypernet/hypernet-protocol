const { expect } = require("chai");
const { ethers } = require("hardhat")
const { BN, expectRevert } = require('@openzeppelin/test-helpers')
const NFR = require("../artifacts/contracts/NonFungibleRegistryUpgradeable.sol/NonFungibleRegistryUpgradeable.json")

describe("Registry Factory Unit Tests", function () {
    
    let registryfactory; 
    let owner;
    let addr1;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners()

        // deploy factory contract
        const RegistryFactory = await ethers.getContractFactory("UpgradeableRegistryFactory");
        registryfactory = await RegistryFactory.deploy(owner.address, ["Test"], ["t"], [owner.address]);
        await registryfactory.deployTransaction.wait();
	});

    it("Check the constructor-deployed registries.", async function () {
        const testRegAddress = await registryfactory.nameToAddress("Test");
        const testReg = new ethers.Contract(testRegAddress, NFR.abi, owner);

        let tx = await testReg.register(addr1.address, "dummy", "dummy");
        let txrcpt = tx.wait();

        tx = await testReg.register(addr1.address, "", "dummy");
        txrcpt = tx.wait();

        expect(await testReg.name()).to.equal("Test");
        expect(await testReg.symbol()).to.equal("t");
        expect(await testReg.totalSupply()).to.equal(2);
    });

    it("Test createRegistry.", async function () {
        const registryName = "Gateways";
        const registrySymbol = "HNG";

        let tx = await registryfactory.createRegistry(registryName, registrySymbol, owner.address);
        txrcpt = await tx.wait(); 

        const registryAddress = await registryfactory.nameToAddress(registryName);

        const registryHandle = new ethers.Contract(registryAddress, NFR.abi, owner);

        expect(await registryHandle.name()).to.equal(registryName);
        expect(await registryHandle.symbol()).to.equal(registrySymbol);
        expect(await registryHandle.totalSupply()).to.equal(0);
    });

    it("Prevent duplicate names.", async function () {
        // can't create two registries with the same name
        await expectRevert(
            registryfactory.createRegistry(
                "Test",
                "t",
                owner.address,
            ),
            "RegistryFactory: Registry by that name exists.",
        );
    });

    it("Prevent ownership by 0 address.", async function () {
        // can't create two registries with the same name
        await expectRevert(
                registryfactory.createRegistry(
                "Dummy",
                "d",
                "0x0000000000000000000000000000000000000000",
            ),
            "RegistryFactory: Registrar address must not be 0.",
          );
    });
});