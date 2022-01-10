// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

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

  const hypernetidaddress = "0xC1B2875d2dde88fd4889Be7499176e61C8a5aF6c";

  // deploy enumerable registry contract
  const EnumerableRegistry = await ethers.getContractFactory(
    "NonFungibleRegistryEnumerableUpgradeable",
  );
  const enumerableregistry = await EnumerableRegistry.deploy();
  const enumerable_registry_reciept =
    await enumerableregistry.deployTransaction.wait();
  console.log(
    "Enumerable Registry Beacon Address:",
    enumerableregistry.address,
  );
  console.log(
    "Factory Gas Fee:",
    enumerable_registry_reciept.gasUsed.toString(),
  );

  // deploy registry contract
  const Registry = await ethers.getContractFactory(
    "NonFungibleRegistryUpgradeable",
  );
  const registry = await Registry.deploy();
  const registry_reciept = await registry.deployTransaction.wait();
  console.log("Registry Beacon Address:", registry.address);
  console.log("Registry Gas Fee:", registry_reciept.gasUsed.toString());

  // deploy factory contract with the deployer wallet as the admin
  const FactoryRegistry = await ethers.getContractFactory(
    "UpgradeableRegistryFactory",
  );
  const factoryregistry = await FactoryRegistry.deploy(
    hypernetidaddress,
    [
        "Hypernet Profiles", 
        "Hypernet.ID"
    ],
    [
        "Customizable Web3 user profile tokens for the Hypernet Protocol.", 
        "Pseudo-anonymous identity verification for the web3 metaverse."
    ],
    [
        hypernetidaddress, 
        hypernetidaddress
    ],
    enumerableregistry.address,
    registry.address,
    hypertoken.address,
  );
  const factory_reciept = await factoryregistry.deployTransaction.wait();
  console.log("Factory Address:", factoryregistry.address);
  console.log("Factory Gas Fee:", factory_reciept.gasUsed.toString());

  // deploy the batch minting module
  const BatchModule = await ethers.getContractFactory("BatchModule");
  batchmodule = await BatchModule.deploy("Batch Minting");
  const batchmodule_reciept = await batchmodule.deployTransaction.wait();
  console.log("Batch Module Address:", batchmodule.address);
  console.log("Batch Module Gas Fee:", batchmodule_reciept.gasUsed.toString());

  // deploy the lazy minting module
  const LazyMintModule = await ethers.getContractFactory("LazyMintModule");
  const lazymintmodule = await LazyMintModule.deploy("Lazy Minting");
  const lazymintmodule_reciept = await lazymintmodule.deployTransaction.wait();
  console.log("Lazy Mint Module Address:", lazymintmodule.address);
  console.log("Lazy Mint Module Gas Fee:", lazymintmodule_reciept.gasUsed.toString());

  // deploy the Merkle Drop module
  const MerkleModule = await ethers.getContractFactory("MerkleModule");
  const merklemodule = await MerkleModule.deploy("Merkle Drop");
  const merklemodule_reciept = await merklemodule.deployTransaction.wait();
  console.log("Merkle Module Address:", merklemodule.address);
  console.log("Merkle Module Gas Fee:", merklemodule_reciept.gasUsed.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
