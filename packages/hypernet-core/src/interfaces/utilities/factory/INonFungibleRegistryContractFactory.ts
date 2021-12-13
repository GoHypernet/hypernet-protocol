import { INonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/governance-sdk";
import { EthereumContractAddress } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface INonFungibleRegistryContractFactory {
  factoryNonFungibleRegistryEnumerableUpgradeableContract(
    contractAddress: EthereumContractAddress,
  ): ResultAsync<INonFungibleRegistryEnumerableUpgradeableContract, never>;
}

export const INonFungibleRegistryContractFactoryType = Symbol.for("INonFungibleRegistryContractFactory");