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
  RegistryModule,
  BatchModuleContractError,
  LazyMintModuleContractError,
  PersistenceError,
  VectorError,
  LazyMintingSignature,
  RegistryName,
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
    registryNames: RegistryName[],
  ): ResultAsync<
    Map<RegistryName, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getRegistryByAddress(
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getRegistryEntries(
    registryName: RegistryName,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getRegistryEntryDetailByTokenId(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  updateRegistryEntryTokenURI(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  >;
  updateRegistryEntryLabel(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  >;
  getRegistryEntriesTotalCount(
    registryNames: RegistryName[],
  ): ResultAsync<
    Map<RegistryName, number>,
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
    | GovernanceSignerUnavailableError
  >;
  createRegistryEntry(
    registryName: RegistryName,
    newRegistryEntry: RegistryEntry,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ERC20ContractError
    | GovernanceSignerUnavailableError
  >;
  transferRegistryEntry(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
    transferToAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  >;
  burnRegistryEntry(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  >;
  createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    void,
    | RegistryFactoryContractError
    | ERC20ContractError
    | BlockchainUnavailableError
  >;
  grantRegistrarRole(
    registryName: RegistryName,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  >;
  revokeRegistrarRole(
    registryName: RegistryName,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  >;
  renounceRegistrarRole(
    registryName: RegistryName,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  >;
  initializeReadOnly(): ResultAsync<void, never>;
  initializeForWrite(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;
  getRegistryEntryByOwnerAddress(
    registryName: RegistryName,
    ownerAddress: EthereumAccountAddress,
    index: number,
  ): ResultAsync<
    RegistryEntry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  getRegistryModules(): ResultAsync<
    RegistryModule[],
    NonFungibleRegistryContractError | RegistryFactoryContractError
  >;
  createBatchRegistryEntry(
    registryName: RegistryName,
    newRegistryEntries: RegistryEntry[],
  ): ResultAsync<
    void,
    | BatchModuleContractError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
  >;
  getRegistryEntryListByOwnerAddress(
    registryName: RegistryName,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  submitLazyMintSignature(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
    ownerAddress: EthereumAccountAddress,
    registrationData: string,
  ): ResultAsync<
    void,
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | PersistenceError
    | VectorError
  >;
  getRegistryEntryListByUsername(
    registryName: RegistryName,
    username: string,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  >;
  retrieveLazyMintingSignatures(): ResultAsync<
    LazyMintingSignature[],
    PersistenceError | BlockchainUnavailableError | VectorError
  >;
  executeLazyMint(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    | InvalidParametersError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | LazyMintModuleContractError
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
  >;
  revokeLazyMintSignature(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
}

export const IRegistryRepositoryType = Symbol.for("IRegistryRepository");
