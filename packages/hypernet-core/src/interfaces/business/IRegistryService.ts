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
  ): ResultAsync<Registry[], BlockchainUnavailableError>;
  getRegistryByName(
    registryNames: string[],
  ): ResultAsync<Map<string, Registry>, BlockchainUnavailableError>;
  getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<Map<EthereumAddress, Registry>, BlockchainUnavailableError>;
  getRegistryEntries(
    registryName: string,
    registryEntriesNumberArr?: number[],
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError>;
  getRegistryEntryByLabel(
    registryName: string,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError>;
  updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError>;
  updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError>;
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
  ): ResultAsync<
    RegistryEntry,
    BlockchainUnavailableError | RegistryPermissionError
  >;
}
