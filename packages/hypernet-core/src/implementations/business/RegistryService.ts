import {
  BlockchainUnavailableError,
  EthereumAccountAddress,
  RegistryEntry,
  Registry,
  RegistryParams,
  RegistryPermissionError,
  ERegistrySortOrder,
  NonFungibleRegistryContractError,
  RegistryFactoryContractError,
  GovernanceSignerUnavailableError,
  ERC20ContractError,
  EthereumContractAddress,
  RegistryTokenId,
  RegistryModule,
  BatchModuleContractError,
  LazyMintModuleContractError,
  PersistenceError,
  VectorError,
  LazyMintingSignature,
  InvalidParametersError,
  RegistryName,
} from "@hypernetlabs/objects";
import { IRegistryService } from "@interfaces/business";
import { IRegistryRepository, IRegistryRepositoryType } from "@interfaces/data";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

export class RegistryService implements IRegistryService {
  constructor(
    @inject(IRegistryRepositoryType)
    protected registryRepository: IRegistryRepository,
  ) {}

  public getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    Registry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistries(
      pageNumber,
      pageSize,
      sortOrder,
    );
  }

  public getRegistryByName(
    registryNames: RegistryName[],
  ): ResultAsync<
    Map<RegistryName, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryByName(registryNames);
  }

  public getRegistryByAddress(
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryByAddress(registryAddresses);
  }

  public getRegistryEntriesTotalCount(
    registryNames: RegistryName[],
  ): ResultAsync<
    Map<RegistryName, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryEntriesTotalCount(registryNames);
  }

  public getRegistryEntries(
    registryName: RegistryName,
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryEntries(
      registryName,
      pageNumber,
      pageSize,
      sortOrder,
    );
  }

  public getRegistryEntryDetailByTokenId(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryEntryDetailByTokenId(
      registryName,
      tokenId,
    );
  }

  public updateRegistryEntryTokenURI(
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
  > {
    return this.registryRepository.updateRegistryEntryTokenURI(
      registryName,
      tokenId,
      registrationData,
    );
  }

  public updateRegistryEntryLabel(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryRepository.updateRegistryEntryLabel(
      registryName,
      tokenId,
      label,
    );
  }

  public getNumberOfRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getNumberOfRegistries();
  }

  public updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryRepository.updateRegistryParams(registryParams);
  }

  public createRegistryEntry(
    registryName: RegistryName,
    newRegistryEntry: RegistryEntry,
  ): ResultAsync<
    void,
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ERC20ContractError
    | GovernanceSignerUnavailableError
  > {
    return this.registryRepository.createRegistryEntry(
      registryName,
      newRegistryEntry,
    );
  }

  public transferRegistryEntry(
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
  > {
    return this.registryRepository.transferRegistryEntry(
      registryName,
      tokenId,
      transferToAddress,
    );
  }

  public burnRegistryEntry(
    registryName: RegistryName,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryRepository.burnRegistryEntry(registryName, tokenId);
  }

  public createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    void,
    | RegistryFactoryContractError
    | ERC20ContractError
    | BlockchainUnavailableError
  > {
    return this.registryRepository.createRegistryByToken(
      name,
      symbol,
      registrarAddress,
      enumerable,
    );
  }

  public grantRegistrarRole(
    registryName: RegistryName,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryRepository.grantRegistrarRole(registryName, address);
  }

  public revokeRegistrarRole(
    registryName: RegistryName,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryRepository.revokeRegistrarRole(registryName, address);
  }

  public renounceRegistrarRole(
    registryName: RegistryName,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return this.registryRepository.renounceRegistrarRole(registryName, address);
  }

  public getRegistryEntryByOwnerAddress(
    registryName: RegistryName,
    ownerAddress: EthereumAccountAddress,
    index: number,
  ): ResultAsync<
    RegistryEntry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryEntryByOwnerAddress(
      registryName,
      ownerAddress,
      index,
    );
  }

  public getRegistryModules(): ResultAsync<
    RegistryModule[],
    NonFungibleRegistryContractError | RegistryFactoryContractError
  > {
    return this.registryRepository.getRegistryModules();
  }

  public createBatchRegistryEntry(
    registryName: RegistryName,
    newRegistryEntries: RegistryEntry[],
  ): ResultAsync<
    void,
    | BatchModuleContractError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
  > {
    return this.registryRepository.createBatchRegistryEntry(
      registryName,
      newRegistryEntries,
    );
  }

  public getRegistryEntryListByOwnerAddress(
    registryName: RegistryName,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryEntryListByOwnerAddress(
      registryName,
      ownerAddress,
    );
  }

  public submitLazyMintSignature(
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
  > {
    return this.registryRepository.submitLazyMintSignature(
      registryName,
      tokenId,
      ownerAddress,
      registrationData,
    );
  }

  public getRegistryEntryListByUsername(
    registryName: RegistryName,
    username: string,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryEntryListByUsername(
      registryName,
      username,
    );
  }

  public retrieveLazyMintingSignatures(): ResultAsync<
    LazyMintingSignature[],
    PersistenceError | BlockchainUnavailableError | VectorError
  > {
    return this.registryRepository.retrieveLazyMintingSignatures();
  }

  public executeLazyMint(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    | InvalidParametersError
    | PersistenceError
    | VectorError
    | BlockchainUnavailableError
    | LazyMintModuleContractError
    | NonFungibleRegistryContractError
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
  > {
    return this.registryRepository.executeLazyMint(lazyMintingSignature);
  }

  public revokeLazyMintSignature(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.registryRepository.revokeLazyMintSignature(
      lazyMintingSignature,
    );
  }

  public initializeReadOnly(): ResultAsync<void, never> {
    return this.registryRepository.initializeReadOnly();
  }

  public initializeForWrite(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  > {
    return this.registryRepository.initializeForWrite();
  }
}
