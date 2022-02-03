import { ResultAsync } from "neverthrow";

import { ChainId } from "@objects/ChainId";
import {
  BlockchainUnavailableError,
  PersistenceError,
  VectorError,
  InvalidParametersError,
  ProxyError,
  RegistryPermissionError,
  RegistryFactoryContractError,
  NonFungibleRegistryContractError,
  ERC20ContractError,
  GovernanceSignerUnavailableError,
  BatchModuleContractError,
  LazyMintModuleContractError,
  IPFSUnavailableError,
} from "@objects/errors";
import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";
import { Registry } from "@objects/Registry";
import { RegistryEntry } from "@objects/RegistryEntry";
import { RegistryParams } from "@objects/RegistryParams";
import { RegistryTokenId } from "@objects/RegistryTokenId";
import { ERegistrySortOrder } from "@objects/typing";
import { RegistryModule } from "@objects/RegistryModule";
import { InitializeStatus } from "@objects/InitializeStatus";
import { LazyMintingSignature } from "@objects/LazyMintingSignature";

export interface IHypernetRegistries {
  registriesInitialized(chainId?: ChainId): ResultAsync<boolean, ProxyError>;

  waitRegistriesInitialized(chainId?: ChainId): ResultAsync<void, ProxyError>;

  initializeRegistries(
    chainId?: ChainId,
  ): ResultAsync<
    InitializeStatus,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
    | IPFSUnavailableError
    | ProxyError
  >;

  getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    Registry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryByName(
    registryNames: string[],
  ): ResultAsync<
    Map<string, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryByAddress(
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryEntries(
    registryName: string,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
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
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  updateRegistryEntryLabel(
    registryName: string,
    tokenId: RegistryTokenId,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<
    Map<string, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getNumberOfRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  createRegistryEntry(
    registryName: string,
    newRegistryEntry: RegistryEntry,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ERC20ContractError
    | ProxyError
    | GovernanceSignerUnavailableError
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
    | ProxyError
    | GovernanceSignerUnavailableError
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
    | ProxyError
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
    | ProxyError
  >;

  grantRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  revokeRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  renounceRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  getRegistryEntryByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
    index: number,
  ): ResultAsync<
    RegistryEntry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryModules(): ResultAsync<
    RegistryModule[],
    NonFungibleRegistryContractError | ProxyError
  >;

  createBatchRegistryEntry(
    registryName: string,
    newRegistryEntries: RegistryEntry[],
  ): ResultAsync<
    void,
    | BatchModuleContractError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | ProxyError
  >;

  getRegistryEntryListByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  submitLazyMintSignature(
    registryName: string,
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
    | ProxyError
  >;

  getRegistryEntryListByUsername(
    registryName: string,
    username: string,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  retrieveLazyMintingSignatures(): ResultAsync<
    LazyMintingSignature[],
    PersistenceError | BlockchainUnavailableError | VectorError | ProxyError
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
    | ProxyError
  >;

  revokeLazyMintSignature(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError | ProxyError
  >;
}
