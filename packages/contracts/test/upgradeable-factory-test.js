const { BN, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NFR = require("../artifacts/contracts/identity/NonFungibleRegistryEnumerableUpgradeable.sol/NonFungibleRegistryEnumerableUpgradeable.json");

describe("Registry Factory Unit Tests", function () {
  let hypertoken;
  let registryfactory;
  let profileReg;
  let owner;
  let addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();

    const Hypertoken = await ethers.getContractFactory("Hypertoken");
    hypertoken = await Hypertoken.deploy();
    await hypertoken.deployTransaction.wait();

    let tx = await hypertoken.transfer(
      addr1.address,
      ethers.utils.parseEther("100"),
    );
    tx.wait();

    // deploy enumerable registry contract
    const EnumerableRegistry = await ethers.getContractFactory(
      "NonFungibleRegistryEnumerableUpgradeable",
    );
    const enumerableregistry = await EnumerableRegistry.deploy();
    enumerableregistry.deployTransaction.wait();

    // deploy registry contract
    const Registry = await ethers.getContractFactory(
      "NonFungibleRegistryUpgradeable",
    );
    const registry = await Registry.deploy();
    registry.deployTransaction.wait();

    // deploy factory contract
    const RegistryFactory = await ethers.getContractFactory(
      "UpgradeableRegistryFactory",
    );
    registryfactory = await RegistryFactory.deploy(
      owner.address,
      ["Hypernet Profiles"],
      ["HPs"],
      [owner.address],
      enumerableregistry.address,
      registry.address,
      hypertoken.address,
    );
    await registryfactory.deployTransaction.wait();

    const profileRegAddress = await registryfactory.nameToAddress("Hypernet Profiles");
    profileReg = new ethers.Contract(profileRegAddress, NFR.abi, owner);

    // create a profile NFI for the deployer account
    tx = await profileReg.register(owner.address, "owner", "myprofile", 1);
    tx.wait();
  });

  it("Check the constructor-deployed registries.", async function () {
    expect(await profileReg.name()).to.equal("Hypernet Profiles");
    expect(await profileReg.symbol()).to.equal("HPs");
    expect(await profileReg.totalSupply()).to.equal(1);
    expect(await registryfactory.hypernetProfileRegistry()).to.equal(profileReg.address);
  });

  it("Test createRegistry with enumeration.", async function () {
    const registryName = "Test";
    const registrySymbol = "T";
    const profileRegAddress = await registryfactory.nameToAddress("Hypernet Profiles");

    let tx = await registryfactory.createRegistry(
      registryName,
      registrySymbol,
      owner.address,
      true,
    );
    txrcpt = await tx.wait();

    const registryAddress = await registryfactory.nameToAddress(registryName);

    const registryHandle = new ethers.Contract(registryAddress, NFR.abi, owner);

    expect(await registryHandle.name()).to.equal(registryName);
    expect(await registryHandle.symbol()).to.equal(registrySymbol);
    expect(await registryHandle.totalSupply()).to.equal(0);
    expect(await registryHandle.primaryRegistry()).to.equal(profileRegAddress);
    expect(await registryfactory.getNumberOfEnumerableRegistries()).to.equal(2);
    expect(await registryfactory.getNumberOfRegistries()).to.equal(0);
  });

  it("Test createRegistry without enumeration.", async function () {
    const registryName = "Test";
    const registrySymbol = "T";
    const profileRegAddress = await registryfactory.nameToAddress("Hypernet Profiles");

    let tx = await registryfactory.createRegistry(
      registryName,
      registrySymbol,
      owner.address,
      false,
    );
    txrcpt = await tx.wait();

    const registryAddress = await registryfactory.nameToAddress(registryName);

    const registryHandle = new ethers.Contract(registryAddress, NFR.abi, owner);

    expect(await registryHandle.name()).to.equal(registryName);
    expect(await registryHandle.symbol()).to.equal(registrySymbol);
    expect(await registryHandle.primaryRegistry()).to.equal(profileRegAddress);
    expect(await registryfactory.getNumberOfEnumerableRegistries()).to.equal(1);
    expect(await registryfactory.getNumberOfRegistries()).to.equal(1);
  });

  it("Prevent duplicate names.", async function () {
    // can't create two registries with the same name
    await expectRevert(
      registryfactory.createRegistry("Hypernet Profiles", "HPs", owner.address, true),
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
        true,
      ),
      "RegistryFactory: Registrar address must not be 0.",
    );
  });

  it("Register by token is disabled when registrationToken is 0 address.", async function () {
    let tx = await registryfactory.setRegistrationToken(
      "0x0000000000000000000000000000000000000000",
    );
    tx.wait();

    // can't create two registries with the same name
    await expectRevert(
      registryfactory.createRegistryByToken("Dummy", "d", owner.address, true),
      "RegistryFactory: registration by token not enabled.",
    );
  });

  it("Only admin can enable token-based registry creation.", async function () {
    // can't set registration token with admin role
    await expectRevert(
      registryfactory.connect(addr1).setRegistrationToken(hypertoken.address),
      "RegistryFactory: must have admin role to create a registry",
    );

    let tx = await registryfactory.setRegistrationToken(hypertoken.address);
    tx.wait();

    expect(await registryfactory.registrationToken()).to.equal(
      hypertoken.address,
    );
  });

  it("Only admin can add or remove a module to the module list.", async function () {
    // first deploy a module contract
    const BatchModule = await ethers.getContractFactory("BatchModule");
    batchmodule = await BatchModule.deploy("Batch Minting");
    await batchmodule.deployTransaction.wait();

    // can't add a module without admin role
    await expectRevert(
      registryfactory.connect(addr1).addModule(batchmodule.address),
      "RegistryFactory: must have admin role to add module",
    );

    let tx = await registryfactory.addModule(batchmodule.address);
    tx.wait();

    expect(await registryfactory.getNumberOfModules()).to.equal(1);
    expect(await registryfactory.modules(0)).to.equal(batchmodule.address);

    // can't remove a module with admin role
    await expectRevert(
        registryfactory.connect(addr1).removeModule(0),
        "RegistryFactory: must have admin role to remove module",
    );

    tx = await registryfactory.removeModule(0);
    tx.wait();

    expect(await registryfactory.getNumberOfModules()).to.equal(0);
  });

  it("Only admin can set burn address.", async function () {
    // can't set burn address without the admin role
    await expectRevert(
      registryfactory.connect(addr1).setBurnAddress(registryfactory.address),
      "RegistryFactory: must have admin role to create a registry",
    );

    let tx = await registryfactory.setBurnAddress(registryfactory.address);
    tx.wait();
    expect(await registryfactory.burnAddress()).to.equal(
      registryfactory.address,
    );
  });

  it("Only admin can set registration fee.", async function () {
    // can't set fee amount with admin role
    await expectRevert(
      registryfactory
        .connect(addr1)
        .setRegistrationFee(ethers.utils.parseEther("100")),
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

    // ensure that the the user has a hypernet profile first
    await expectRevert(
      registryfactory
        .connect(addr1)
        .createRegistryByToken("dummy", "dmy", addr1.address, true),
      "RegistryFactory: caller must have a Hypernet Profile.",
    );

    tx = await profileReg.register(addr1.address, "addr1", "myprofile", 42069);
    tx.wait();

    // be sure you have hypertoken
    await expectRevert(
        registryfactory
          .connect(addr1)
          .createRegistryByToken("dummy", "dmy", addr1.address, true),
        "ERC20: transfer amount exceeds allowance",
    );

    // get the registry deployment fee amount and fee burn address
    let fee = await registryfactory.registrationFee();
    let burnAddress = await registryfactory.burnAddress();

    // must approve the registry factory to pull the fee amount
    tx = await hypertoken.connect(addr1).approve(registryfactory.address, fee);
    tx.wait();

    const previousBalance = await hypertoken.balanceOf(burnAddress);

    // create a test registry
    tx = await registryfactory
      .connect(addr1)
      .createRegistryByToken("enumerabledummy", "edmy", addr1.address, true);
    tx.wait();

    let registryAddress = await registryfactory.nameToAddress(
      "enumerabledummy",
    );
    const dummyReg = new ethers.Contract(registryAddress, NFR.abi, addr1);

    // check the token balances of the creator and burn address
    expect(await registryfactory.getNumberOfEnumerableRegistries()).to.equal(2);
    expect(await hypertoken.balanceOf(addr1.address)).to.equal(fee);
    expect(await hypertoken.balanceOf(burnAddress)).to.equal(
      previousBalance.add(fee),
    );
    expect(await dummyReg.name()).to.equal("enumerabledummy");
    expect(await dummyReg.symbol()).to.equal("edmy");

    tx = await hypertoken.connect(addr1).approve(registryfactory.address, fee);
    tx.wait();

    tx = await registryfactory
      .connect(addr1)
      .createRegistryByToken("dummy", "dmy", addr1.address, false);
    tx.wait();
  });
});
