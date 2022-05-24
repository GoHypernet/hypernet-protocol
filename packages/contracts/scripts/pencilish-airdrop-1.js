// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
// const { NFR } = require("/tasks/constants.js");
const { NFR, gasSettings } = require("../tasks/constants.js");
const { addresses, tokenids } = require("./res/pencilish-owners.js");
const newData = require("./res/pencilish-token-ids.ts");

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

  const newtokenids = ["8675409", ...newData.map(x => x.tokenId)];
  console.log(`${newtokenids.length} new token ids`)

  for (let i = 76; i < newtokenids.length; i++) {
    const tokenid = newtokenids[i];
    const address = addresses[i];

    console.log(`${i} - Setting TokenId: ${tokenid} to Owner: ${address}`)

    await hre.run("transferEntryOwnership", { 
      registry: "Pencilish Animation Studios Early Access Mint Pass", 
      tokenid: tokenid, 
      newOwner: address })
  }
}

main()