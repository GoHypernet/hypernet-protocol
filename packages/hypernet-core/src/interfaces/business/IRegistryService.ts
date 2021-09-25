import {
  BlockchainUnavailableError,
  EthereumAddress,
  RegistryEntry,
  Registry,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryService {
  getRegistries(
    numberOfRegistries: number,
  ): ResultAsync<Registry[], BlockchainUnavailableError>;
  getRegistryByName(
    registryName: string,
  ): ResultAsync<Registry, BlockchainUnavailableError>;
  getRegistryByAddress(
    registryAddress: EthereumAddress,
  ): ResultAsync<Registry, BlockchainUnavailableError>;
  getRegistryEntries(
    registryName: string,
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
}
