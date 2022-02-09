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
import { RegistryName } from "@objects/RegistryName";

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
    registryNames: RegistryName[],
  ): ResultAsync<
    Map<RegistryName, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryByAddress(
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryEntries(
    registryName: RegistryName,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryEntryDetailByTokenId(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
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
    | ProxyError
    | GovernanceSignerUnavailableError
  >;

  updateRegistryEntryLabel(
    registryName: RegistryName,
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
    registryNames: RegistryName[],
  ): ResultAsync<
    Map<RegistryName, number>,
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
    registryName: RegistryName,
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
    registryName: RegistryName,
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
    registryName: RegistryName,
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
    registryName: RegistryName,
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
    registryName: RegistryName,
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
    registryName: RegistryName,
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
    registryName: RegistryName,
    ownerAddress: EthereumAccountAddress,
    index: number,
  ): ResultAsync<
    RegistryEntry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
  >;

  getRegistryModules(): ResultAsync<
    RegistryModule[],
    NonFungibleRegistryContractError | RegistryFactoryContractError | ProxyError
  >;

  createBatchRegistryEntry(
    registryName: RegistryName,
    newRegistryEntries: RegistryEntry[],
  ): ResultAsync<
    void,
    | BatchModuleContractError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | ProxyError
  >;

  getRegistryEntryListByOwnerAddress(
    registryName: RegistryName,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError | ProxyError
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
    | ProxyError
  >;

  getRegistryEntryListByUsername(
    registryName: RegistryName,
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
    | RegistryFactoryContractError
    | ProxyError
  >;

  revokeLazyMintSignature(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError | ProxyError
  >;
}
