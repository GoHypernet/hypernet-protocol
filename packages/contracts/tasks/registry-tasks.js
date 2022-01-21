const { HT, RF, NFR,  BM, factoryAddress, hAddress } = require("./constants.js");
const IBEACON = require("../artifacts/@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol/UpgradeableBeacon.json")
const csv=require('csvtojson')

task("getFactoryBeaconInfo", "Prints the owners and addresses of the Beacon proxies and implementation contracts.")
  .setAction(async (taskArgs) => {

    const accounts = await hre.ethers.getSigners();
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );

    const regBeaconAddr = await factoryHandle.registryBeacon();
    const enumRegBeaconAddr = await factoryHandle.enumerableRegistryBeacon();

    const regBeaconHandle = new hre.ethers.Contract(
        regBeaconAddr,
        IBEACON.abi,
        accounts[0],
      );

    const enumRegBeaconHandle = new hre.ethers.Contract(
        enumRegBeaconAddr,
        IBEACON.abi,
        accounts[0],
      );

    const regImpleAddr = await regBeaconHandle.implementation();
    const regBeaconOwner = await regBeaconHandle.owner();
    const enumRegImplAddr = await enumRegBeaconHandle.implementation();
    const enumRegBeaconOwner = await enumRegBeaconHandle.owner();

    console.log("Registry Beacon Address:", regBeaconAddr);
    console.log("Registry Implementation Address:", regImpleAddr);
    console.log("Registry Beacon Owner:", regBeaconOwner)
    console.log("Enumerable Registry Beacon Address:", enumRegBeaconAddr);
    console.log("Enumerable Registry Implementation Address:", enumRegImplAddr);
    console.log("Enumerable Registry Beacon Owner:", enumRegBeaconOwner)
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

    const REGISTRAR_ROLE_ADMIN = registryHandle.REGISTRAR_ROLE_ADMIN();
    const registrarAdminAddress = await registryHandle.getRoleMember(
        REGISTRAR_ROLE_ADMIN,
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
    const baseURI = await registryHandle.baseURI();
    console.log("Registry Name:", name);
    console.log("Registry Symbol:", symbol);
    console.log("Base URI:", baseURI);
    console.log("Registry Address:", registryAddress);
    console.log("Registrar:", registrarAddress);
    console.log("Registrar Admin:", registrarAdminAddress);
    console.log("Number of Entries:", numberOfEntries.toString());
    console.log("Label Updating Allowed:", allowLabelChange);
    console.log("Storage Updating Allowed:", allowStorageUpdate);
    console.log("Transfers Allowed:", allowTransfers);
    console.log("Registration Token:", registrationToken);
    console.log("Registration Fee:", ethers.utils.formatEther(registrationFee.toString(),"18"));
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
  .addParam("baseuri", "Optional string to append to all registry tokenURIs")
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
    const baseURI = (taskArgs.baseuri.length ? [taskArgs.baseuri]: []);

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
          "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], string[])",
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
            burnfee,
            baseURI
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
    const prefix = await registryHandle.baseURI();
    console.log("Registry Name:", name);
    console.log("Registry Symbol:", symbol);
    console.log("Base URI:", prefix);
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

task("listRegistryEntries", "Prints all NFI entries for the specified registry.")
  .addParam("name", "Target NonFungible Registry Name.")
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

    const totalSupply = await registryHandle.totalSupply();

    let tokenId;
    let tokenURI;
    let tokenOwner;
    let tokenLabel;
    console.log("INDEX, ID, URI, OWNER, LABEL ")
    for (let i = 0; i < totalSupply; i++) {
        tokenId = await registryHandle.tokenByIndex(i);
        tokenURI = await registryHandle.tokenURI(tokenId);
        tokenOwner = await registryHandle.ownerOf(tokenId);
        tokenLabel = await registryHandle.reverseRegistryMap(tokenId);
        console.log(`${i}, ${tokenId}, ${tokenURI}, ${tokenOwner}, ${tokenLabel}`)
    }
 });

 task("batchRegister", "Mints NFIs specified in the given csv file.")
 .addParam("name", "Target NonFungible Registry Name.")
 .addParam("nfis","Path to csv file with NFI data.")
 .setAction(async (taskArgs) => {
   const name = taskArgs.name;
   const nfis = taskArgs.nfis;

   const accounts = await hre.ethers.getSigners();

   const factoryHandle = new hre.ethers.Contract(
     factoryAddress(),
     RF.abi,
     accounts[0],
   );
   const registryModulesAddress = await factoryHandle.nameToAddress("Registry Modules");
   const targetRegistryAddress = await factoryHandle.nameToAddress(name);
   const registryModulesHandle = new hre.ethers.Contract(
    registryModulesAddress,
    NFR.abi,
    accounts[0],
   );
   const batchModuleTokenId = await registryModulesHandle.registryMap("Batch Minting");
   const batchModuleAddress = await registryModulesHandle.tokenURI(batchModuleTokenId);

   const batchModuleHandle = new hre.ethers.Contract(
     batchModuleAddress,
     BM.abi,
     accounts[0],
   );

   const jsonObj = await csv().fromFile(nfis)
   const indexArr = jsonObj.map((row) => row.INDEX);
   const idArr = jsonObj.map((row) => row.ID);
   const uriArr = jsonObj.map((row) => row.URI);
   const recipArr = jsonObj.map((row) => row.OWNER);
   const labelArr = jsonObj.map((row) => row.LABEL);
   if ((indexArr.length === idArr.length) && (uriArr.length === recipArr.length) && (indexArr.length === recipArr.length)) {
       let tx = await batchModuleHandle.batchRegister(recipArr, labelArr, uriArr, idArr, targetRegistryAddress);
   } else {
       console.log("Arrays are different lengths.")
       console.log(indexArr.length)
       console.log(idArr.length)
       console.log(uriArr.length)
       console.log(recipArr.length)
       console.log(labelArr.length)
   }
   console.log("Batch Module token ID:", batchModuleTokenId.toString());
   console.log("Batch Module Address:", batchModuleAddress);
});

task("registryEntryByLabel", "Prints NonFungible Identity Data.")
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

task("registryEntryByTokenID", "Prints NonFungible Identity Data.")
  .addParam("name", "Target NonFungle Registry Name.")
  .addParam("tokenid", "NFI tokenID")
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

  task("registryEntryByIndex", "Prints NonFungible Identity Data.")
  .addParam("name", "Target NonFungle Registry Name.")
  .addParam("tokenindex", "NFI index")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const tokenindex = taskArgs.tokenindex;

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

    const tokenId = await registryHandle.tokenByIndex(tokenindex);
    const tokenURI = await registryHandle.tokenURI(tokenId);
    const tokenOwner = await registryHandle.ownerOf(tokenId);
    const tokenLabel = await registryHandle.reverseRegistryMap(tokenId);

    console.log("Owner of NFI:", tokenOwner);
    console.log("Token ID:", tokenId.toString());
    console.log("NFI Data:", tokenURI);
    console.log("NFI label:", tokenLabel);
  });

  task("tokenOfOwnerByIndex", "Prints NonFungible Identity Data.")
  .addParam("registry", "Target NonFungle Registry Name.")
  .addParam("address", "asdf")
  .addParam("tokenindex", "NFI index")
  .setAction(async (taskArgs) => {
    const registry = taskArgs.registry;
    const tokenindex = taskArgs.tokenindex;
    const address = taskArgs.address;

    const accounts = await hre.ethers.getSigners();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
    const registryAddress = await factoryHandle.nameToAddress(registry);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[0],
    );

    const addressbalance = await registryHandle.balanceOf(address);
    const tokenId = await registryHandle.tokenOfOwnerByIndex(address, tokenindex);

    console.log("account balance:", addressbalance.toString())
    console.log("Token ID:", tokenId.toString());
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

task("burnRegistryEntry", "Prints NonFungible Identity Data.")
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

    const balanceBefore = await registryHandle.balanceOf(accounts[0].address);
    const tx = await registryHandle.burn(tokenId);
    await tx.wait();
    const balanceAfter = await registryHandle.balanceOf(accounts[0].address);
    console.log("Balance before: ", balanceBefore);
    console.log("Balance after: ", balanceAfter);
  });

  task("register", "Register an NFI as the REGISTRAR_ROLE.")
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


    // call registerByToken on the NFR
    tx = await registryHandle.register(
      NFIRecipient,
      NFILabel,
      NFIData,
      tokenid,
    );
    await tx.wait(3);

    const tokenId = await registryHandle.registryMap(NFILabel);
    console.log("Token ID:", tokenId.toString());
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

    const registrationTokenAddress = await registryHandle.registrationToken();
    const registrationtoken = new hre.ethers.Contract(registrationTokenAddress, HT.abi, accounts[0]);
    // approve the transfer of tokens to the NFR
    const registrationFee = await registryHandle.registrationFee();
    let tx = await registrationtoken.approve(registryAddress, registrationFee);
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

  
task("updateTokenURI", "Update the token URI of a NFI in the specified NFR.")
.addParam("registry", "Name of target Registry where NFI is to be entered.")
.addParam("data", "Data to be written to NFI entry.")
.addParam("tokenid", "Desired token ID for NFI to be created.")
.setAction(async (taskArgs) => {
  const accounts = await hre.ethers.getSigners();

  const registryName = taskArgs.registry;
  const NFIData = taskArgs.data;
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

  // call registerByToken on the NFR
  tx = await registryHandle.updateRegistration(
    tokenid,
    NFIData,
  );
  await tx.wait();

  const updatedRegistration = await registryHandle.tokenURI(tokenid);
  console.log("New Registration Data:", updatedRegistration);
});