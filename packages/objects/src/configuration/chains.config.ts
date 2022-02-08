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
      EthereumContractAddress("0x6408D38D12F97C33e31D3D7C698FfDb6870e8217"), // liquidityRegistry
      EthereumContractAddress("0x10C6FA5fb8A6C6b97126501E24b70F5e9CcF2E80"), // tokenRegistry
      EthereumContractAddress("0x973d5Ab6084B2c6AB30762d7137204287e7f0276"), // chainRegistry
      EthereumContractAddress("0x48005e7dDF065DE036Bf0D693DDb0011aE7a041c"), // hypernetProfileRegistry
      EthereumContractAddress("0x973d5Ab6084B2c6AB30762d7137204287e7f0276"), // modulesRegistry
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
      EthereumContractAddress("0x29A5Df5784eC1e58a03557e825470A217534C816"), // liquidityRegistry
      EthereumContractAddress("0xa0E2E37c8bA56cD19fe3BD70f8c9390C0e3Dd5d8"), // tokenRegistry
      EthereumContractAddress("0x973d5Ab6084B2c6AB30762d7137204287e7f0276"), // chainRegistry
      EthereumContractAddress("0x48005e7dDF065DE036Bf0D693DDb0011aE7a041c"), // hypernetProfileRegistry
      EthereumContractAddress("0xbb55fe723929CcB45a12C03fc91EBeD5407C8a6A"), // modulesRegistry
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
      EthereumContractAddress("0x29A5Df5784eC1e58a03557e825470A217534C816"), // liquidityRegistry
      EthereumContractAddress("0x10C6FA5fb8A6C6b97126501E24b70F5e9CcF2E80"), // tokenRegistry
      EthereumContractAddress("0xCdFa906b330485021fD37d5E3Ceab4F11D5101c6"), // chainRegistry
      EthereumContractAddress("0x48005e7dDF065DE036Bf0D693DDb0011aE7a041c"), // hypernetProfileRegistry
      EthereumContractAddress("0x973d5Ab6084B2c6AB30762d7137204287e7f0276"), // modulesRegistry
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
      EthereumContractAddress("0xc616c67f9c680E662103b26cEfFcC70a121CD5d5"), // liquidityRegistry
      EthereumContractAddress("0x4BE5BA85859B124a52fBE822d042AcdCd3b4eC4D"), // tokenRegistry
      EthereumContractAddress("TODO"), // chainRegistry
      EthereumContractAddress("0x6c355Ad248477eeDcadf1d6724154C6152C0edca"), // hypernetProfileRegistry
      EthereumContractAddress("0xfEb1CA801C76Fd1b81b851C7E6d2544ce9DAdCA8"), // modulesRegistry
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
      EthereumContractAddress("TODO"), // liquidityRegistry
      EthereumContractAddress("TODO"), // tokenRegistry
      EthereumContractAddress("TODO"), // chainRegistry
      EthereumContractAddress("T0D0"), // hypernetProfileRegistry
      EthereumContractAddress("TODO"), // modulesRegistry
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
      EthereumContractAddress("TODO"), // liquidityRegistry
      EthereumContractAddress("TODO"), // tokenRegistry
      EthereumContractAddress("TODO"), // chainRegistry
      EthereumContractAddress("0x91AE7a63d375CE3869436c1bFE3F7c56ce70c3ad"), // hypernetProfileRegistry
      EthereumContractAddress("0xDC7C87A076ccB379bfB1092B44332278C8B2cbF5"), // modulesRegistry
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
      EthereumContractAddress("TODO"), // liquidityRegistry
      EthereumContractAddress("TODO"), // tokenRegistry
      EthereumContractAddress("TODO"), // chainRegistry
      EthereumContractAddress("0xa6C15b6950dfd9aB3FA3ba7fAb9F420e52B22f17"), // hypernetProfileRegistry
      EthereumContractAddress("0x9a35a007F08809DED1452C78338CCddbEaa1CEE3"), // modulesRegistry
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
      EthereumContractAddress("TODO"), // liquidityRegistry
      EthereumContractAddress("TODO"), // tokenRegistry
      EthereumContractAddress("TODO"), // chainRegistry
      EthereumContractAddress("0xf51499e303E6Af9895147a170C6b2Cd9e407a868"), // hypernetProfileRegistry
      EthereumContractAddress("0xBe6442D06a9Dc6B66cAB3B05703aA64FFE1Bf468"), // modulesRegistry
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
]);
