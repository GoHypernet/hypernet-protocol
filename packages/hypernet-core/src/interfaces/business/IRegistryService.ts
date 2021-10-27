import {
  BlockchainUnavailableError,
  EthereumAddress,
  RegistryEntry,
  Registry,
  RegistryParams,
  RegistryPermissionError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryService {
  getRegistries(
    pageNumber: number,
    pageSize: number,
    reversedSorting: boolean,
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
    reversedSorting: boolean,
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
}
