import { stringify } from "@connext/vector-utils";
import { Contract } from "@ethersproject/contracts";
import { keccak256 } from "@ethersproject/keccak256";
import { Wallet, providers, ContractFactory, BigNumber, utils } from "ethers";
import { Abis } from "@hypernetlabs/objects";
import { artifacts } from "@connext/vector-contracts";

const provider = new providers.JsonRpcProvider("http://localhost:8545");
const owner = Wallet.fromMnemonic("candy maple cake sugar pudding cream honey rich smooth crumble sweet treat").connect(
  provider,
);
const transfers = ["Insurance", "Parameterized", "Message"];

const MIN_GAS_LIMIT = BigNumber.from(500_000);

const localRegistryAddress = "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F";

const hash = (input: string): string => keccak256(`0x${input.replace(/^0x/, "")}`);

async function main() {
  const accounts = [owner];

  console.log(
    `Preparing to deploy transfers from ${accounts[0].address} (balance: ${utils.formatEther(
      await accounts[0].getBalance(),
    )})`,
  );

  // Deploy all transfers
  const entries1: { [key: string]: any } = {};
  for (const transfer of transfers) {
    const insuranceFactory = ContractFactory.fromSolidity(Abis["Insurance"]);
    const parameterizedFactory = ContractFactory.fromSolidity(Abis["Parameterized"]);
    const messageFactory = ContractFactory.fromSolidity(Abis["MessageTransfer"]);

    const insuranceDeployTx = insuranceFactory.getDeployTransaction();
    const parameterizedDeployTx = parameterizedFactory.getDeployTransaction();
    const messageDeployTx = messageFactory.getDeployTransaction();

    const insuranceTx = await accounts[0].sendTransaction({
      ...insuranceDeployTx,
      gasLimit:
        insuranceDeployTx.gasLimit && BigNumber.from(insuranceDeployTx.gasLimit).lt(MIN_GAS_LIMIT)
          ? MIN_GAS_LIMIT
          : undefined,
    });

    const parameterizedTx = await accounts[0].sendTransaction({
      ...parameterizedDeployTx,
      gasLimit:
        parameterizedDeployTx.gasLimit && BigNumber.from(parameterizedDeployTx.gasLimit).lt(MIN_GAS_LIMIT)
          ? MIN_GAS_LIMIT
          : undefined,
    });

    const messageTx = await accounts[0].sendTransaction({
      ...messageDeployTx,
      gasLimit:
        messageDeployTx.gasLimit && BigNumber.from(messageDeployTx.gasLimit).lt(MIN_GAS_LIMIT)
          ? MIN_GAS_LIMIT
          : undefined,
    });

    console.log(`Sent transaction to deploy Insurance, txHash: ${insuranceTx.hash}`);
    console.log(`Sent transaction to deploy Parameterized, txHash: ${parameterizedTx.hash}`);
    console.log(`Sent transaction to deploy MessageTransfer, txHash: ${messageTx.hash}`);

    const insuranceReceipt = await insuranceTx.wait();
    const parameterizedReceipt = await parameterizedTx.wait();
    const messageReceipt = await messageTx.wait();

    const insuranceAddress = Contract.getContractAddress(insuranceTx);
    const parameterizedAddress = Contract.getContractAddress(parameterizedTx);
    const messageAddress = Contract.getContractAddress(messageTx);

    const insuranceRuntimeCodeHash = hash(await accounts[0].provider!.getCode(insuranceAddress));
    const parameterizedRuntimeCodeHash = hash(await accounts[0].provider!.getCode(parameterizedAddress));
    const messageRuntimeCodeHash = hash(await accounts[0].provider!.getCode(messageAddress));

    const insuranceCreationCodeHash = hash(insuranceFactory.bytecode);
    const parameterizedCreationCodeHash = hash(parameterizedFactory.bytecode);
    const messageCreationCodeHash = hash(messageFactory.bytecode);

    console.log(`Successfully deployed Insurance`);
    entries1["Insurance"] = {
      insuranceAddress,
      insuranceRuntimeCodeHash,
      insuranceCreationCodeHash,
      txHash: insuranceTx.hash,
    };

    console.log(`Successfully deployed Parameterized`);
    entries1["Parameterized"] = {
      parameterizedAddress,
      parameterizedRuntimeCodeHash,
      parameterizedCreationCodeHash,
      txHash: parameterizedTx.hash,
    };

    console.log(`Successfully deployed MessageTransfer`);
    entries1["MessageTransfer"] = {
      messageAddress,
      messageRuntimeCodeHash,
      messageCreationCodeHash,
      txHash: messageTx.hash,
    };
  }
  console.log("Successfully deployed all transfers:");
  console.log(stringify(entries1));

  console.log(
    `Preparing to register transfers from ${accounts[0].address} (balance: ${utils.formatEther(
      await accounts[0].getBalance(),
    )}})`,
  );

  // Register all transfers
  const registry = new Contract(localRegistryAddress, artifacts.TransferRegistry.abi, owner);
  const insuranceContract = new Contract(
    entries1["Insurance"].insuranceAddress,
    artifacts.TransferDefinition.abi,
    owner,
  );
  const parameterizedContract = new Contract(
    entries1["Parameterized"].parameterizedAddress,
    artifacts.TransferDefinition.abi,
    owner,
  );
  const messageContract = new Contract(
    entries1["MessageTransfer"].messageAddress,
    artifacts.TransferDefinition.abi,
    owner,
  );

  const insuranceRegistryInfo = await insuranceContract.getRegistryInformation();
  const parameterizedRegistryInfo = await parameterizedContract.getRegistryInformation();
  const messageRegistryInfo = await messageContract.getRegistryInformation();

  console.log(`Insurance Registry Info: ${insuranceRegistryInfo}`);
  console.log(`Parameterized Registry Info: ${parameterizedRegistryInfo}`);
  console.log(`MessageTransfer Registry Info: ${messageRegistryInfo}`);

  const insuranceTx = await registry.addTransferDefinition(insuranceRegistryInfo);
  const parameterizedTx = await registry.addTransferDefinition(parameterizedRegistryInfo);
  const messageTx = await registry.addTransferDefinition(messageRegistryInfo);

  const insuranceReceipt = await insuranceTx.wait();
  const parameterizedReceipt = await parameterizedTx.wait();
  const messageReceipt = await messageTx.wait();

  //console.log(`Insurance registration status: ${JSON.stringify(insuranceReceipt)}`)
  //console.log(`Parameterzied registration status: ${JSON.stringify(parameterizedReceipt)}`)

  console.log("Transfer registration complete.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
