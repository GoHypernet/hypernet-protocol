const { HT, RF, NFR,  BM, IBEACON, factoryAddress, hAddress, gasSettings } = require("./constants.js");
const csv=require('csvtojson');

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

    return {
      registry: {
        beacon: regBeaconAddr,
        implementation: regImpleAddr,
        owner: regBeaconOwner
      },
      enumerableRegistry: {
        beacon: enumRegBeaconAddr,
        implementation: enumRegImplAddr,
        owner: enumRegBeaconOwner
      }
    }
  });

task("setFactoryBeaconEnumerable", "Update the implementation address of the enumerable NFR beacon.")
  .addParam("address", "Address of the new implemenation.")
  //.addOptionalParam("impersonate", "If we should impersonate the owner of the contract.")
  .setAction(async (taskArgs) => {
    const [account] = await hre.ethers.getSigners();
    //const shouldImpersonate = taskArgs.impersonate;
    //if (shouldImpersonate) console.log(`Will impersonate the owner.`);

    const newImpl = taskArgs.address;
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF().abi,
      account,
    );

    const enumRegBeaconAddr = await factoryHandle.enumerableRegistryBeacon();

    let enumRegBeaconHandle = new hre.ethers.Contract(
        enumRegBeaconAddr,
        IBEACON.abi,
        account,
    );

    /*
    if (shouldImpersonate) {
      const owner = await enumRegBeaconHandle.owner();

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [owner]
      })

      await network.provider.send("hardhat_setBalance", [
        owner,
        "0xFFFFFFFFFFFFFF",
      ]);

      const ownerSigner = await hre.ethers.getSigner(owner);

      enumRegBeaconHandle = enumRegBeaconHandle.connect(ownerSigner)
    }*/

    // set the new implementation address
    let tx = await enumRegBeaconHandle.upgradeTo(newImpl);
    let txrcp = await tx.wait();

    const enumRegImplAddr = await enumRegBeaconHandle.implementation();
    const enumRegBeaconOwner = await enumRegBeaconHandle.owner();

    console.log("Enumerable Registry Implementation Address:", enumRegImplAddr);
    console.log("Enumerable Registry Beacon Owner:", enumRegBeaconOwner);
    //console.log("Gas Used:", txrcp.gasUsed.toString());
  });

task("setFactoryBeaconNonEnumerable", "Update the implementation address of the non-enumerable NFR beacon.")
  .addParam("address", "Address of the new implemenation.")
  //.addOptionalParam("impersonate", "If we should impersonate the owner of the contract.")
  .setAction(async (taskArgs) => {
    const [account] = await hre.ethers.getSigners();
    //const shouldImpersonate = taskArgs.impersonate;
    //if (shouldImpersonate) console.log(`Will impersonate the owner.`);

    const newImpl = taskArgs.address;
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      account,
    );

    const regBeaconAddr = await factoryHandle.registryBeacon();

    let regBeaconHandle = new hre.ethers.Contract(
        regBeaconAddr,
        IBEACON.abi,
        account,
    );

    /*if (shouldImpersonate) {
      const owner = await regBeaconHandle.owner();

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [owner]
      })

      await network.provider.send("hardhat_setBalance", [
        owner,
        "0xFFFFFFFFFFFFFF",
      ]);

      const ownerSigner = await hre.ethers.getSigner(owner);

      regBeaconHandle = regBeaconHandle.connect(ownerSigner)
    }*/

    // set the new implementation address
    let tx = await regBeaconHandle.upgradeTo(newImpl);
    let txrcp = await tx.wait();

    const regImplAddr = await regBeaconHandle.implementation();
    const regBeaconOwner = await regBeaconHandle.owner();

    console.log("Non-Enumerable Registry Implementation Address:", regImplAddr);
    console.log("Non-Enumerable Registry Beacon Owner:", regBeaconOwner);
  });

task("setPrimaryRegistry", "Sets primaryRegistry parameter of target NFR.")
  .addParam("name", "Name of the target registry.")
  .addParam("primaryregistry", "Symbol to give to the registry.")
  .setAction(async (taskArgs) => {
    const name = taskArgs.name;
    const primaryregistry = taskArgs.primaryregistry;

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

    tx = await registryHandle.setPrimaryRegistry(
        primaryregistry,
        await gasSettings()
    );
    const tx_rcpt = await tx.wait();
    console.log("Primary Registry Set");
  });

  task("createRegistry", "Creates a registry if you are the factory admin.")
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
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );

    tx = await factoryHandle.createRegistry(
      name,
      symbol,
      registrar,
      enumerable,
      await gasSettings()
    );
    console.log(tx);
    const tx_rcpt = await tx.wait();

    const regAddress = await factoryHandle.nameToAddress(name);
    console.log("Registry Deployed to:", regAddress);
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
    let tx_rcpt = await tx.wait();

    tx = await factoryHandle.createRegistryByToken(
      name,
      symbol,
      registrar,
      enumerable,
      await gasSettings(),
    );
    tx_rcpt = await tx.wait();

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
      await gasSettings(),
    );

    const REGISTRAR_ROLE = registryHandle.REGISTRAR_ROLE();
    const registrarAddress = await registryHandle.getRoleMember(
      REGISTRAR_ROLE,
      0
    );

    const REGISTRAR_ROLE_ADMIN = registryHandle.REGISTRAR_ROLE_ADMIN();
    const registrarAdminAddress = await registryHandle.getRoleMember(
      REGISTRAR_ROLE_ADMIN,
      0
    );
    const symbol = await registryHandle.symbol();
    let numberOfEntries;
    try {
        numberOfEntries = await registryHandle.totalSupply();
    } catch (error) {
        numberOfEntries = "Total Supply Unavailable (Non Enumerable Registry)";
    }
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

    const tx = await registryHandle.setRegistryParameters(params, await gasSettings());
    const tx_rcpt = await tx.wait();

    const REGISTRAR_ROLE = registryHandle.REGISTRAR_ROLE();
    const registrarAddress = await registryHandle.getRoleMember(
      REGISTRAR_ROLE,
      0,
    );
    const symbol = await registryHandle.symbol();
    let numberOfEntries;
    try {
        numberOfEntries = await registryHandle.totalSupply();
    } catch (error) {
        numberOfEntries = "Total Supply Not Available (Non Enumerable Registry)"
    }
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
    console.log(`Registry Address: ${registryAddress}`);
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
 .addParam("dryrun", "boolean flag (true or false), if true then no transaction is submitted")
 .setAction(async (taskArgs) => {
   const name = taskArgs.name;
   const nfis = taskArgs.nfis;
   const dryrun = taskArgs.dryrun;

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
   if ((indexArr.length === idArr.length) && (uriArr.length === recipArr.length) && (indexArr.length === recipArr.length) && (dryrun == 'false')) {
       let tx = await batchModuleHandle.batchRegister(recipArr, labelArr, uriArr, idArr, targetRegistryAddress, await gasSettings());
       const tx_rcpt = await tx.wait();
       console.log("Batch Gas Cost:", tx_rcpt.gasUsed.toString());
   } else {
       console.log("Transaction skipped.");
       console.log(indexArr.length);
       console.log(idArr.length);
       console.log(uriArr.length);
       console.log(recipArr.length);
       console.log(labelArr.length);
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
    const tokenURINoBase = await registryHandle.tokenURINoBase(tokenId);
    const tokenOwner = await registryHandle.ownerOf(tokenId);
    const tokenLabel = await registryHandle.reverseRegistryMap(tokenId);

    console.log("Owner of NFI:", tokenOwner);
    console.log("Token ID:", tokenId.toString());
    console.log("Token URI:", tokenURI);
    console.log("NFI Data:", tokenURINoBase);
    console.log("NFI label:", tokenLabel);
  });

  task("tokenOfOwnerByIndex", "Prints NonFungible Identity Data.")
  .addParam("registry", "Target NonFungle Registry Name.")
  .addParam("address", "account address to scan")
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

    let tx = await registryHandle.transferFrom(tokenOwner, recipient, tokenId, await gasSettings());
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
    const tx = await registryHandle.burn(tokenId, await gasSettings());
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
  .addParam("accountnumber", "which account to use in HD wallet.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const registryName = taskArgs.registry;
    const NFILabel = taskArgs.label;
    const NFIData = taskArgs.data;
    const NFIRecipient = taskArgs.recipient;
    const tokenid = taskArgs.tokenid;
    const accountnumber = taskArgs.accountnumber;
    const txCount = await accounts[accountnumber].getTransactionCount();

    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[accountnumber],
    );

    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = new hre.ethers.Contract(
      registryAddress,
      NFR.abi,
      accounts[accountnumber],
    );

    const gassettings = await gasSettings(txCount);
    // call registerByToken on the NFR
    tx = await registryHandle.register(
      NFIRecipient,
      NFILabel,
      NFIData,
      tokenid,
      gassettings
    );
    const txrcpt = await tx.wait();
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
    let tx = await registrationtoken.approve(registryAddress, registrationFee, await gasSettings());
    await tx.wait(3);

    // call registerByToken on the NFR
    tx = await registryHandle.registerByToken(
      NFIRecipient,
      NFILabel,
      NFIData,
      tokenid,
      await gasSettings()
    );
    await tx.wait();

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
    await gasSettings()
  );
  await tx.wait();

  const updatedRegistration = await registryHandle.tokenURI(tokenid);
  console.log("New Registration Data:", updatedRegistration);
});

task("grantRegistrarRole", "Give the registrar role to a specified account.")
.addParam("registry", "Name of target Registry where role is to be granted.")
.addParam("registrar", "Recipient of the REGISTRAR_ROLE.")
.setAction(async (taskArgs) => {
  const accounts = await hre.ethers.getSigners();

  const registryName = taskArgs.registry;
  const registrar = taskArgs.registrar

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
  tx = await registryHandle.grantRole(
    registryHandle.REGISTRAR_ROLE(),
    registrar,
    await gasSettings()
  );
  await tx.wait();

  console.log("REGISTRAR_ROLE updated");
});

task("transferRegistryOwnership", "Transfer ownership of a registry to a new role.")
.addParam("registry", "Name of target Registry where role is to be granted.")
.addParam("owner", "New owner")
.setAction(async (taskArgs) => {
  const accounts = await hre.ethers.getSigners();

  const registryName = taskArgs.registry;
  const newOwner = taskArgs.owner

  const factoryHandle = await hre.ethers.getContractAt('UpgradeableRegistryFactory', factoryAddress());
  const registryAddress = await factoryHandle.nameToAddress(registryName);
  const registryHandle = await hre.ethers.getContractAt("NonFungibleRegistryUpgradeable", registryAddress, accounts[0]);

  // call registerByToken on the NFR
  tx = await registryHandle.transferOwnership(newOwner);
  await tx.wait();

  const updatedOwner = await registryHandle.owner()

  console.log(`OWNER Updated: ${updatedOwner}`);
});

task("transferEntryOwnership", "Transfer ownership of an entry to a new address.")
.addParam("registry", "Name of target registry")
.addParam("tokenid", "Token ID of the entry to be transferred.")
.addParam("newOwner", "New owner of the entry.")
.setAction(async (taskArgs) => {
  const accounts = await hre.ethers.getSigners();

  const registryName = taskArgs.registry;

  const factoryHandle = await hre.ethers.getContractAt('UpgradeableRegistryFactory', factoryAddress());
  const registryAddress = await factoryHandle.nameToAddress(registryName);
  const registryHandle = await hre.ethers.getContractAt("NonFungibleRegistryUpgradeable", registryAddress, accounts[0]);

  // call registerByToken on the NFR
  currentOwner = await registryHandle.ownerOf(taskArgs.tokenid);
  tx = await registryHandle.transferFrom(
    currentOwner,
    taskargs.newOwner,
    taskArgs.tokenid
  )
  await tx.wait();

  const updatedOwner = await registryHandle.ownerOf(taskargs.tokenid)

  console.log(`OWNER Updated: ${updatedOwner}`);
});

task("batchTransferEntryOwnership", "Transfer ownership of a set of NFTs to new owners.")
  .addParam("registry", "Name of target registry")
  .addParam("tokenids", "Token IDs of the entries to be transferred.")
  .addParam("newOwners", "New owners of each entry.")
  .setAction(async (taskArgs) => {
    if (taskArgs.tokenids.length !== taskArgs.newOwners.length) {
      throw new Error("tokenids and newOwners must be the same length");
    }

    const accounts = await hre.ethers.getSigners();
    const registryName = taskArgs.registry;
  
    const factoryHandle = await hre.ethers.getContractAt('UpgradeableRegistryFactory', factoryAddress());
    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = await hre.ethers.getContractAt("NonFungibleRegistryUpgradeable", registryAddress, accounts[0]);

    for (let i = 0; i < taskArgs.tokenids.length; i++) {
      currentOwner = await registryHandle.ownerOf(taskArgs.tokenid);
      tx = await registryHandle.transferFrom(
        currentOwner,
        taskargs.newOwners[i],
        taskArgs.tokenid
      )
      await tx.wait();

      const updatedOwner = await registryHandle.ownerOf(taskargs.tokenid)
      console.log(`ID ${taskArgs.tokenids[i]} updated; new owner ${updatedOwner}`);
    }

    console.log(`Batch owner update complete.`)
})

task("setRoyalties", "Set the royalty info for a collection")
  .addParam("registry", "Name of target Registry where role is to be granted.")
  .addParam("recipient", "Recipient of the royalty fees")
  .addParam("percentage", "Percentage fee in basis points ([0,10000])")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const registryName = taskArgs.registry;
    const registrar = taskArgs.registrar
  
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
  
    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = await ethers.getContractAt("NonFungibleRegistryUpgradeable", registryAddress, accounts[0]);

    tx = await registryHandle.setRoyaltyFee(
      taskArgs.recipient,
      taskArgs.percentage,
      await gasSettings()
    );

    await tx.wait();
});

task("triggerRoyaltiesRefresh", "Trigger a refresh of the royalties for a collection")
  .addParam("registry", "Name of target Registry where role is to be granted.")
  .addParam("tokenid", "Token ID to target")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const registryName = taskArgs.registry;
    const registrar = taskArgs.registrar
  
    const factoryHandle = new hre.ethers.Contract(
      factoryAddress(),
      RF.abi,
      accounts[0],
    );
  
    const registryAddress = await factoryHandle.nameToAddress(registryName);
    const registryHandle = await ethers.getContractAt("NonFungibleRegistryUpgradeable", registryAddress, accounts[0]);

    tx = await registryHandle.triggerRoyaltiesRefresh(taskargs.tokenid);

    await tx.wait();
});