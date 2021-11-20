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
import NFRAbi from "../src.ts/erc721abi";
import registryFactoryAbi from "../src.ts/registryFactoryAbi";
import { registerTransfer } from "../src.ts/utils";

// important address
const userAddress = "0x243FB44Ea4FDD2651605eC85290f041fF5F876f0";
const hyperKYCAddress = "0x821aEa9a577a9b44299B9c15c88cf3087F3b5544";
const registryAccountAddress = "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef";
const hypertokenContractAddress = "0xAa588d3737B611baFD7bD713445b314BD453a5C8";
const enumerableRegistryAddress = "0xf204a4Ef082f5c04bB89F7D5E6568B796096735a";
const nonenumerableRegistryAddress =
  "0x75c35C980C0d37ef46DF04d31A140b65503c0eEd";
const registryFactoryContractAddress =
  "0x82D50AD3C1091866E258Fd0f1a7cC9674609D254";
const governanceContractAddress = "0xdDA6327139485221633A1FcD65f4aC932E60A2e1";
const timelockContractAddress = "0xeec918d74c746167564401103096D45BbD494B74";

const func: DeployFunction = async () => {
  const log = logger.child({ module: "Deploy" });
  const chainId = await getChainId();
  const provider = ethers.provider;
  const { deployer } = await getNamedAccounts();

  const signer = await ethers.getSigner(deployer);
  const registrySigner = await ethers.getSigner(registryAccountAddress);

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
    ["NonFungibleRegistryEnumerableUpgradeable", []],
    ["NonFungibleRegistryUpgradeable", []],
    [
      "UpgradeableRegistryFactory",
      [
        timelockContractAddress,
        ["Hypernet Profiles", "Gateways", "Liquidity Providers", "HyperID", "Tokens", "Chains"],
        [
            "Customizable Web3 user profile tokens for the Hypernet Protocol.", 
            "Payment gateway signatures for the Hypernet Protocol payment network.", 
            "Liquidity provider metadata for the Hypernet Protocol payment network.", 
            "Hypernet.ID token registry.", 
            "Officially supported payment tokens for the Hypernet Protocol payment network.", 
            "Officially supported layer 1 chains for the Hypernet Protocol payment network."],
        [
          registryAccountAddress,
          registryAccountAddress,
          registryAccountAddress,
          hyperKYCAddress,
          registryAccountAddress,
          registryAccountAddress,
        ],
        enumerableRegistryAddress,
        nonenumerableRegistryAddress,
        hypertokenContractAddress,
      ],
    ],
    ["HypernetGovernor", [hypertokenContractAddress, timelockContractAddress]],
    [
      "TimelockController",
      [1, [governanceContractAddress], [governanceContractAddress]],
    ],
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
  // These are account addresses
  const galileoAccountAddress = "0xDcD7698B42FD7b47bB4889B43338897018f7F47d";
  const routerAddress = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"; // candy maple ... Account #1
  const hyperpayAddress = "0x14791697260E4c9A71f18484C9f997B308e59325";

  // These are contract addresses
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
  const registryFactoryContract = new ethers.Contract(
    registryFactoryContractAddress,
    registryFactoryAbi,
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
    galileoAccountAddress,
    amount,
  );
  const galileoHyperTx = await hyperTokenContract.transfer(
    galileoAccountAddress,
    amount,
  );
  const galileoEthTx = await signer.sendTransaction({
    to: galileoAccountAddress,
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
  const profilesRegistryAddress = await registryFactoryContract.nameToAddress(
    "Hypernet Profiles",
  );
  const gatewayRegistryAddress = await registryFactoryContract.nameToAddress(
    "Gateways",
  );
  const liquidityRegistryAddress = await registryFactoryContract.nameToAddress(
    "Liquidity Providers",
  );
  const hyperidRegistryAddress = await registryFactoryContract.nameToAddress(
    "HyperID",
  );
  const tokenRegistryAddress = await registryFactoryContract.nameToAddress(
    "Tokens",
  );
  const chainRegistryAddress = await registryFactoryContract.nameToAddress(
    "Chains",
  );

  log.info(`Profiles Registry Address: ${profilesRegistryAddress}`);
  log.info(`Gateway Registry Address: ${gatewayRegistryAddress}`);
  log.info(`Liquidity Registry Address: ${liquidityRegistryAddress}`);
  log.info(`HyperID Registry Address: ${hyperidRegistryAddress}`);
  log.info(`Token Registry Address: ${tokenRegistryAddress}`);
  log.info(`Chain Registry Address: ${chainRegistryAddress}`);

  const routerPublicIdentifier =
    "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR";

  const registryAccountPrivateKey =
    "0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1";

  // make needed profile accounts
  log.inf("Creating account profiles")
  const profileRegistryContract = new ethers.Contract(
    profilesRegistryAddress,
    NFRAbi,
    registrySigner,
  );

  // Mint a profile for the router
  const liquidityProfileTx = await profileRegistryContract.register(
    routerAddress,
    "Test Router",
    "Profile for the liquidity provider router.",
    1,
  );
  liquidityProfileTx.wait();

  // Mint a profile for the gateway
  const testGatewayProfileTx = await profileRegistryContract.register(
    hyperpayAddress,
    "HyperPay",
    "Profile for the HyperPay Gateway.",
    2,
  );
  testGatewayProfileTx.wait();

  // Mint a profile for the gateway
  const registryProfileTx = await profileRegistryContract.register(
    registryAccountAddress,
    "Registry Owner",
    "Profile for the Registry Account Owner.",
    3,
  );
  testGatewayProfileTx.wait();

  ////////////////////////////////////////
  log.info("Deploying liquidity registration");

  const liquidityRegistryContract = new ethers.Contract(
    liquidityRegistryAddress,
    NFRAbi,
    registrySigner,
  );

  const routerRegistryEntry = {
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
      "http://localhost:3000/users/v0",
      "http://localhost:5010",
      "https://hyperpay-dev.hypernetlabs.io/users/v0",
    ],
  };

  // Mint a token for the router, mark it as owned by the router
  const liquidityRegistryTx = await liquidityRegistryContract.register(
    routerAddress,
    routerPublicIdentifier,
    JSON.stringify(routerRegistryEntry),
    1,
  );

  await liquidityRegistryTx.wait();
  log.info("Deployed liquidity registration.");

  ////////////////////////////////////////
  log.info("Deploying gateway registration");

  const gatewayRegistryContract = new ethers.Contract(
    gatewayRegistryAddress,
    NFRAbi,
    registrySigner,
  );

  const testGatewayRegistrationEntry = {
    address: hyperpayAddress,
    signature: "UPDATE ME, I AM NOT A SIGNATURE FOR TEST GATEWAY",
  };

  const hyperpayGatewayRegistrationEntry = {
    address: hyperpayAddress,
    signature: "UPDATE ME, I AM NOT A SIGNATURE FOR HYPERPAY",
  };

  // Mint a token for the router, mark it as owned by the router
  const testGatewayRegistryTx = await gatewayRegistryContract.register(
    hyperpayAddress,
    "http://localhost:5010",
    JSON.stringify(testGatewayRegistrationEntry),
    1,
  );

  const hyperpayLocalGatewayRegistryTx = await gatewayRegistryContract.register(
    hyperpayAddress,
    "https://localhost:3000/users/v0",
    JSON.stringify(hyperpayGatewayRegistrationEntry),
    2,
  );

  const hyperpayLocalGatewayRegistry2Tx =
    await gatewayRegistryContract.register(
      hyperpayAddress,
      "http://localhost:3000/users/v0",
      JSON.stringify(hyperpayGatewayRegistrationEntry),
      3,
    );

  const hyperpayDevGatewayRegistryTx = await gatewayRegistryContract.register(
    hyperpayAddress,
    "https://hyperpay-dev.hypernetlabs.io/users/v0",
    JSON.stringify(hyperpayGatewayRegistrationEntry),
    4,
  );

  await testGatewayRegistryTx.wait();
  await hyperpayLocalGatewayRegistryTx.wait();
  await hyperpayLocalGatewayRegistry2Tx.wait();
  await hyperpayDevGatewayRegistryTx.wait();

  console.info(
    "Deployed registration tokens for test gateway and Hyperpay (local and dev)",
  );

  ////////////////////////////////////////
  log.info("Deploying Token Registry entries");
  const tokenRegistryContract = new ethers.Contract(
    tokenRegistryAddress,
    NFRAbi,
    registrySigner,
  );

  // Mint tokens for some different tokens
  const tokenTxs = [
    await tokenRegistryContract.register(
      registryAccountAddress,
      "1:0x0000000000000000000000000000000000000000",
      JSON.stringify({
        name: "Ethereum",
        symbol: "ETH",
        chainId: 1,
        address: "0x0000000000000000000000000000000000000000",
        nativeToken: true,
        erc20: false,
        decimals: 18,
        logoUrl: "",
      }),
      1,
    ),
    await tokenRegistryContract.register(
      registryAccountAddress,
      "1337:0x0000000000000000000000000000000000000000",
      JSON.stringify({
        name: "Ethereum",
        symbol: "ETH",
        chainId: 1337,
        address: "0x0000000000000000000000000000000000000000",
        nativeToken: true,
        erc20: false,
        decimals: 18,
        logoUrl: "",
      }),
      2,
    ),
    await tokenRegistryContract.register(
      registryAccountAddress,
      "1369:0x0000000000000000000000000000000000000000",
      JSON.stringify({
        name: "Ethereum",
        symbol: "ETH",
        chainId: 1369,
        address: "0x0000000000000000000000000000000000000000",
        nativeToken: true,
        erc20: false,
        decimals: 18,
        logoUrl: "",
      }),
      3,
    ),
    await tokenRegistryContract.register(
      registryAccountAddress,
      `1337:${hyperTokenAddress}`,
      JSON.stringify({
        name: "Hypertoken",
        symbol: "HYP",
        chainId: 1337,
        address: hyperTokenAddress,
        nativeToken: false,
        erc20: true,
        decimals: 18,
        logoUrl: "",
      }),
      4,
    ),
    await tokenRegistryContract.register(
      registryAccountAddress,
      `1369:${hyperTokenAddress}`,
      JSON.stringify({
        name: "Hypertoken",
        symbol: "HYP",
        chainId: 1369,
        address: hyperTokenAddress,
        nativeToken: false,
        erc20: true,
        decimals: 18,
        logoUrl: "",
      }),
      5,
    ),
    await tokenRegistryContract.register(
      registryAccountAddress,
      "1:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      JSON.stringify({
        name: "Wrapped Eth",
        symbol: "WETH",
        chainId: 1,
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        nativeToken: false,
        erc20: true,
        decimals: 18,
        logoUrl: "",
      }),
      6,
    ),
  ];

  for (const tokenTx of tokenTxs) {
    console.log("Adding token registration");
    await tokenTx.wait();
  }

  log.info("Deployed entries to Token registry");

  ////////////////////////////////////////
  log.info("Deploying Chain Registry entries");
  const chainRegistryContract = new ethers.Contract(
    chainRegistryAddress,
    NFRAbi,
    registrySigner,
  );

  // Mint tokens for some different tokens
  const chainTxs = [
    await chainRegistryContract.register(
      registryAccountAddress,
      "1337",
      JSON.stringify({
        name: "Local Development Chain",
        chainId: 1337,
        channelFactoryAddress: "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
        transferRegistryAddress: "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F",
        hypertokenAddress: hypertokenContractAddress,
        messageTransferAddress: "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6",
        insuranceTransferAddress: "0x30753E4A8aad7F8597332E813735Def5dD395028",
        parameterizedTransferAddress:
          "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4",
        hypernetGovernorAddress: governanceContractAddress,
        registryFactoryAddress: registryFactoryContractAddress,
        gatewayRegistryAddress: gatewayRegistryAddress,
        liquidityRegistryAddress: liquidityRegistryAddress,
        tokenRegistryAddress: tokenRegistryAddress,
        chainRegistryAddress: chainRegistryAddress,
        providerUrls: ["http://blockchain:8545"],
      }),
      1,
    ),
    await chainRegistryContract.register(
      registryAccountAddress,
      "1369",
      JSON.stringify({
        name: "Dev Environment Chain",
        chainId: 1369,
        channelFactoryAddress: "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
        transferRegistryAddress: "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F",
        hypertokenAddress: hypertokenContractAddress,
        messageTransferAddress: "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6",
        insuranceTransferAddress: "0x30753E4A8aad7F8597332E813735Def5dD395028",
        parameterizedTransferAddress:
          "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4",
        hypernetGovernorAddress: governanceContractAddress,
        registryFactoryAddress: registryFactoryContractAddress,
        gatewayRegistryAddress: gatewayRegistryAddress,
        liquidityRegistryAddress: liquidityRegistryAddress,
        tokenRegistryAddress: tokenRegistryAddress,
        chainRegistryAddress: chainRegistryAddress,
        providerUrls: ["https://eth-provider-dev.hypernetlabs.io"],
      }),
      2,
    ),
    await chainRegistryContract.register(
      registryAccountAddress,
      "4",
      JSON.stringify({
        name: "Rinkeby",
        chainId: 4,
        channelFactoryAddress: "TODO",
        transferRegistryAddress: "TODO",
        hypertokenAddress: "TODO",
        messageTransferAddress: "TODO",
        insuranceTransferAddress: "TODO",
        parameterizedTransferAddress: "TODO",
        hypernetGovernorAddress: "TODO",
        registryFactoryAddress: "TODO",
        gatewayRegistryAddress: "TODO",
        liquidityRegistryAddress: "TODO",
        tokenRegistryAddress: "TODO",
        chainRegistryAddress: "TODO",
        providerUrls: ["TODO"],
      }),
      3,
    ),
    await chainRegistryContract.register(
      registryAccountAddress,
      "1",
      JSON.stringify({
        name: "MainNet",
        chainId: 1,
        channelFactoryAddress: "TODO",
        transferRegistryAddress: "TODO",
        hypertokenAddress: "TODO",
        messageTransferAddress: "TODO",
        insuranceTransferAddress: "TODO",
        parameterizedTransferAddress: "TODO",
        hypernetGovernorAddress: "TODO",
        registryFactoryAddress: "TODO",
        gatewayRegistryAddress: "TODO",
        liquidityRegistryAddress: "TODO",
        tokenRegistryAddress: "TODO",
        chainRegistryAddress: "TODO",
        providerUrls: ["TODO"],
      }),
      4,
    ),
  ];

  for (const chainTx of chainTxs) {
    console.log("Adding chain registration");
    await chainTx.wait();
  }

  log.info("Deployed entries to Chain registry");

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
