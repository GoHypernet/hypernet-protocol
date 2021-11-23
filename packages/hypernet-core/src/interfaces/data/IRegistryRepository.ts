import {
  BlockchainUnavailableError,
  ERC20ContractError,
  ERegistrySortOrder,
  GovernanceSignerUnavailableError,
  InvalidParametersError,
  NonFungibleRegistryContractError,
  EthereumAccountAddress,
  EthereumContractAddress,
  Registry,
  RegistryEntry,
  RegistryFactoryContractError,
  RegistryParams,
  RegistryPermissionError,
  RegistryTokenId,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryRepository {
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
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
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
    tokenId: RegistryTokenId,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: RegistryTokenId,
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
    tokenId: RegistryTokenId,
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
    recipientAddress: EthereumAccountAddress,
    data: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ERC20ContractError
  >;
  transferRegistryEntry(
    registryName: string,
    tokenId: RegistryTokenId,
    transferToAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  burnRegistryEntry(
    registryName: string,
    tokenId: RegistryTokenId,
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
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError | ERC20ContractError>;
  grantRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  revokeRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  renounceRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  >;
  initializeReadOnly(): ResultAsync<void, never>;
  initializeForWrite(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;
}

export const IRegistryRepositoryType = Symbol.for("IRegistryRepository");
