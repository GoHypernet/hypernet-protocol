// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
// const { NFR } = require("/tasks/constants.js");
const { NFR, gasSettings } = require("../tasks/constants.js");

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

  const hypernetidaddress = "0xeEce4ABb281d5BE24d42B4403884cDAf47600945";
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  // deploy enumerable registry contract
  const EnumerableRegistry = await ethers.getContractFactory(
    "NonFungibleRegistryEnumerableUpgradeable",
  );
  const enumerableregistry = await EnumerableRegistry.deploy(await gasSettings());  
  const enumerable_registry_reciept = await enumerableregistry.deployTransaction.wait();

  console.log("Enumerable Registry Beacon Address:", enumerableregistry.address);
  console.log("Factory Gas Fee:", enumerable_registry_reciept.gasUsed.toString());

  // deploy registry contract
  const Registry = await ethers.getContractFactory("NonFungibleRegistryUpgradeable");
  const registry = await Registry.deploy(await gasSettings());
  const registry_reciept = await registry.deployTransaction.wait();
  console.log("Registry Beacon Address:", registry.address);
  console.log("Registry Gas Fee:", registry_reciept.gasUsed.toString());

  // deploy factory contract with the deployer wallet as the admin
  const FactoryRegistry = await ethers.getContractFactory("UpgradeableRegistryFactory");
  const factoryregistry = await FactoryRegistry.deploy(
    owner.address,
    [
        "Hypernet Profiles",
        "Registry Modules",
        "Hypernet.ID"
    ],
    [
        "Customizable Web3 user profile tokens for the Hypernet Protocol.",
        "Official modules for extending Hypernet registry functionality.",
        "Pseudo-anonymous identity verification for the web3 metaverse."
    ],
    [
        owner.address, 
        owner.address,
        hypernetidaddress
    ],
    enumerableregistry.address,
    registry.address,
    zeroAddress,
    await gasSettings()
  );

  const factory_reciept = await factoryregistry.deployTransaction.wait();
  console.log("Factory Address:", factoryregistry.address);
  console.log("Factory Gas Fee:", factory_reciept.gasUsed.toString());

  // deploy the batch minting module
  const BatchModule = await ethers.getContractFactory("BatchModule");
  batchmodule = await BatchModule.deploy("Batch Minting", await gasSettings());
  const batchmodule_reciept = await batchmodule.deployTransaction.wait();
  console.log("Batch Module Address:", batchmodule.address);
  console.log("Batch Module Gas Fee:", batchmodule_reciept.gasUsed.toString());

  // deploy the lazy minting module
  const LazyMintModule = await ethers.getContractFactory("LazyMintModule");
  const lazymintmodule = await LazyMintModule.deploy("Lazy Minting", await gasSettings());
  const lazymintmodule_reciept = await lazymintmodule.deployTransaction.wait();
  console.log("Lazy Mint Module Address:", lazymintmodule.address);
  console.log("Lazy Mint Module Gas Fee:", lazymintmodule_reciept.gasUsed.toString());

  // deploy the Merkle Drop module
  const MerkleModule = await ethers.getContractFactory("MerkleModule");
  const merklemodule = await MerkleModule.deploy("Merkle Drop", await gasSettings());
  const merklemodule_reciept = await merklemodule.deployTransaction.wait();
  console.log("Merkle Module Address:", merklemodule.address);
  console.log("Merkle Module Gas Fee:", merklemodule_reciept.gasUsed.toString());

  // deploy the Buy NFI module
  const BuyModule = await ethers.getContractFactory("BuyModule");
  const buymodule = await BuyModule.deploy("Buy NFI", await gasSettings());
  const buymodule_reciept = await buymodule.deployTransaction.wait();
  console.log("Buy NFI Module Address:", buymodule.address);
  console.log("Buy NFI Module Gas Fee:", buymodule_reciept.gasUsed.toString());

  // register the deployer wallet so it can recieve NFIs
  const profilesAddress = await factoryregistry.nameToAddress("Hypernet Profiles");
  const profilesHandle = new hre.ethers.Contract(
    profilesAddress,
    NFR.abi,
    owner,
  );

  // register the deployer account
  const registrationTx = await profilesHandle.register(owner.address, "Deployer Account", "", 9205545327, await gasSettings());
  const registrationRcpt = await registrationTx.wait();
  console.log("Deployer Account Register Gas Fee:", registrationRcpt.gasUsed.toString());

  // register the Hypernet.ID account so it can also register and recieve NFIs
  const registrationHIDTx = await profilesHandle.register(hypernetidaddress, "Hypernet.ID Account", "", 6940495172, await gasSettings());
  const registrationHIDRcpt = await registrationHIDTx.wait();
  console.log("Hypernet.ID Account Register Gas Fee:", registrationHIDRcpt.gasUsed.toString());

  // give the Hypernet.ID account the REGISTRAR role in Hypernet Profiles registry
  const hidAdminTx = await profilesHandle.grantRole(
      profilesHandle.REGISTRAR_ROLE(),
      hypernetidaddress,
      await gasSettings()
    );

  const hidAdminRcpt = await hidAdminTx.wait();
  console.log("Hypernet.ID address has registrar role");
  console.log("Access Control Gas Fee:", hidAdminRcpt.gasUsed.toString());

  // update the Registry Modules registry
  const registryModulesAddress = await factoryregistry.nameToAddress("Registry Modules");
  const registryModulesHandle = new hre.ethers.Contract(registryModulesAddress,NFR.abi,owner);

  const batchRegTx = await registryModulesHandle.register(owner.address, "Batch Minting", `${batchmodule.address}`, 1, await gasSettings());
  const batchRegRcpt = await batchRegTx.wait();
  console.log("Batch Module Register Gas Fee:", batchRegRcpt.gasUsed.toString());

  const lazyMintRegTx = await registryModulesHandle.register(owner.address, "Lazy Minting", `${lazymintmodule.address}`, 2, await gasSettings());
  const lazyMintRegRcpt = await lazyMintRegTx.wait();
  console.log("Lazy Mint Module Register Gas Fee:", lazyMintRegRcpt.gasUsed.toString());
  
  const merkleDropRegTx = await registryModulesHandle.register(owner.address, "Merkle Drop", `${merklemodule.address}`, 3, await gasSettings());
  const merkleDropRegRcpt = await merkleDropRegTx.wait();
  console.log("Merkle Drop Module Register Gas Fee:", merkleDropRegRcpt.gasUsed.toString());

  const buyNFIRegTx = await registryModulesHandle.register(owner.address, "Buy NFI", `${buymodule.address}`, 4, await gasSettings());
  const buyNFIRegRcpt = await buyNFIRegTx.wait();
  console.log("Buy NFI Module Register Gas Fee:", buyNFIRegRcpt.gasUsed.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
