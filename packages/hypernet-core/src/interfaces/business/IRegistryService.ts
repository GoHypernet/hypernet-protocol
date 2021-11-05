import {
  BlockchainUnavailableError,
  EthereumAddress,
  RegistryEntry,
  Registry,
  RegistryParams,
  RegistryPermissionError,
  ERegistrySortOrder,
  RegistryFactoryContractError,
  NonFungibleRegistryContractError,
  GovernanceSignerUnavailableError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryService {
  getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    Registry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getRegistryByName(
    registryNames: string[],
  ): ResultAsync<
    Map<string, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<
    Map<EthereumAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getRegistryEntries(
    registryName: string,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: number,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
  >;
  updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<
    Map<string, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getNumberOfRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  createRegistryEntry(
    registryName: string,
    label: string,
    recipientAddress: EthereumAddress,
    data: string,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  transferRegistryEntry(
    registryName: string,
    tokenId: number,
    transferToAddress: EthereumAddress,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  burnRegistryEntry(
    registryName: string,
    tokenId: number,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError>;
  grantRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  revokeRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  renounceRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  initializeReadOnly(): ResultAsync<void, never>;
  initializeForWrite(): ResultAsync<void, GovernanceSignerUnavailableError>;
}
