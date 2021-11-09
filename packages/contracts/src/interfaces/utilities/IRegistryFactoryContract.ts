import { ethers, BigNumber } from "ethers";

import {
  RegistryFactoryContractError,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryFactoryContract {
  addressToName(
    registryAddress: EthereumAddress,
  ): ResultAsync<EthereumAddress, RegistryFactoryContractError>;
  enumerableRegistries(
    index: number,
  ): ResultAsync<EthereumAddress, RegistryFactoryContractError>;
  nameToAddress(
    registryName: string,
  ): ResultAsync<EthereumAddress, RegistryFactoryContractError>;
  getNumberOfEnumerableRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError
  >;
  registrationFee(): ResultAsync<BigNumber, RegistryFactoryContractError>;
  getContractAddress(): EthereumAddress;
  getContract(): ethers.Contract | null;
  createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError>;
}

export const IRegistryFactoryContractType = Symbol.for(
  "IRegistryFactoryContract",
);
