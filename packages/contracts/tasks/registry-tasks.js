const { HT, RF, NFR, factoryAddress, hAddress } = require("./constants.js");

task("numberOfModules", "Get the number of available modules.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );

    const numModules = await factoryHandle.getNumberOfModules();
    console.log("Number of Official Modules:", numModules.toString());
  });

  task("getModuleName", "Get the name of a Module at a given index.")
  .addParam("index", "Index of the module in the registry factory array.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const index = taskArgs.index; 

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );

    const moduleAddress = await factoryHandle.modules(index);
    const moduleABI = [
        {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    const moduleHandle = new hre.ethers.Contract(moduleAddress, moduleABI, accounts[0]); 
    const name = await moduleHandle.name();
    console.log("Module Address:", moduleAddress);
    console.log("Number of Official Modules:", name);
  });

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
    await tx.wait(3);

    tx = await factoryHandle.createRegistryByToken(
      name,
      symbol,
      registrar,
      enumerable,
    );
    await tx.wait(2);

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
    const allowLabelChange = await registryHandle.allowLabelChange();
    const allowStorageUpdate = await registryHandle.allowStorageUpdate();
    const allowTransfers = await registryHandle.allowTransfers();
    const registrationFee = await registryHandle.registrationFee();
    const primaryRegistry = await registryHandle.primaryRegistry();
    console.log("Registry Name:", name);
    console.log("Registry Symbol:", symbol);
    console.log("Registry Address:", registryAddress);
    console.log("Registrar:", registrarAddress);
    console.log("Number of Entries:", numberOfEntries.toString());
    console.log("Label Updating Allowed:", allowLabelChange);
    console.log("Storage Updating Allowed:", allowStorageUpdate);
    console.log("Transfers Allowed:", allowTransfers);
    console.log("Registration Token:", registrationToken);
    console.log("Registration Fee:", registrationFee.toString());
    console.log("Primary Registry:", primaryRegistry);
  });

task("setRegistryParameters", "Set the parameters of a registry if you have the REGISTRAR_ROLE.")
  .addParam("name", "Name of target Registry to update.")
  .addParam("schema", "New schema field.")
  .addParam("storageupdate", "Boolean flag to all updating storage.")
  .addParam("labelchange", "Boolean flag to udpate NFI labels")
  .addParam("allowtransfers", "Boolean flag to allow NFI transfers")
  .addParam("registrationtoken", "Address of ERC20 token to use for token-based registration")
  .addParam("registrationfee", "Amount of registration token needed to create an NFI")
  .addParam("burnaddress","Address where burned tokens will be sent")
  .addParam("burnfee", "percentage of registration token to burn (<=10000)")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const schema = (taskArgs.schema.length ? [taskArgs.schema]: []);
    const storageupdate = (taskArgs.storageupdate.length ? [taskArgs.storageupdate == 'true']: []);
    const labelchange = (taskArgs.labelchange.length ? [taskArgs.labelchange == 'true']: []);
    const allowtransfers = (taskArgs.allowtransfers.length ? [taskArgs.allowtransfers == 'true']: []);
    const registrationtoken = (taskArgs.registrationtoken.length ? [taskArgs.registrationtoken] : []);
    const registrationfee = (taskArgs.registrationfee.length ? [taskArgs.registrationfee]: []);
    const burnaddress = (taskArgs.burnaddress.length ? [taskArgs.burnaddress]: []);
    const burnfee = (taskArgs.burnfee.length ? [taskArgs.burnfee]: []);

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
          "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[])",
        ],
        [
            [
            schema, 
            storageupdate, 
            labelchange, 
            allowtransfers, 
            registrationtoken, 
            registrationfee, 
            burnaddress, 
            burnfee
            ]
        ],
      );

    const tx = await registryHandle.setRegistryParameters(params);
    await tx.wait(3);

    const REGISTRAR_ROLE = registryHandle.REGISTRAR_ROLE();
    const registrarAddress = await registryHandle.getRoleMember(
      REGISTRAR_ROLE,
      0,
    );
    const symbol = await registryHandle.symbol();
    const numberOfEntries = await registryHandle.totalSupply();
    const registrationToken = await registryHandle.registrationToken();
    const allowLabelChange = await registryHandle.allowLabelChange();
    const allowStorageUpdate = await registryHandle.allowStorageUpdate();
    const allowTransfers = await registryHandle.allowTransfers();
    const registrationFee = await registryHandle.registrationFee();
    const primaryRegistry = await registryHandle.primaryRegistry();
    console.log("Registry Name:", name);
    console.log("Registry Symbol:", symbol);
    console.log("Registry Address:", registryAddress);
    console.log("Registrar:", registrarAddress);
    console.log("Number of Entries:", numberOfEntries.toString());
    console.log("Label Updating Allowed:", allowLabelChange);
    console.log("Storage Updating Allowed:", allowStorageUpdate);
    console.log("Transfers Allowed:", allowTransfers);
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
    const tokenLabel = await registryHandle.reverseRegistryMap(tokenId);

    console.log("Owner of NFI:", tokenOwner);
    console.log("Token ID:", tokenId.toString());
    console.log("NFI Data:", tokenURI);
    console.log("NFI label:", tokenLabel);
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
    const tokenLabel = await registryHandle.reverseRegistryMap(tokenId);

    console.log("Owner of NFI:", tokenOwner);
    console.log("Token ID:", tokenId.toString());
    console.log("NFI Data:", tokenURI);
    console.log("NFI label:", tokenLabel);
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
    await tx.wait();

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
    await tx.wait();
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
    await tx.wait(3);

    // call registerByToken on the NFR
    tx = await registryHandle.registerByToken(
      NFIRecipient,
      NFILabel,
      NFIData,
      tokenid,
    );
    await tx.wait(3);

    const tokenId = await registryHandle.registryMap(NFILabel);
    console.log("Token ID:", tokenId.toString());
  });