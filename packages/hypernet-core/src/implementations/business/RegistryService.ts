import {
  BlockchainUnavailableError,
  EthereumAddress,
  RegistryEntry,
  Registry,
  RegistryParams,
  RegistryPermissionError,
  ERegistrySortOrder,
  NonFungibleRegistryContractError,
  RegistryFactoryContractError,
  GovernanceSignerUnavailableError,
  ERC20ContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { inject } from "inversify";

import { IRegistryService } from "@interfaces/business";
import { IRegistryRepository, IRegistryRepositoryType } from "@interfaces/data";

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
    registryNames: string[],
  ): ResultAsync<
    Map<string, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryByName(registryNames);
  }

  public getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<
    Map<EthereumAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryByAddress(registryAddresses);
  }

  public getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<
    Map<string, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryRepository.getRegistryEntriesTotalCount(registryNames);
  }

  public getRegistryEntries(
    registryName: string,
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
    registryName: string,
    tokenId: number,
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
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
  > {
    return this.registryRepository.updateRegistryEntryTokenURI(
      registryName,
      tokenId,
      registrationData,
    );
  }

  public updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | BlockchainUnavailableError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | RegistryPermissionError
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
  > {
    return this.registryRepository.updateRegistryParams(registryParams);
  }

  public createRegistryEntry(
    registryName: string,
    label: string,
    recipientAddress: EthereumAddress,
    data: string,
  ): ResultAsync<
    void,
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ERC20ContractError
  > {
    return this.registryRepository.createRegistryEntry(
      registryName,
      label,
      recipientAddress,
      data,
    );
  }

  public transferRegistryEntry(
    registryName: string,
    tokenId: number,
    transferToAddress: EthereumAddress,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  > {
    return this.registryRepository.transferRegistryEntry(
      registryName,
      tokenId,
      transferToAddress,
    );
  }

  public burnRegistryEntry(
    registryName: string,
    tokenId: number,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  > {
    return this.registryRepository.burnRegistryEntry(registryName, tokenId);
  }

  public createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError | ERC20ContractError> {
    return this.registryRepository.createRegistryByToken(
      name,
      symbol,
      registrarAddress,
      enumerable,
    );
  }

  public grantRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  > {
    return this.registryRepository.grantRegistrarRole(registryName, address);
  }

  public revokeRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  > {
    return this.registryRepository.revokeRegistrarRole(registryName, address);
  }

  public renounceRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
  > {
    return this.registryRepository.renounceRegistrarRole(registryName, address);
  }
}
