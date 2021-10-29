const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("NFT Access Control Testing", function () {
    let hypertoken;
    let registry;
    let test;
    let owner;
    let addr1; 
    let adminTokenId; 

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();
        adminTokenId = 1; 

        // deploy hypertoken contract
        const Hypertoken = await ethers.getContractFactory("Hypertoken");
        hypertoken = await Hypertoken.deploy();
        await hypertoken.deployTransaction.wait();

        // deploy registry contract
        const UpgradableRegistry = await ethers.getContractFactory("NonFungibleRegistryEnumerableUpgradeable");
        registry = await upgrades.deployProxy(UpgradableRegistry, ["Gateways", "G", owner.address, owner.address]);
        await registry.deployed();

        // deploy the access control test contract
        const Test = await ethers.getContractFactory("Test");
        test = await upgrades.deployProxy(Test, [registry.address, adminTokenId]);
        await test.deployed();
	});

    it("Check Token Role Enforcement.", async function () {

        const ADMINROLE = test.DEFAULT_ADMIN_ROLE();
        expect(await test["hasRole(bytes32,uint256)"](ADMINROLE, adminTokenId)).to.equal(true);
        expect(await test["hasRole(bytes32,uint256)"](ADMINROLE, 2)).to.equal(false);
        expect(await test["hasRole(bytes32,uint256)"](ADMINROLE, owner.address)).to.equal(false);
    });

    it("Check Token Role Enforcement.", async function () {

        let tx = await registry.register(addr1.address, "", "dummy1", 1);
        tx.wait();
        tx = await registry.register(owner.address, "", "dummy2", 2);
        tx.wait();

        const ADMINROLE = test.DEFAULT_ADMIN_ROLE();
        expect(await test["hasRole(bytes32,address)"](ADMINROLE, addr1.address)).to.equal(true);
        expect(await test["hasRole(bytes32,address)"](ADMINROLE, owner.address)).to.equal(false);

        tx = await registry.transferFrom(addr1.address, owner.address, 1);
        tx.wait();
        expect(await test["hasRole(bytes32,address)"](ADMINROLE, addr1.address)).to.equal(false);
        expect(await test["hasRole(bytes32,address)"](ADMINROLE, owner.address)).to.equal(true);
    });
});