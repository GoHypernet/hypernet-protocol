// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
// const { NFR } = require("/tasks/constants.js");
const { NFR, gasSettings } = require("../tasks/constants.js");
const { addresses, tokenids } = require("./res/pencilish-owners.js");

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

  await hre.run("batchTransferOwnership", { registry: "Pencilish Animation Studios Early Access Mint Pass", tokenids: addresses, newOwners: tokenids })
}

main()