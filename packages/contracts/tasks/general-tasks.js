const {  HT, hAddress, timelockAddress}  = require("./constants.js");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task("transactionCount", "Get the nonce of the current account.")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

    const txCount = await owner.getTransactionCount();

    console.log("Transaction count is:", txCount);
});

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

task("cancelTx", "Send 0 ETH to cancel a transaction")
  .addParam("nonce", "current transaction count of the account")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

    const txCount = parseInt(taskArgs.nonce);
    const feeData = await owner.getFeeData();
    console.log(feeData);

    const tx = await owner.sendTransaction({
      from: owner.address,
      to: owner.address,
      value: ethers.utils.parseEther("0"),
      nonce: txCount,
      maxFeePerGas: 80000000000,
      maxPriorityFeePerGas: 80000000000, 
      gasLimit: 100000
    });
  
  console.log(tx);
  await tx.wait();

  const balS = await owner.provider.getBalance(owner.address);
  console.log("Balance of sender:", hre.ethers.utils.formatUnits(balS.toString()));
});

task("sendEth", "Send ethereum another account")
  .addParam("recipient", "Address of the recipient")
  .addParam("amount", "Amount of eth to send")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

    const recipient = taskArgs.recipient;
    const amount = taskArgs.amount;
    const tx = await owner.sendTransaction({
    from: owner.address,
    to: recipient,
    value: ethers.utils.parseEther(amount),
  });
  console.log(tx);
  await tx.wait();
  const balR = await owner.provider.getBalance(recipient);
  const balS = await owner.provider.getBalance(owner.address);


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

task("DAOBalance", "Get the hypertoken balance of the timelock of the DAO.")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

  const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, owner);

  const balance = await hypertoken.balanceOf(timelockAddress());
  console.log("DAO Balance is:", hre.ethers.utils.formatEther(balance));
});

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    let accountBalance = await account.getBalance();
    console.log(account.address, "balance:", hre.ethers.utils.formatEther(accountBalance));
  }
});

task("account", "Prints the first account", async (taskArgs, hre) => {
    const [account] = await hre.ethers.getSigners();

    let accountBalance = await account.getBalance();
    console.log(account.address, "balance:", hre.ethers.utils.formatEther(accountBalance));
  });

task("gassettings", "Prints the EIP1159 standard gas settings", async (taskArgs, hre) => {
    const [account] = await hre.ethers.getSigners();

    const feeData = await account.getFeeData();
    console.log("maxFeePerGas:",hre.ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei"), "GWei");
    console.log("maxPriorityFeePerGas:",hre.ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"), "GWei");
    console.log("gasPrice:",hre.ethers.utils.formatUnits(feeData.gasPrice, "gwei"), "GWei");

    const gasSettings = { maxFeePerGas: feeData.maxFeePerGas, 
        maxFeePerGas: ethers.utils.parseUnits("43.378112", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("42.807710", "gwei"), 
        gasLimit: ethers.utils.parseUnits("6", 6) };

        console.log("gasSettings:", gasSettings)
});