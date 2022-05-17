// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { RF, factoryAddress, gasSettings } = require("../tasks/constants");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const forking = hre.network.name == "hardhat"
  const ivanAddress = "0xD538fDEe65629C73cbe0d855d26E62d82ee8d1f7";
  let deployer = (await hre.ethers.getSigners())[0];

  if (forking) {
    console.log(`Running simulated deployment and upgrade test.`)
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [ivanAddress]
    })

    await hre.network.provider.send("hardhat_setBalance", [
      ivanAddress,
      ethers.utils.parseEther("100000000").toHexString()
    ])
  
    deployer = await hre.ethers.getSigner(ivanAddress);
  } else {
    console.log(`Running real deployment and upgrade.`)
    if (deployer.address != ivanAddress) {
      throw new Error(`Deployer address expected to be ${ivanAddress} but was ${deployer.address}`)
    }
  }

  console.log("Deployment Wallet Address:", deployer.address);
  console.log("RPC URL / Forking Config:", hre.network.config.forking);

  console.log(`------ Current Addresses ------`);
  await hre.run("getFactoryBeaconInfo");
  console.log(`-------------------------------\n`);
  console.log(`----- Deploying Beacons ------`);

  // deploy enumerable registry contract
  const EnumerableRegistry = await ethers.getContractFactory("NonFungibleRegistryEnumerableUpgradeable");

  const enumerableregistry = await EnumerableRegistry.deploy();
  const enumerable_registry_reciept = await enumerableregistry.deployTransaction.wait();
  console.log("New Enumerable Registry Beacon Address:", enumerableregistry.address);

  // deploy registry contract
  const Registry = await ethers.getContractFactory("NonFungibleRegistryUpgradeable",);
  const registry = await Registry.deploy();
  const registry_reciept = await registry.deployTransaction.wait();

  console.log("New Registry Beacon Address:", registry.address);
  console.log(`-------------------------------\n`);

  console.log(`------ Upgrading Beacons ------`)
  await hre.run("setFactoryBeaconEnumerable", { address: enumerableregistry.address, impersonate: "true"});
  await hre.run("setFactoryBeaconNonEnumerable", { address: registry.address, impersonate: "true" });
  console.log(`-------------------------------\n`);

  console.log(`------ Updated Addresses ------`);
  const info = await hre.run("getFactoryBeaconInfo");
  console.log(`-------------------------------\n`);

  console.log(`----- Claiming Owner on Existing Registries ------`)

  const factoryHandle = new hre.ethers.Contract(
    factoryAddress(),
    RF.abi,
    deployer
  );

  // @todo replace with claiming every existing registry
  const numEnumerableRegistries = await factoryHandle.getNumberOfEnumerableRegistries()
  const numRegistries = await factoryHandle.getNumberOfRegistries()

  for (let i = 0; i < numEnumerableRegistries; i++) {
    const enumerableRegistryAddress = await factoryHandle.enumerableRegistries(i)
    console.log(`Claiming owner on Enumerable Registry: ${enumerableRegistryAddress}`)
    let enumRegContract = await hre.ethers.getContractAt("NonFungibleRegistryEnumerableUpgradeable", enumerableRegistryAddress, deployer)
    const tx = await enumRegContract.claimOwner()
    await tx.wait()
    const enumRegOwner = await enumRegContract.owner()
    console.log(`Enumerable Registry ${enumerableRegistryAddress} owner: ${enumRegOwner}`)
  }

  for (let i = 0; i < numRegistries; i++) {
    const registryAddress = await factoryHandle.registries(i)
    console.log(`Claiming owner on Registry: ${registryAddress}`)
    let regContract = await hre.ethers.getContractAt("NonFungibleRegistryUpgradeable", registryAddress, deployer)
    const tx = await regContract.claimOwner()
    await tx.wait()
    const regOwner = await regContract.owner()
    console.log(`Registry ${registryAddress} owner: ${regOwner}`)
  }

  console.log(`----------------------------------------\n`)

  console.log(`----- Deploying New Test Registries ----`)
  const name = "TEST"; const name2 = "Test2";
  const symbol = "TST"; const symbol2 = "TST2";
  const registrar = deployer.address; const registrar2 = deployer.address;
  const enumerable = true; const enumerable2 = false;

  tx = await factoryHandle.createRegistry(
    name,
    symbol,
    registrar,
    enumerable,
    await gasSettings()
  );

  tx2 = await factoryHandle.createRegistry(
    name2,
    symbol2,
    registrar2,
    enumerable2,
    await gasSettings()
  )

  //console.log(tx);
  const tx_rcpt = await tx.wait();
  const tx_rcpt2 = await tx2.wait();

  const regAddress = await factoryHandle.nameToAddress(name);
  console.log("Enumerable Registry Deployed to:", regAddress);
  const newRegistry = await hre.ethers.getContractAt("NonFungibleRegistryEnumerableUpgradeable", regAddress);
  const newRegistryOwner = await newRegistry.owner()
  console.log(`New Enumerable Registry Owner: ${newRegistryOwner}`);

  const regAddress2 = await factoryHandle.nameToAddress(name2);
  console.log("Registry Deployed to:", regAddress2);
  const newRegistry2 = await hre.ethers.getContractAt("NonFungibleRegistryEnumerableUpgradeable", regAddress2);
  const newRegistryOwner2 = await newRegistry2.owner()
  console.log(`New Registry Owner: ${newRegistryOwner2}`);
  console.log(`----------------------------------------\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
