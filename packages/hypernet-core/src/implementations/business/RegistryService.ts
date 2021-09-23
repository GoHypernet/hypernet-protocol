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
    protected RegistryRepository: IRegistryRepository,
  ) {}

  public getRegistries(): ResultAsync<Registry[], BlockchainUnavailableError> {
    return this.RegistryRepository.getRegistries();
  }

  public getRegistryByName(
    registryName: string,
  ): ResultAsync<Registry, BlockchainUnavailableError> {
    return this.RegistryRepository.getRegistryByName(registryName);
  }

  public getRegistryByAddress(
    registryAddress: EthereumAddress,
  ): ResultAsync<Registry, BlockchainUnavailableError> {
    return this.RegistryRepository.getRegistryByAddress(registryAddress);
  }

  public getRegistryEntries(
    registryName: string,
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError> {
    return this.RegistryRepository.getRegistryEntries(registryName);
  }

  public getRegistryEntryByLabel(
    registryName: string,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.RegistryRepository.getRegistryEntryByLabel(registryName, label);
  }
}
