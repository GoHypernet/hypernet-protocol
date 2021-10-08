const { expect } = require("chai");
const { ethers } = require("hardhat")
const { BN, expectRevert } = require('@openzeppelin/test-helpers')
const NFR = require("../artifacts/contracts/NonFungibleRegistryUpgradeable.sol/NonFungibleRegistryUpgradeable.json")

describe("Registry Factory Unit Tests", function () {
    
    let hypertoken;
    let registryfactory; 
    let owner;
    let addr1;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners()

        const Hypertoken = await ethers.getContractFactory("Hypertoken");
        hypertoken = await Hypertoken.deploy();
        await hypertoken.deployTransaction.wait();

        let tx = await hypertoken.transfer(addr1.address, ethers.utils.parseEther("100"));
        tx.wait();

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

    it("Register By token is disabled by default.", async function () {
        // can't create two registries with the same name
        await expectRevert(
                registryfactory.createRegistryByToken(
                "Dummy",
                "d",
                owner.address,
            ),
            "RegistryFactory: registration by token not enabled.",
          );
    });

    it("Only admin can enable token-based registry creation.", async function () {
        // can't create two registries with the same name
        await expectRevert(
                registryfactory.connect(addr1).setRegistrationToken(
                    hypertoken.address
                ),
            "RegistryFactory: must have admin role to create a registry",
        );
        let tx = await registryfactory.setRegistrationToken(hypertoken.address); 
        tx.wait();
        expect(await registryfactory.registrationToken()).to.equal(hypertoken.address);
    });

    it("Only admin can set burn address.", async function () {
        // can't create two registries with the same name
        await expectRevert(
                registryfactory.connect(addr1).setBurnAddress(
                    registryfactory.address
                ),
            "RegistryFactory: must have admin role to create a registry",
        );

        let tx = await registryfactory.setBurnAddress(registryfactory.address); 
        tx.wait();
        expect(await registryfactory.burnAddress()).to.equal(registryfactory.address);
    });

    it("Only admin can set registration fee.", async function () {
        // can't create two registries with the same name
        await expectRevert(
                registryfactory.connect(addr1).setRegistrationFee(
                    ethers.utils.parseEther("100")
                ),
            "RegistryFactory: must have admin role to create a registry",
        );

        let fee = ethers.utils.parseEther("100");
        let tx = await registryfactory.setRegistrationFee(fee); 
        tx.wait();
        expect(await registryfactory.registrationFee()).to.equal(fee);
    });

    it("Check Register by token feature.", async function () {
        // can't create two registries with the same name
        let tx = await registryfactory.setRegistrationToken(hypertoken.address);
        tx.wait();

        await expectRevert(
            registryfactory.connect(addr1).createRegistryByToken(
                "dummy",
                "dmy",
                addr1.address
            ),
        "ERC20: transfer amount exceeds allowance",
        );

        let fee = await registryfactory.registrationFee();
        let burnAddress = await registryfactory.burnAddress();

        tx = await hypertoken.connect(addr1).approve(registryfactory.address, fee);
        tx.wait();

        tx = await registryfactory.connect(addr1).createRegistryByToken("dummy", "dmy", addr1.address);
        tx.wait();

        let registryAddress = await registryfactory.nameToAddress("dummy");
        const dummyReg = new ethers.Contract(registryAddress, NFR.abi, addr1);

        expect(await registryfactory.getNumberOfRegistries()).to.equal(2);
        expect(await hypertoken.balanceOf(addr1.address)).to.equal(fee);
        expect(await hypertoken.balanceOf(burnAddress)).to.equal(fee);
        expect(await hypertoken.balanceOf(burnAddress)).to.equal(fee);
        expect(await dummyReg.name()).to.equal("dummy");
        expect(await dummyReg.symbol()).to.equal("dmy");
    });
});