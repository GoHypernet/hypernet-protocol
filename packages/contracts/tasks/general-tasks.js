const {  HT, hAddress}  = require("./constants.js");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("sendhypertoken", "Send hypertoken to another account")
  .addParam("recipient", "Address of the recipient")
  .addParam("amount", "Amount of Hypertoken to send")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

  const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, owner);
  const recipient = taskArgs.recipient;
  const amount = taskArgs.amount;
  const tx = await hypertoken.transfer(recipient, amount);
  const tx_rcpt = await tx.wait();
  const balR = await hypertoken.balanceOf(recipient);
  const balS = await hypertoken.balanceOf(owner.address);


  console.log("Balance of sender:", balS.toString());
  console.log("Balance of recipient:", balR.toString());
});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("hypertokenBalance", "Get the hypertoken balance of an address.")
  .addParam("address", "ethereum address of interest.")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

  const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, owner);
  const address = taskArgs.address;

  const balance = await hypertoken.balanceOf(address);
  console.log("Balance of", address, "is", hre.ethers.utils.formatEther(balance));
});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    let accountBalance = await account.getBalance();
    console.log(account.address, "balance:", hre.ethers.utils.formatEther(accountBalance));
  }
});



