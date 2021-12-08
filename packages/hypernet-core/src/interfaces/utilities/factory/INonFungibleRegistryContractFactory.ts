import { INonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/contracts";
import { EthereumContractAddress } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface INonFungibleRegistryContractFactory {
  factoryNonFungibleRegistryEnumerableUpgradeableContract(
    contractAddress: EthereumContractAddress,
  ): ResultAsync<INonFungibleRegistryEnumerableUpgradeableContract, never>;
}

export const INonFungibleRegistryContractFactoryType = Symbol.for("INonFungibleRegistryContractFactory");