import {
  BlockchainUnavailableError,
  EthereumAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryRepository {
  getRegistries(): ResultAsync<Registry[], BlockchainUnavailableError>;
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
}

export const IRegistryRepositoryType = Symbol.for("IRegistryRepository");
