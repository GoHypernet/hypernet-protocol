const { RF, HT, hAddress, timelockAddress, gasSettings, factoryAddress }  = require("./constants.js");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task("transactionCount", "Get the nonce of the current account.")
.addParam("accountnumber", "Which HD account to query")
  .setAction(async (taskArgs) => {
    const acntnmbr = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();

    const txCount = await accounts[acntnmbr].getTransactionCount();

    console.log("Transaction count is:", txCount);
    console.log("Account Address:", accounts[acntnmbr].address)
});

task("getTransaction", "Get transaction details.")
.addParam("hash", "transaction hash")
  .setAction(async (taskArgs) => {
    const hash = taskArgs.hash;
    const accounts = await hre.ethers.getSigners();

    const tx = await accounts[4].provider.getTransaction(hash);
    if(tx) {
        const txrcpt = await tx.wait();
        console.log("Tx data:", tx);
        console.log("Gas Used:", txrcpt.gasUsed.toString());
    } else {
        console.log("Tx not found.");
    }
});

task("currentBlockStats", "Get the current block gas limit.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const block = await accounts[0].provider.getBlock('latest')

    console.log("Block Number:", block['number'].toString());
    console.log("Gas Limit:", block['gasLimit'].toString());
    console.log("Gas Used:", block['gasUsed'].toString());
    console.log("Number Transactions:", block['transactions'].length);
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
  .addParam("accountnumber", "Which HD account to query")
  .setAction(async (taskArgs) => {
    const acntnmbr = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();

    const txCount = parseInt(taskArgs.nonce);
    const feeData = await accounts[acntnmbr].getFeeData();
    console.log(feeData);

    const tx = await accounts[acntnmbr].sendTransaction({
      from: accounts[acntnmbr].address,
      to: accounts[acntnmbr].address,
      value: ethers.utils.parseEther("0"),
      nonce: txCount,
      maxFeePerGas: feeData.maxFeePerGas,
    });
  
  console.log(tx);
  await tx.wait();

  const balS = await accounts[acntnmbr].provider.getBalance(accounts[acntnmbr].address);
  console.log("Balance of sender:", hre.ethers.utils.formatUnits(balS.toString()));
});

task("sendEth", "Send ethereum another account")
  .addParam("recipient", "Address of the recipient")
  .addParam("amount", "Amount of eth to send")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

    const recipient = taskArgs.recipient;
    const amount = taskArgs.amount;
    const feeData = owner.feeData();

    const txData =  {
      from: owner.address,
      to: recipient,
      value: ethers.utils.parseEther(amount),
      maxFeePerGas: feeData.maxFeePerGas,
    };

    const tx = await owner.sendTransaction(txData);

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

task("account", "Prints the first account.")
  .addParam("number", "which account number on the HD wallet to look at.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const slot = taskArgs.number;

    let accountBalance = await accounts[slot].getBalance();
    console.log(accounts[slot].address, "balance:", hre.ethers.utils.formatEther(accountBalance));
});

task("gasSettings", "Prints the EIP1159 standard gas settings", async (taskArgs, hre) => {
    const [account] = await hre.ethers.getSigners();

    const feeData = await account.getFeeData();
    if (feeData.maxFeePerGas) {
        console.log("maxFeePerGas:",hre.ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei"), "GWei");
        console.log(feeData.maxFeePerGas.toString())
    }
    if (feeData.maxPriorityFeePerGas) {
        console.log("maxPriorityFeePerGas:",hre.ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"), "GWei");
    }
    if (feeData.gasPrice) {
        console.log("gasPrice:",hre.ethers.utils.formatUnits(feeData.gasPrice, "gwei"), "GWei");
        console.log(feeData.gasPrice.toString());
    }
});

task("grantAdminRole", "Grants the admin role to an account")
  .addParam("address", "which address to grant the admin role to")
  .setAction(async (taskArgs) => {
    const newAdmin = taskArgs.address

    console.log(`Granting admin role to ${newAdmin}`);

    const factory = new hre.ethers.Contract(factoryAddress(), RF.abi, (await hre.ethers.getSigners())[0]);
    const tx = await factory.grantRole("0x0000000000000000000000000000000000000000000000000000000000000000", newAdmin)
    const receipt = await tx.wait();

    console.log(`Result: ${receipt.status}`);  
});