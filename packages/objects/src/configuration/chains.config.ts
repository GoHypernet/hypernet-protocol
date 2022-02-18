import { ChainId } from "@objects/ChainId";
import {
  ChainInformation,
  GovernanceChainInformation,
} from "@objects/ChainInformation";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { ProviderUrl } from "@objects/ProviderUrl";
import { RegistryModulesNames } from "@objects/RegistryModulesNames";
import { RegistryNames } from "@objects/RegistryNames";
import { RegistryName } from "@objects/RegistryName";

export const chainConfig = new Map<ChainId, ChainInformation>([
  [
    ChainId(1337),
    new GovernanceChainInformation(
      "Local Development Chain",
      ChainId(1337),
      true,
      true,
      EthereumContractAddress("0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da"), // channelFactory
      EthereumContractAddress("0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F"), // transferRegistry
      EthereumContractAddress("0xAa588d3737B611baFD7bD713445b314BD453a5C8"), // hypertoken
      EthereumContractAddress("0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6"), // messageTransfer
      EthereumContractAddress("0x30753E4A8aad7F8597332E813735Def5dD395028"), // insuranceTransfer
      EthereumContractAddress("0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4"), // parameterizedTransfer
      EthereumContractAddress("0xdDA6327139485221633A1FcD65f4aC932E60A2e1"), // hypernetGovernor
      EthereumContractAddress("0x82D50AD3C1091866E258Fd0f1a7cC9674609D254"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [ProviderUrl("http://localhost:8545")],
    ),
  ],
  [
    ChainId(31337),
    new GovernanceChainInformation(
      "Local Development Hardhat Chain",
      ChainId(31337),
      true,
      true,
      EthereumContractAddress("0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da"), // channelFactory
      EthereumContractAddress("0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F"), // transferRegistry
      EthereumContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"), // hypertoken
      EthereumContractAddress("0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6"), // messageTransfer
      EthereumContractAddress("0x30753E4A8aad7F8597332E813735Def5dD395028"), // insuranceTransfer
      EthereumContractAddress("0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4"), // parameterizedTransfer
      EthereumContractAddress("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"), // hypernetGovernor
      EthereumContractAddress("0x610178dA211FEF7D417bC0e6FeD39F05609AD788"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [ProviderUrl("http://localhost:8545")],
    ),
  ],
  [
    ChainId(1369),
    new GovernanceChainInformation(
      "Dev Environment Chain",
      ChainId(1369),
      true,
      false,
      EthereumContractAddress("0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da"), // channelFactory
      EthereumContractAddress("0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F"), // transferRegistry
      EthereumContractAddress("0xAa588d3737B611baFD7bD713445b314BD453a5C8"), // hypertoken
      EthereumContractAddress("0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6"), // messageTransfer
      EthereumContractAddress("0x30753E4A8aad7F8597332E813735Def5dD395028"), // insuranceTransfer
      EthereumContractAddress("0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4"), // parameterizedTransfer
      EthereumContractAddress("0xdDA6327139485221633A1FcD65f4aC932E60A2e1"), // hypernetGovernor
      EthereumContractAddress("0x82D50AD3C1091866E258Fd0f1a7cC9674609D254"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [ProviderUrl("https://eth-provider-dev.hypernetlabs.io")],
    ),
  ],
  [
    ChainId(4),
    new GovernanceChainInformation(
      "Rinkeby",
      ChainId(4),
      true,
      false,
      EthereumContractAddress("0xC82e22B0Ef5808DE0F7E9CeB265499e29012b02c"), // channelFactory
      EthereumContractAddress("0x4b86a332d76b21933d245fEF7636B1019EE6C824"), // transferRegistry
      EthereumContractAddress("0x6D4eE7f794103672490830e15308A99eB7a89024"), // hypertoken
      EthereumContractAddress("0x9E86dd60e0B1e7e142F033d1BdEf734c6b3224Bb"), // messageTransfer
      EthereumContractAddress("0xed911640fd86f92fD1337526010adda8F3Eb8344"), // insuranceTransfer
      EthereumContractAddress("0x5FAe7F15Ae20A10053CCca1DcFce0E2Bb4D50A7d"), // parameterizedTransfer
      EthereumContractAddress("0x3353da0f24fCACd83832b09e9371a937195D2640"), // hypernetGovernor
      EthereumContractAddress("0x60eFCb4dDA1bef87aA244006273e3DdDb0E4abCB"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [ProviderUrl("https://rinkeby.hypernet.foundation")],
    ),
  ],
  [
    ChainId(1),
    new GovernanceChainInformation(
      "MainNet",
      ChainId(1),
      true,
      false,
      EthereumContractAddress("TODO"), // channelFactory
      EthereumContractAddress("TODO"), // transferRegistry
      EthereumContractAddress("TODO"), // hypertoken
      EthereumContractAddress("TODO"), // messageTransfer
      EthereumContractAddress("TODO"), // insuranceTransfer
      EthereumContractAddress("TODO"), // parameterizedTransfer
      EthereumContractAddress("TODO"), // hypernetGovernor
      EthereumContractAddress("TODO"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [ProviderUrl("https://mainnet.hypernet.foundation")],
    ),
  ],
  [
    ChainId(137),
    new GovernanceChainInformation(
      "Polygon Mainnet",
      ChainId(137),
      true,
      false,
      EthereumContractAddress("TODO"), // channelFactory
      EthereumContractAddress("TODO"), // transferRegistry
      EthereumContractAddress("TODO"), // hypertoken
      EthereumContractAddress("TODO"), // messageTransfer
      EthereumContractAddress("TODO"), // insuranceTransfer
      EthereumContractAddress("TODO"), // parameterizedTransfer
      EthereumContractAddress("TODO"), // hypernetGovernor
      EthereumContractAddress("0xd93fbc9d330c5a1d242d01c0f10115483a062d7c"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [
        ProviderUrl(
          "https://polygon-mainnet.infura.io/v3/d9f9f416d1e94778a11cabc1ddc5e931",
        ),
      ],
    ),
  ],
  [
    ChainId(80001),
    new GovernanceChainInformation(
      "Polygon Mumbai",
      ChainId(80001),
      true,
      false,
      EthereumContractAddress("TODO"), // channelFactory
      EthereumContractAddress("TODO"), // transferRegistry
      EthereumContractAddress("TODO"), // hypertoken
      EthereumContractAddress("TODO"), // messageTransfer
      EthereumContractAddress("TODO"), // insuranceTransfer
      EthereumContractAddress("TODO"), // parameterizedTransfer
      EthereumContractAddress("TODO"), // hypernetGovernor
      EthereumContractAddress("0x6cd4a3319B5E2173Fb44e21B5b506da35ada9899"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [
        ProviderUrl(
          "https://polygon-mumbai.infura.io/v3/d9f9f416d1e94778a11cabc1ddc5e931",
        ),
      ],
    ),
  ],
  [
    ChainId(43113),
    new GovernanceChainInformation(
      "Avalanche Fuji",
      ChainId(43113),
      true,
      false,
      EthereumContractAddress("TODO"), // channelFactory
      EthereumContractAddress("TODO"), // transferRegistry
      EthereumContractAddress("TODO"), // hypertoken
      EthereumContractAddress("TODO"), // messageTransfer
      EthereumContractAddress("TODO"), // insuranceTransfer
      EthereumContractAddress("TODO"), // parameterizedTransfer
      EthereumContractAddress("TODO"), // hypernetGovernor
      EthereumContractAddress("0xc5b292502cDb63f6c19A9a85a29B5F5834b9146a"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [
        ProviderUrl(
          "https://f0fa7eba-0c1b-4f3f-bc37-67ba6ae2b60a.hypernetlabs.io/http/ext/bc/C/rpc",
        ),
      ],
    ),
  ],
  [
    ChainId(43114),
    new GovernanceChainInformation(
      "Avalanche Mainnet",
      ChainId(43114),
      true,
      false,
      EthereumContractAddress("TODO"), // channelFactory
      EthereumContractAddress("TODO"), // transferRegistry
      EthereumContractAddress("TODO"), // hypertoken
      EthereumContractAddress("TODO"), // messageTransfer
      EthereumContractAddress("TODO"), // insuranceTransfer
      EthereumContractAddress("TODO"), // parameterizedTransfer
      EthereumContractAddress("TODO"), // hypernetGovernor
      EthereumContractAddress("0xc5b292502cDb63f6c19A9a85a29B5F5834b9146a"), // registryFactory
      new RegistryNames(
        RegistryName("Hypernet Profiles"),
        RegistryName("Gateways"),
        RegistryName("Liquidity Providers"),
        RegistryName("Payment Tokens"),
        RegistryName("Registry Modules"),
        RegistryName("Hypernet.ID"),
      ),
      new RegistryModulesNames("Batch Minting", "Lazy Minting", "Merkle Drop"),
      [
        ProviderUrl(
          "https://053e1c5c-66fd-49c3-b267-42ab5f9202c6.hypernetlabs.io/http/ext/bc/C/rpc",
        ),
      ],
    ),
  ],
]);
