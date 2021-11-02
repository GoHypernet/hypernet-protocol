import { ethers } from "ethers";

import {
  RegistryFactoryContractError,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryFactoryContract {
  initializeContract(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
    contractAddress: EthereumAddress,
  ): void;
  addressToName(
    registryAddress: EthereumAddress,
  ): ResultAsync<EthereumAddress, RegistryFactoryContractError>;
}

export const IRegistryFactoryContractType = Symbol.for(
  "IRegistryFactoryContract",
);
