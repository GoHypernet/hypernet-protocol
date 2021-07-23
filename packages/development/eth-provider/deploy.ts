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
import { registerTransfer } from "../src.ts/utils";

const func: DeployFunction = async () => {
  const log = logger.child({ module: "Deploy" });
  const chainId = await getChainId();
  const provider = ethers.provider;
  const { deployer } = await getNamedAccounts();

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
