const { HT, RF, NFR, factoryAddress, hAddress } = require("./constants.js");

task("createRegistryByToken", "Creates a registry by burning token.")
  .addParam("name", "Name of the target registry.")
  .addParam("symbol", "Symbol to give to the registry.")
  .addParam("registrar", "Address to assign the REGISTRAR_ROLE.")
  .addParam(
    "enumerable",
    "boolean indicating if the token should be enumerable or not.",
  )
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const symbol = taskArgs.symbol;
    const registrar = taskArgs.registrar;
    const enumerable = taskArgs.enumerable;

    const accounts = await hre.ethers.getSigners();

    const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );

    const regFee = await factoryHandle.registrationFee();

    // approve the registry factory to pull hypertoken from the users wallet
    let tx = await hypertoken.approve(factoryHandle.address, regFee);
    tx.wait();

    tx = await factoryHandle.createRegistryByToken(
      name,
      symbol,
      registrar,
      enumerable,
    );
    tx.wait();

    const regAddress = await factoryHandle.nameToAddress(name);
    console.log("Registry Deployed to:", regAddress);
  });

task("registryParameters", "Prints NFR  parameters.")
  .addParam("name", "Name of the target registry.")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    const REGISTRAR_ROLE = registryHandle.REGISTRAR_ROLE();
    const registrarAddress = await registryHandle.getRoleMember(
      REGISTRAR_ROLE,
      0,
    );
    const symbol = await registryHandle.symbol();
    const numberOfEntries = await registryHandle.totalSupply();
    const registrationToken = await registryHandle.registrationToken();
    const registrationFee = await registryHandle.registrationFee();
    const primaryRegistry = await registryHandle.primaryRegistry();
    console.log("Registry Name:", name);
    console.log("Registry Symbol:", symbol);
    console.log("Registry Address:", registryAddress);
    console.log("Registrar:", registrarAddress);
    console.log("Number of Entries:", numberOfEntries.toString());
    console.log("Registration Token:", registrationToken);
    console.log("Registration Fee:", registrationFee.toString());
    console.log("Primary Registry:", primaryRegistry);
  });

task("setRegistryParameters", "Set the parameters of a registry if you have the REGISTRAR_ROLE.")
  .addParam("name", "name of the Registry to update.")
  .addParam("regtoken", "address of token to use for registration by token")
  .addParam("primaryreg", "NFR for checking preregistration")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenAddress = taskArgs.regtoken;
    const primaryreg = taskArgs.primaryreg;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    const abiCoder = ethers.utils.defaultAbiCoder;

    // construct call data via ABI encoding
    let params = abiCoder.encode(
      [
        "tuple(string[], bool[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], address[])",
      ],
      [[[], [], [], [], [], [tokenAddress], [], [], [], [primaryreg]]],
    );

    const tx = await registryHandle.setRegistryParameters(params);
    tx.wait();

    const symbol = await registryHandle.symbol();
    const numberOfEntries = await registryHandle.totalSupply();
    const registrationToken = await registryHandle.registrationToken();
    const registrationFee = await registryHandle.registrationFee();
    const primaryRegistry = await registryHandle.primaryRegistry();
    console.log("Registry Name:", name);
    console.log("Registry Symbol:", symbol);
    console.log("Registry Address:", registryAddress);
    console.log("Number of Entries:", numberOfEntries.toString());
    console.log("Registration Token:", registrationToken);
    console.log("Registration Fee:", registrationFee.toString());
    console.log("Primary Registry:", primaryRegistry);
  });

task("registryEntryByLabel", "Prints NunFungible Identity Data.")
  .addParam("name", "Target NonFungle Registry Name.")
  .addParam("label", "NFI label")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const label = taskArgs.label;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    const tokenId = await registryHandle.registryMap(label);
    const tokenURI = await registryHandle.tokenURI(tokenId);
    const tokenOwner = await registryHandle.ownerOf(tokenId);

    console.log("Owner of NFI:", tokenOwner);
    console.log("Token ID:", tokenId.toString());
    console.log("NFI Data:", tokenURI);
  });

task("registryEntryByTokenID", "Prints NunFungible Identity Data.")
  .addParam("name", "Target NonFungle Registry Name.")
  .addParam("tokenid", "NFI label")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenId = taskArgs.tokenid;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    const tokenURI = await registryHandle.tokenURI(tokenId);
    const tokenOwner = await registryHandle.ownerOf(tokenId);

    console.log("Owner of NFI:", tokenOwner);
    console.log("Token ID:", tokenId.toString());
    console.log("NFI Data:", tokenURI);
  });

task("transferEntryByTokenID", "Transfers a token to a specified participant.")
  .addParam("name", "Target NonFungle Registry Name")
  .addParam("tokenid", "NFI tokenId")
  .addParam("recipient", "Wallet address of the reciever")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenId = taskArgs.tokenid;
    const recipient = taskArgs.recipient;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    const tokenOwner = await registryHandle.ownerOf(tokenId);

    let tx = await registryHandle.transferFrom(tokenOwner, recipient, tokenId);
    tx.wait();

    const newTokenOwner = await registryHandle.ownerOf(tokenId);

    console.log("New owner of NFI:", newTokenOwner);
  });

task("burnRegistryEntry", "Prints NunFungible Identity Data.")
  .addParam("name", "Target NonFungle Registry Name.")
  .addParam("tokenid", "token ID of the NFI.")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenId = taskArgs.tokenid;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
    const registryAddress = await factoryHandle.nameToAddress(name);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    const balanceBefore = awaite.registryHandle.balanceOf(accounts[0].address);
    const tx = await registryHandle.burn(tokenId);
    tx.wait();
    const balanceAfter = awaite.registryHandle.balanceOf(accounts[0].address);
    console.log("Balance before: ", balanceBefore);
    console.log("Balance after: ", balanceAfter);
  });

task("registerWithToken", "Register an NFI with ERC20 token.")
  .addParam("registry", "Name of target Registry where NFI is to be entered.")
  .addParam("label", "NFI label.")
  .addParam("data", "Data to be written to NFI entry.")
  .addParam("recipient", "Recipient address of the NFI.")
  .addParam("tokenid", "Desired token ID for NFI to be created.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const registryName = taskArgs.registry;
    const NFILabel = taskArgs.label;
    const NFIData = taskArgs.data;
    const NFIRecipient = taskArgs.recipient;
    const tokenid = taskArgs.tokenid;

    const hypertoken = new hre.ethers.Contract(hAddress(), HT.abi, accounts[0]);
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );

    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    // approve the transfer of tokens to the NFR
    const registrationFee = await registryHandle.registrationFee();
    let tx = await hypertoken.approve(registryAddress, registrationFee);
    tx.wait();

    // call registerByToken on the NFR
    tx = await registryHandle.registerByToken(
      NFIRecipient,
      NFILabel,
      NFIData,
      tokenid,
    );
    tx.wait();

    const tokenId = await registryHandle.registryMap(NFILabel);
    console.log("Token ID:", tokenId.toString());
  });

task(
  "burnToken",
  "Burn a token in the given registry if you are owner or registrar.",
)
  .addParam("registry", "Name of target Registry where NFI is to be entered.")
  .addParam("tokenid", "tokenID of the NFI (not the index or label)")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const registryName = taskArgs.registry;
    const tokenid = taskArgs.tokenid;

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );

    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    const tokenOwner = await registryHandle.ownerOf(tokenid);
    console.log("Owner Address:", tokenOwner);

    // call registerByToken on the NFR
    tx = await registryHandle.burn(tokenid);
    tx.wait();

    const balanceAfter = await registryHandle.balanceOf(tokenOwner);

    console.log(
      "Balance of ",
      tokenOwner,
      "after burn is",
      balanceAfter.toString(),
    );
  });
