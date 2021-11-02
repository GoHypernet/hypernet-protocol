import {
  BlockchainUnavailableError,
  ERegistrySortOrder,
  EthereumAddress,
  Registry,
  RegistryEntry,
  RegistryParams,
  RegistryPermissionError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { ethers } from "ethers";

export interface IRegistryRepository {
  getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<Registry[], BlockchainUnavailableError>;
  getRegistryByName(
    registryNames: string[],
  ): ResultAsync<Map<string, Registry>, BlockchainUnavailableError>;
  getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<Map<EthereumAddress, Registry>, BlockchainUnavailableError>;
  getRegistryEntries(
    registryName: string,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError>;
  getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: number,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError>;
  updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    BlockchainUnavailableError | RegistryPermissionError
  >;
  updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    BlockchainUnavailableError | RegistryPermissionError
  >;
  getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<Map<string, number>, BlockchainUnavailableError>;
  getNumberOfRegistries(): ResultAsync<number, BlockchainUnavailableError>;
  updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    BlockchainUnavailableError | RegistryPermissionError
  >;
  createRegistryEntry(
    registryName: string,
    label: string,
    recipientAddress: EthereumAddress,
    data: string,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError>;
  transferRegistryEntry(
    registryName: string,
    tokenId: number,
    transferToAddress: EthereumAddress,
  ): ResultAsync<
    RegistryEntry,
    BlockchainUnavailableError | RegistryPermissionError
  >;
  burnRegistryEntry(
    registryName: string,
    tokenId: number,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError>;
  createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<void, BlockchainUnavailableError>;
  grantRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError>;
  revokeRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError>;
  renounceRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError>;
  initializeReadOnly(): ResultAsync<void, BlockchainUnavailableError>;
  initializeForWrite(): ResultAsync<void, BlockchainUnavailableError>;
}

export const IRegistryRepositoryType = Symbol.for("IRegistryRepository");
