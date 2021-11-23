// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [owner] = await hre.ethers.getSigners();

  // deploy gateway registry
  const Registry = await ethers.getContractFactory(
    "NonFungibleRegistryUpgradeable",
  );
  const gateways = await Registry.deploy("Gateways", "Gs", owner.address);
  gateways_reciept = await gateways.deployTransaction.wait();
  console.log("Gateway Registry Address:", gateways.address);

  // deploy LP registry
  const lps = await Registry.deploy(
    "Liquidity Providers",
    "LPs",
    owner.address,
  );
  lps_reciept = await lps.deployTransaction.wait();
  console.log("LP Registry Address:", lps.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
