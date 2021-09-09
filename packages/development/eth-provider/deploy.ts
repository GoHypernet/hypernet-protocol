import { BigNumber } from "@ethersproject/bignumber";
import { EtherSymbol, Zero } from "@ethersproject/constants";
import { formatEther, parseEther } from "@ethersproject/units";
import {
  deployments,
  ethers,
  getNamedAccounts,
  getChainId,
  network,
} from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

import { logger } from "../src.ts/constants";
import ERC20Abi from "../src.ts/erc20abi";
import LiquidityRegistryAbi from "../src.ts/liquidityRegistryAbi";
import { registerTransfer } from "../src.ts/utils";
// important address
const userAddress = "0x243FB44Ea4FDD2651605eC85290f041fF5F876f0";


const func: DeployFunction = async () => {
  const log = logger.child({ module: "Deploy" });
  const chainId = await getChainId();
  const provider = ethers.provider;
  const { deployer } = await getNamedAccounts();

  const signer = await ethers.getSigner(deployer);

  log.info(deployments);

  // Log initial state
  const balance = await provider.getBalance(deployer);
  const nonce = await provider.getTransactionCount(deployer);
  log.info(`Preparing to migrate contracts to chain ${chainId}`);
  log.info(
    `Deployer address=${deployer} nonce=${nonce} balance=${formatEther(
      balance,
    )}`,
  );

  if (balance.eq(0)) {
    throw new Error(
      `Account ${deployer} has zero balance on chain ${chainId}, aborting migration`,
    );
  }

  ////////////////////////////////////////
  // Run the migration

  type Args = Array<string | BigNumber>;
  const migrate = async (name: string, args: Args): Promise<void> => {
    const processedArgs = await Promise.all(
      args.map(async (arg: any): Promise<any> => {
        try {
          return (await deployments.get(arg)).address;
        } catch (e) {
          return arg;
        }
      }),
    );
    log.info(`Deploying ${name} with args [${processedArgs.join(", ")}]`);
    await deployments.deploy(name, {
      from: deployer,
      args: processedArgs,
      /*
      gasLimit: deployTx.gasLimit && BigNumber.from(deployTx.gasLimit).lt(MIN_GAS_LIMIT)
        ? MIN_GAS_LIMIT
        : undefined,
      */
    });
    const deployment = await deployments.get(name);
    if (!deployment.transactionHash) {
      throw new Error(`Failed to deploy ${name}`);
    }
    const tx = await ethers.provider.getTransaction(
      deployment.transactionHash!,
    );
    const receipt = await ethers.provider.getTransactionReceipt(
      deployment.transactionHash!,
    );
    log.info(
      `Sent transaction to deploy ${name}, txHash: ${deployment.transactionHash}`,
    );
    log.info(
      `Success! Consumed ${
        receipt?.gasUsed ?? "unknown"
      } gas worth ${EtherSymbol} ${formatEther(
        (receipt?.gasUsed || Zero).mul(tx.gasPrice),
      )} deploying ${name} to address: ${deployment.address}`,
    );
  };

  const standardMigration = [
    ["ChannelMastercopy", []],
    ["ChannelFactory", ["ChannelMastercopy", Zero]],
    ["HashlockTransfer", []],
    ["Withdraw", []],
    ["TransferRegistry", []],
    ["TestToken", []],
    ["Parameterized", []],
    ["Insurance", []],
    ["Message", []],
    ["Hypertoken", []],
    ["MocRegistry", []],
    ["LiquidityRegistry", []],
    ["NonFungibleRegistry", ["Gateways","G",userAddress]],
    ["NonFungibleRegistry", ["Liquidity Providers","LPs",userAddress]],
  ];

  // Only deploy test fixtures during hardhat tests
  if (network.name === "hardhat") {
    log.info(`Running localnet migration`);
    for (const row of [
      ...standardMigration,
      ["TestChannel", []],
      ["TestChannelFactory", ["TestChannel", Zero]],
      ["FailingToken", []],
      ["NonconformingToken", []],
      ["TestLibIterableMapping", []],
      ["CMCAsset", []],
    ]) {
      const name = row[0] as string;
      const args = row[1] as Array<string | BigNumber>;
      await migrate(name, args);
    }
    await registerTransfer("Withdraw", deployer);
    await registerTransfer("HashlockTransfer", deployer);
    await registerTransfer("Parameterized", deployer);
    await registerTransfer("Insurance", deployer);
    await registerTransfer("Message", deployer);

    // Default: run standard migration
  } else {
    log.info(`Running testnet migration`);
    for (const row of standardMigration) {
      const name = row[0] as string;
      const args = row[1] as Array<string | BigNumber>;
      await migrate(name, args);
    }
    await registerTransfer("Withdraw", deployer);
    await registerTransfer("HashlockTransfer", deployer);
    await registerTransfer("Parameterized", deployer);
    await registerTransfer("Insurance", deployer);
    await registerTransfer("Message", deployer);
  }

  if ([1337, 5].includes(network.config.chainId ?? 0)) {
    log.info(`Detected AMM deployment chain ${network.config.chainId}`);
    const res = await deployments.deploy("StableSwap", {
      from: deployer,
      args: [parseEther("2500")],
    });
    log.info(
      { address: res.address, txHash: res.transactionHash },
      `Deployed AMM ${network.config.chainId}`,
    );
  }

  ////////////////////////////////////////
  // Disburse funds of different types to a lot of different wallets
  log.info("Playing rich uncle");
  const galileoAddress = "0xDcD7698B42FD7b47bB4889B43338897018f7F47d";
  const routerAddress = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"; // candy maple ... Account #1
  const hyperpayAddress = "0x14791697260E4c9A71f18484C9f997B308e59325";
  const testTokenAddress = "0x9FBDa871d559710256a2502A2517b794B482Db40";
  const hyperTokenAddress = "0xAa588d3737B611baFD7bD713445b314BD453a5C8";
  const amount = ethers.utils.parseEther("10000.0");
  const testTokenContract = new ethers.Contract(
    testTokenAddress,
    ERC20Abi,
    signer,
  );
  const hyperTokenContract = new ethers.Contract(
    hyperTokenAddress,
    ERC20Abi,
    signer,
  );

  const userTestTx = await testTokenContract.transfer(userAddress, amount);
  const userHyperTx = await hyperTokenContract.transfer(userAddress, amount);
  const userEthTx = await signer.sendTransaction({
    to: userAddress,
    value: amount,
  });

  await userTestTx.wait();
  await userHyperTx.wait();
  await userEthTx.wait();

  const galileoTestTx = await testTokenContract.transfer(
    galileoAddress,
    amount,
  );
  const galileoHyperTx = await hyperTokenContract.transfer(
    galileoAddress,
    amount,
  );
  const galileoEthTx = await signer.sendTransaction({
    to: galileoAddress,
    value: amount,
  });

  await galileoTestTx.wait();
  await galileoHyperTx.wait();
  await galileoEthTx.wait();

  const hyperpayTestTx = await testTokenContract.transfer(
    hyperpayAddress,
    amount,
  );
  const hyperpayHyperTx = await hyperTokenContract.transfer(
    hyperpayAddress,
    amount,
  );
  const hyperpayEthTx = await signer.sendTransaction({
    to: hyperpayAddress,
    value: amount,
  });

  await hyperpayTestTx.wait();
  await hyperpayHyperTx.wait();
  await hyperpayEthTx.wait();
  log.info("Rich uncle is now in the poor house");

  ////////////////////////////////////////
  log.info("Registering router info");
  const liquidityRegistryAddress = "0x75c35C980C0d37ef46DF04d31A140b65503c0eEd";
  const routerPublicIdentifier =
    "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR";
  const liquidityRegistryContract = new ethers.Contract(
    liquidityRegistryAddress,
    LiquidityRegistryAbi,
    signer,
  );

  const registryEntry = {
    supportedTokens: [
      {
        chainId: 1337,
        tokenAddress: testTokenAddress,
      },
      {
        chainId: 1337,
        tokenAddress: hyperTokenAddress,
      },
      {
        chainId: 1369,
        tokenAddress: testTokenAddress,
      },
      {
        chainId: 1369,
        tokenAddress: hyperTokenAddress,
      },
    ],
    allowedGateways: [
      "https://localhost:3000/users/v0",
      "http://localhost:5010",
      "https://hyperpay-dev.hypernetlabs.io/users/v0",
    ],
  };

  const liquidityRegistryTx = await liquidityRegistryContract.register(
    routerAddress,
    routerPublicIdentifier,
    JSON.stringify(registryEntry),
  );

  await liquidityRegistryTx.wait();
  log.info("Deployed liquidity registration");

  ////////////////////////////////////////
  // Print summary
  log.info("All done!");
  const spent = formatEther(balance.sub(await provider.getBalance(deployer)));
  const nTx = (await provider.getTransactionCount(deployer)) - nonce;
  log.info(
    `Sent ${nTx} transaction${
      nTx === 1 ? "" : "s"
    } & spent ${EtherSymbol} ${spent}`,
  );
};
export default func;
