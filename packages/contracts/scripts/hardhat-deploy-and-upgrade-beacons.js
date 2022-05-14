// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [owner] = await hre.ethers.getSigners();
  console.log("Deployment Wallet Address:", owner.address);
  console.log("RPC URL / Forking Config:", hre.network.config.forking);

  console.log(`------ Current Addresses ------`);
  await hre.run("getFactoryBeaconInfo");
  console.log(`-------------------------------\n`);
  console.log(`----- Deploying Beacons ------`);

  // deploy enumerable registry contract
  const EnumerableRegistry = await ethers.getContractFactory(
    "NonFungibleRegistryEnumerableUpgradeable",
  );
  const enumerableregistry = await EnumerableRegistry.deploy();
  const enumerable_registry_reciept =
    await enumerableregistry.deployTransaction.wait();
  console.log(
    "New Enumerable Registry Beacon Address:",
    enumerableregistry.address,
  );

  // deploy registry contract
  const Registry = await ethers.getContractFactory(
    "NonFungibleRegistryUpgradeable",
  );

  const registry = await Registry.deploy();
  const registry_reciept = await registry.deployTransaction.wait();
  console.log("New Registry Beacon Address:", registry.address);
  console.log(`-------------------------------\n`);

  console.log(`------ Upgrading Beacons ------`)
  await hre.run("setFactoryBeaconEnumerable", { address: enumerableregistry.address, impersonate: "true"});
  await hre.run("setFactoryBeaconNonEnumerable", { address: registry.address, impersonate: "true" });
  console.log(`-------------------------------\n`);

  console.log(`------ Updated Addresses ------`);
  await hre.run("getFactoryBeaconInfo");
  console.log(`-------------------------------\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
