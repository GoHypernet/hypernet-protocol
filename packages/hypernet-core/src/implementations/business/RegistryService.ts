import {
  BlockchainUnavailableError,
  EthereumAddress,
  RegistryEntry,
  Registry,
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
  ): ResultAsync<Registry[], BlockchainUnavailableError> {
    return this.registryRepository.getRegistries(pageNumber, pageSize);
  }

  public getRegistryByName(
    registryNames: string[],
  ): ResultAsync<Map<string, Registry>, BlockchainUnavailableError> {
    return this.registryRepository.getRegistryByName(registryNames);
  }

  public getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<Map<string, Registry>, BlockchainUnavailableError> {
    return this.registryRepository.getRegistryByAddress(registryAddresses);
  }

  public getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<Map<string, number>, BlockchainUnavailableError> {
    return this.registryRepository.getRegistryEntriesTotalCount(registryNames);
  }

  public getRegistryEntries(
    registryName: string,
    registryEntriesNumberArr?: number[],
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError> {
    return this.registryRepository.getRegistryEntries(
      registryName,
      registryEntriesNumberArr,
    );
  }

  public getRegistryEntryByLabel(
    registryName: string,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.registryRepository.getRegistryEntryByLabel(registryName, label);
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
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
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.registryRepository.updateRegistryEntryLabel(
      registryName,
      tokenId,
      label,
    );
  }
}
