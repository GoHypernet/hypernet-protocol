import {
  RegistryFactoryContractError,
  EthereumContractAddress,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ethers, BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IRegistryFactoryContract {
  addressToName(
    registryAddress: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError>;
  enumerableRegistries(
    index: number,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError>;
  nameToAddress(
    registryName: string,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError>;
  getNumberOfEnumerableRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError
  >;
  registrationFee(): ResultAsync<BigNumber, RegistryFactoryContractError>;
  getContractAddress(): EthereumContractAddress;
  getContract(): ethers.Contract | null;
  createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError>;
}

export const IRegistryFactoryContractType = Symbol.for(
  "IRegistryFactoryContract",
);
