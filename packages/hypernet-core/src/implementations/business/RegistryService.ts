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
    numberOfRegistries: number,
  ): ResultAsync<Registry[], BlockchainUnavailableError> {
    return this.registryRepository.getRegistries(numberOfRegistries);
  }

  public getRegistryByName(
    registryName: string,
  ): ResultAsync<Registry, BlockchainUnavailableError> {
    return this.registryRepository.getRegistryByName(registryName);
  }

  public getRegistryByAddress(
    registryAddress: EthereumAddress,
  ): ResultAsync<Registry, BlockchainUnavailableError> {
    return this.registryRepository.getRegistryByAddress(registryAddress);
  }

  public getRegistryEntries(
    registryName: string,
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError> {
    return this.registryRepository.getRegistryEntries(registryName);
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
