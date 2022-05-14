// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { gasSettings } = require("../tasks/constants.js");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [owner] = await hre.ethers.getSigners();
  console.log("Deployment Wallet Address:", owner.address);
  console.log("RPC URL:", hre.network.config.url);

  // deploy enumerable registry contract
  const EnumerableRegistry = await ethers.getContractFactory(
    "NonFungibleRegistryEnumerableUpgradeable",
  );
  const enumerableregistry = await EnumerableRegistry.deploy(await gasSettings());
  const enumerable_registry_reciept =
    await enumerableregistry.deployTransaction.wait();
  console.log(
    "Enumerable Registry Beacon Address:",
    enumerableregistry.address,
  );
  console.log(
    "Factory Gas Fee:",
    enumerable_registry_reciept.gasUsed.toString(),
  );

  // deploy registry contract
  const Registry = await ethers.getContractFactory(
    "NonFungibleRegistryUpgradeable",
  );
  const registry = await Registry.deploy(await gasSettings());
  const registry_reciept = await registry.deployTransaction.wait();
  console.log("Registry Beacon Address:", registry.address);
  console.log("Registry Gas Fee:", registry_reciept.gasUsed.toString());

  // verify on etherscan if needed
  await hre.run("verify:verify", {
    address: enumerableregistry.address,
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: registry.address,
    constructorArguments: []
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
