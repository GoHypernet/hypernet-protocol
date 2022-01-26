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

  // deploy hypertoken contract
  const Hypertoken = await ethers.getContractFactory("Hypertoken");
  const hypertoken = await Hypertoken.deploy();
  const hypertoken_reciept = await hypertoken.deployTransaction.wait();
  const totalSupply = await hypertoken.totalSupply();
  const recipientBalance = await hypertoken.balanceOf(owner.address);
  console.log("Hypertoken Address:", hypertoken.address);
  console.log("Hypertoken Supply:", totalSupply.toString());
  console.log("Hypertoken Gas Fee:", hypertoken_reciept.gasUsed.toString());
  console.log("Hypertoken recipient:", owner.address);
  console.log("Recipient Balance:", recipientBalance.toString());

  // all tokens are currently owned by owner signer
  // delegate all votes to self
  // if delegate() is not called, the account has no voting power
  const txvotes = await hypertoken.delegate(owner.address);
  const txvotes_receipt = txvotes.wait();

  // deploy timelock contract
  const Timelock = await ethers.getContractFactory("TimelockController");
  const timelock = await Timelock.deploy(1, [], []);
  const timelock_reciept = await timelock.deployTransaction.wait();
  console.log("Timelock Address:", timelock.address);
  console.log("Timelock Gas Fee:", timelock_reciept.gasUsed.toString());

  // deploy hypernet governor contract
  const HypernetGovernor = await ethers.getContractFactory("HypernetGovernor");
  const hypernetgovernor = await HypernetGovernor.deploy(
    hypertoken.address,
    timelock.address,
  );
  const hypernetgovernor_reciept =
    await hypernetgovernor.deployTransaction.wait();
  console.log("Governor address:", hypernetgovernor.address);
  console.log("Governor Gas Fee:", hypernetgovernor_reciept.gasUsed.toString());

  // give the governor contract the Proposer role in the timelock contract
  const tx1 = await timelock.grantRole(
    timelock.PROPOSER_ROLE(),
    hypernetgovernor.address,
  );
  const tx1_reciept = await tx1.wait();

  console.log("DAO has proposer role");

  // give the governor contract the Executor role in the timelock contract
  const tx2 = await timelock.grantRole(
    timelock.EXECUTOR_ROLE(),
    hypernetgovernor.address,
  );
  const tx2_reciept = await tx2.wait();

  console.log("DAO has executor role");

  // give the governor contract the admin role of the timelock contract
  const tx3 = await timelock.grantRole(
    timelock.TIMELOCK_ADMIN_ROLE(),
    hypernetgovernor.address,
  );
  const tx3_reciept = await tx3.wait();

  console.log("DAO is timelock admin");

  // deployer address should now renounce admin role for security
  const tx4 = await timelock.renounceRole(
    timelock.TIMELOCK_ADMIN_ROLE(),
    owner.address,
  );
  const tx4_reciept = await tx4.wait();

  console.log("Deploy wallet renounced role.");

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

  // deploy factory contract
  const FactoryRegistry = await ethers.getContractFactory(
    "UpgradeableRegistryFactory",
  );
  const factoryregistry = await FactoryRegistry.deploy(
    timelock.address,
    [
        "Hypernet Profiles", 
        "Gateways", 
        "Liquidity Providers", 
        "Payment Tokens",
        "Registry Modules"
    ],
    [
        "Customizable Web3 user profile tokens for the Hypernet Protocol.", 
        "Payment gateway signatures for the Hypernet Protocol payment network.", 
        "Liquidity provider metadata for the Hypernet Protocol payment network.", 
        "Officially supported payment tokens for the Hypernet Protocol payment network.",
        "Official modules for extending Hypernet registry functionality."
    ],
    [
        timelock.address, 
        timelock.address, 
        timelock.address, 
        timelock.address,
        timelock.address
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
