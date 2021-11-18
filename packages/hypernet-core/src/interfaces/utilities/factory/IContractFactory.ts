import { INonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/contracts";
import { EthereumContractAddress } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IContractFactory {
  factoryNonFungibleRegistryEnumerableUpgradeableContract(
    contractAddress: EthereumContractAddress,
  ): ResultAsync<INonFungibleRegistryEnumerableUpgradeableContract, never>;
}

export const IContractFactoryType = Symbol.for("IContractFactory");