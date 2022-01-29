import {
  IRegistryFactoryContract,
  IERC20Contract,
  INonFungibleRegistryEnumerableUpgradeableContract,
  RegistryFactoryContract,
  ERC20Contract,
  NonFungibleRegistryEnumerableUpgradeableContract,
  BatchModuleContract,
  IBatchModuleContract,
  LazyMintModuleContract,
  ILazyMintModuleContract,
} from "@hypernetlabs/governance-sdk";
import {
  BlockchainUnavailableError,
  ERC20ContractError,
  ERegistrySortOrder,
  GovernanceSignerUnavailableError,
  InvalidParametersError,
  NonFungibleRegistryContractError,
  EthereumContractAddress,
  Registry,
  RegistryEntry,
  RegistryFactoryContractError,
  RegistryParams,
  RegistryPermissionError,
  EthereumAccountAddress,
  RegistryTokenId,
  RegistryModule,
  BatchModuleContractError,
  LazyMintModuleContractError,
  RegistryModuleCapability,
  Signature,
  LazyMintingSignatureSchema,
  PersistenceError,
  VectorError,
  LazyMintingSignature,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IRegistryRepository } from "@interfaces/data";
import { BigNumber, ethers } from "ethers";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IDIDDataStoreProvider,
  IDIDDataStoreProviderType,
} from "@interfaces/utilities";
import { HypernetConfig } from "@interfaces/objects";
import { DIDDataStore } from "@glazed/did-datastore";

@injectable()
export class RegistryRepository implements IRegistryRepository {
  protected provider: ethers.providers.Provider | undefined;
  protected signer: ethers.providers.JsonRpcSigner | undefined;
  protected registryFactoryContract: IRegistryFactoryContract =
    {} as RegistryFactoryContract;
  protected tokenERC20Contract: IERC20Contract = {} as ERC20Contract;
  protected nonFungibleRegistryContract: INonFungibleRegistryEnumerableUpgradeableContract =
    {} as NonFungibleRegistryEnumerableUpgradeableContract;
  protected batchModuleContract: IBatchModuleContract =
    {} as BatchModuleContract;
  protected lazyMintModuleContract: ILazyMintModuleContract =
    {} as LazyMintModuleContract;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDIDDataStoreProviderType)
    protected didDataStoreProvider: IDIDDataStoreProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<
    Registry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryFactoryContract
      .getNumberOfEnumerableRegistries()
      .andThen((totalCount) => {
        const registryListResult: ResultAsync<
          Registry | null,
          RegistryFactoryContractError | NonFungibleRegistryContractError
        >[] = [];

        for (let i = 1; i <= Math.min(totalCount, pageSize); i++) {
          let index;
          if (sortOrder == ERegistrySortOrder.DEFAULT) {
            index = totalCount - (pageNumber - 1) * pageSize - i;
          } else {
            index = i + pageNumber * pageSize - pageSize - 1;
          }

          if (index >= 0 && index < totalCount) {
            registryListResult.push(this.getRegistryByIndex(index));
          }
        }

        return ResultUtils.combine(registryListResult).map((vals) => {
          const registryList: Registry[] = [];
          vals.forEach((registry) => {
            if (registry != null) {
              registryList.push(registry);
            }
          });
          return registryList;
        });
      });
  }

  public getRegistryByName(
    registryNames: string[],
  ): ResultAsync<
    Map<string, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getRegistryModules(),
    ]).andThen((vals) => {
      const [config, registryModules] = vals;
      const registriesMap: Map<string, Registry> = new Map();
      return ResultUtils.combine(
        registryNames.map((registryName) => {
          return this.registryFactoryContract
            .nameToAddress(registryName)
            .andThen((registryAddress) => {
              if (this.provider == null) {
                throw new Error("No provider available!");
              }

              // Call the NFI contract of that address
              this.nonFungibleRegistryContract =
                new NonFungibleRegistryEnumerableUpgradeableContract(
                  this.provider,
                  registryAddress,
                );

              // Get the symbol and NumberOfEntries of that registry address
              return ResultUtils.combine([
                this.nonFungibleRegistryContract.getRegistrarRoleMember(
                  registryAddress,
                ),
                this.nonFungibleRegistryContract.getRegistrarRoleAdminMember(
                  registryAddress,
                ),
                this.nonFungibleRegistryContract.symbol(registryAddress),
                this.nonFungibleRegistryContract.totalSupply(registryAddress),
                this.nonFungibleRegistryContract.allowStorageUpdate(
                  registryAddress,
                ),
                this.nonFungibleRegistryContract.allowLabelChange(
                  registryAddress,
                ),
                this.nonFungibleRegistryContract.allowTransfers(
                  registryAddress,
                ),
                this.nonFungibleRegistryContract.registrationToken(
                  registryAddress,
                ),
                this.nonFungibleRegistryContract.registrationFee(
                  registryAddress,
                ),
                this.nonFungibleRegistryContract.burnAddress(registryAddress),
                this.nonFungibleRegistryContract.burnFee(registryAddress),
                this.nonFungibleRegistryContract.primaryRegistry(
                  registryAddress,
                ),
              ]).map((vals) => {
                const [
                  registrarAddresses,
                  registrarAdminAddresses,
                  registrySymbol,
                  registryNumberOfEntries,
                  allowStorageUpdate,
                  allowLabelChange,
                  allowTransfers,
                  registrationToken,
                  registrationFee,
                  burnAddress,
                  burnFee,
                  primaryRegistry,
                ] = vals;

                const batchModule = registryModules.find(
                  (registryModule) =>
                    registryModule.name ===
                    config.governanceChainInformation.registryModulesNames
                      .batchMintingModule,
                );

                const lazyMintModule = registryModules.find(
                  (registryModule) =>
                    registryModule.name ===
                    config.governanceChainInformation.registryModulesNames
                      .lazyMintingModule,
                );

                const modulesCapability = new RegistryModuleCapability(
                  registryAddress,
                  registrarAddresses.some(
                    (registrarAddress) =>
                      EthereumContractAddress(registrarAddress) ===
                      batchModule?.address,
                  ),
                  registrarAddresses.some(
                    (registrarAddress) =>
                      EthereumContractAddress(registrarAddress) ===
                      lazyMintModule?.address,
                  ),
                );

                registriesMap.set(
                  registryName,
                  new Registry(
                    registrarAddresses,
                    registrarAdminAddresses,
                    registryAddress,
                    registryName,
                    registrySymbol,
                    registryNumberOfEntries,
                    allowStorageUpdate,
                    allowLabelChange,
                    allowTransfers,
                    registrationToken,
                    registrationFee,
                    burnAddress,
                    burnFee,
                    primaryRegistry,
                    modulesCapability,
                    null,
                  ),
                );
              });
            });
        }),
      ).map(() => {
        return registriesMap;
      });
    });
  }

  public getRegistryByAddress(
    registryAddresses: EthereumContractAddress[],
  ): ResultAsync<
    Map<EthereumContractAddress, Registry>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    const registriesMap: Map<EthereumContractAddress, Registry> = new Map();

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getRegistryModules(),
    ]).andThen((vals) => {
      const [config, registryModules] = vals;
      return ResultUtils.combine(
        registryAddresses.map((registryAddress) => {
          if (this.provider == null) {
            throw new Error("No provider available!");
          }

          // Call the NFT contract of that address
          this.nonFungibleRegistryContract =
            new NonFungibleRegistryEnumerableUpgradeableContract(
              this.provider,
              registryAddress,
            );

          // Get the symbol and NumberOfEntries of that registry address
          return ResultUtils.combine([
            this.nonFungibleRegistryContract.getRegistrarRoleMember(
              registryAddress,
            ),
            this.nonFungibleRegistryContract.getRegistrarRoleAdminMember(
              registryAddress,
            ),
            this.nonFungibleRegistryContract.name(registryAddress),
            this.nonFungibleRegistryContract.symbol(registryAddress),
            this.nonFungibleRegistryContract.totalSupply(registryAddress),
            this.nonFungibleRegistryContract.allowStorageUpdate(
              registryAddress,
            ),
            this.nonFungibleRegistryContract.allowLabelChange(registryAddress),
            this.nonFungibleRegistryContract.allowTransfers(registryAddress),
            this.nonFungibleRegistryContract.registrationToken(registryAddress),
            this.nonFungibleRegistryContract.registrationFee(registryAddress),
            this.nonFungibleRegistryContract.burnAddress(registryAddress),
            this.nonFungibleRegistryContract.burnFee(registryAddress),
            this.nonFungibleRegistryContract.primaryRegistry(registryAddress),
          ]).map((vals) => {
            const [
              registrarAddresses,
              registrarAdminAddresses,
              registryName,
              registrySymbol,
              registryNumberOfEntries,
              allowStorageUpdate,
              allowLabelChange,
              allowTransfers,
              registrationToken,
              registrationFee,
              burnAddress,
              burnFee,
              primaryRegistry,
            ] = vals;

            const batchModule = registryModules.find(
              (registryModule) =>
                registryModule.name ===
                config.governanceChainInformation.registryModulesNames
                  .batchMintingModule,
            );

            const lazyMintModule = registryModules.find(
              (registryModule) =>
                registryModule.name ===
                config.governanceChainInformation.registryModulesNames
                  .lazyMintingModule,
            );

            const modulesCapability = new RegistryModuleCapability(
              registryAddress,
              registrarAddresses.some(
                (registrarAddress) =>
                  EthereumContractAddress(registrarAddress) ===
                  batchModule?.address,
              ),
              registrarAddresses.some(
                (registrarAddress) =>
                  EthereumContractAddress(registrarAddress) ===
                  lazyMintModule?.address,
              ),
            );

            registriesMap.set(
              registryAddress,
              new Registry(
                registrarAddresses,
                registrarAdminAddresses,
                registryAddress,
                registryName,
                registrySymbol,
                registryNumberOfEntries,
                allowStorageUpdate,
                allowLabelChange,
                allowTransfers,
                registrationToken,
                registrationFee,
                burnAddress,
                burnFee,
                primaryRegistry,
                modulesCapability,
                null,
              ),
            );
          });
        }),
      ).map(() => {
        return registriesMap;
      });
    });
  }

  public getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<
    Map<string, number>,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    const totalCountsMap: Map<string, number> = new Map();

    return ResultUtils.combine(
      registryNames.map((registryName) => {
        // Get registry address
        return this.registryFactoryContract
          .nameToAddress(registryName)
          .andThen((registryAddress) => {
            if (this.provider == null) {
              throw new Error("No provider available!");
            }

            // Call the NFI contract of that address
            this.nonFungibleRegistryContract =
              new NonFungibleRegistryEnumerableUpgradeableContract(
                this.provider,
                registryAddress,
              );

            return this.nonFungibleRegistryContract.totalSupply(
              registryAddress,
            );
          })
          .map((totalCount) => {
            totalCountsMap.set(registryName, totalCount);
          });
      }),
    ).map(() => {
      return totalCountsMap;
    });
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
    return this.registryFactoryContract
      .nameToAddress(registryName)
      .andThen((registryAddress) => {
        if (this.provider == null) {
          throw new Error("No provider available!");
        }

        // Call the NFI contract of that address
        this.nonFungibleRegistryContract =
          new NonFungibleRegistryEnumerableUpgradeableContract(
            this.provider,
            registryAddress,
          );

        return this.nonFungibleRegistryContract
          .totalSupply(registryAddress)
          .andThen((totalCount) => {
            const registryEntryListResult: ResultAsync<
              RegistryEntry | null,
              NonFungibleRegistryContractError
            >[] = [];
            for (let i = 1; i <= Math.min(totalCount, pageSize); i++) {
              let index = 0;
              if (sortOrder == ERegistrySortOrder.DEFAULT) {
                index = totalCount - (pageNumber - 1) * pageSize - i;
              } else {
                index = i + pageNumber * pageSize - pageSize - 1;
              }

              if (index >= 0 && index < totalCount) {
                const registryEntryResult: ResultAsync<
                  RegistryEntry | null,
                  NonFungibleRegistryContractError
                > = this.nonFungibleRegistryContract
                  .tokenByIndex(index, registryAddress)
                  .andThen((tokenId) => {
                    return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
                      tokenId,
                      registryAddress,
                    );
                  });

                registryEntryListResult.push(
                  registryEntryResult
                    .orElse((err) => {
                      return okAsync<
                        RegistryEntry | null,
                        NonFungibleRegistryContractError
                      >(null);
                    })
                    .map((registryEntry) => {
                      if (registryEntry != null) {
                        registryEntry.index = index;
                      }
                      return registryEntry;
                    }),
                );
              }
            }
            return ResultUtils.combine(registryEntryListResult).map(
              (registryEntriesOrNulls) => {
                const registryEntries: RegistryEntry[] = [];
                registryEntriesOrNulls.forEach((registryEntryOrNull) => {
                  if (registryEntryOrNull != null) {
                    registryEntries.push(registryEntryOrNull);
                  }
                });
                return registryEntries;
              },
            );
          });
      });
  }

  public getRegistryEntryByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
    index: number,
  ): ResultAsync<
    RegistryEntry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryFactoryContract
      .nameToAddress(registryName)
      .andThen((registryAddress) => {
        if (this.provider == null) {
          throw new Error("No provider available!");
        }

        // Call the NFI contract of that address
        this.nonFungibleRegistryContract =
          new NonFungibleRegistryEnumerableUpgradeableContract(
            this.provider,
            registryAddress,
          );

        return this.nonFungibleRegistryContract.getRegistryEntryByOwnerAddress(
          ownerAddress,
          index,
          registryAddress,
        );
      });
  }

  public getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    RegistryEntry,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryFactoryContract
      .nameToAddress(registryName)
      .andThen((registryAddress) => {
        if (this.provider == null) {
          throw new Error("No provider available!");
        }

        // Call the NFI contract of that address
        this.nonFungibleRegistryContract =
          new NonFungibleRegistryEnumerableUpgradeableContract(
            this.provider,
            registryAddress,
          );

        return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
          tokenId,
          registryAddress,
        );
      });
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
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
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen(([registryMap, signerAddress]) => {
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (
        registry.registrarAddresses.includes(signerAddress) === false &&
        registry.allowStorageUpdate === false
      ) {
        return errAsync<
          RegistryEntry,
          | BlockchainUnavailableError
          | RegistryFactoryContractError
          | NonFungibleRegistryContractError
          | RegistryPermissionError
        >(
          new RegistryPermissionError(
            "You don't have permission to update registry entry token uri",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      return this.nonFungibleRegistryContract
        .updateRegistration(tokenId, registrationData, registry.address)
        .andThen(() => {
          return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
            tokenId,
            registry.address,
          );
        });
    });
  }

  public updateRegistryEntryLabel(
    registryName: string,
    tokenId: RegistryTokenId,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen(([registryMap, signerAddress]) => {
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (
        registry.registrarAddresses.includes(signerAddress) === false &&
        registry.allowLabelChange === false
      ) {
        return errAsync<
          RegistryEntry,
          | NonFungibleRegistryContractError
          | RegistryFactoryContractError
          | BlockchainUnavailableError
          | RegistryPermissionError
        >(
          new RegistryPermissionError(
            "You don't have permission to update registry entry label",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      return this.nonFungibleRegistryContract
        .updateLabel(tokenId, label, registry.address)
        .andThen(() => {
          return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
            tokenId,
            registry.address,
          );
        });
    });
  }

  public transferRegistryEntry(
    registryName: string,
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
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen(([registryMap, signerAddress]) => {
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (
        registry.registrarAddresses.includes(signerAddress) === false &&
        registry.allowTransfers === false
      ) {
        return errAsync<
          RegistryEntry,
          | NonFungibleRegistryContractError
          | RegistryFactoryContractError
          | BlockchainUnavailableError
          | RegistryPermissionError
        >(
          new RegistryPermissionError(
            "You don't have permission to transfer registry entry",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      return this.nonFungibleRegistryContract
        .getRegistryEntryByTokenId(tokenId, registry.address)
        .andThen((registryEntry) => {
          return this.nonFungibleRegistryContract
            .transferFrom(
              tokenId,
              registryEntry.owner,
              transferToAddress,
              registry.address,
            )
            .andThen(() => {
              return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
                tokenId,
                registry.address,
              );
            });
        });
    });
  }

  public burnRegistryEntry(
    registryName: string,
    tokenId: RegistryTokenId,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [registryMap, signerAddress] = vals;
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (
        registry.registrarAddresses.includes(signerAddress) === false &&
        registry.allowTransfers === false
      ) {
        return errAsync<
          void,
          | NonFungibleRegistryContractError
          | RegistryFactoryContractError
          | BlockchainUnavailableError
          | RegistryPermissionError
        >(
          new RegistryPermissionError(
            "You don't have permission to burn registry entry",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      return this.nonFungibleRegistryContract.burn(tokenId, registry.address);
    });
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
    return ResultUtils.combine([
      this.getRegistryByName([registryParams.name]),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [registryMap, signerAddress] = vals;
      const registry = registryMap.get(registryParams.name);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (registry.registrarAddresses.includes(signerAddress) === false) {
        return errAsync(
          new RegistryPermissionError(
            "Only registrar is allowed to update registry params",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      const abiCoder = ethers.utils.defaultAbiCoder;

      const params = abiCoder.encode(
        [
          "tuple(string[], bool[], bool[], bool[], address[], uint256[], address[], uint256[])",
        ],
        [
          [
            [],
            registryParams.allowStorageUpdate == null
              ? []
              : [registryParams.allowStorageUpdate],
            registryParams.allowLabelChange == null
              ? []
              : [registryParams.allowLabelChange],
            registryParams.allowTransfers == null
              ? []
              : [registryParams.allowTransfers],
            registryParams.registrationToken == null
              ? []
              : [registryParams.registrationToken],
            registryParams.registrationFee == null
              ? []
              : [ethers.utils.parseUnits(registryParams.registrationFee)],
            registryParams.burnAddress == null
              ? []
              : [registryParams.burnAddress],
            registryParams.burnFee == null ? [] : [registryParams.burnFee],
          ],
        ],
      );

      return this.nonFungibleRegistryContract
        .setRegistryParameters(params, registry.address)
        .andThen(() => {
          return this.getRegistryByName([registryParams.name]);
        })
        .andThen((registryMap) => {
          const registry = registryMap.get(registryParams.name);
          if (registry != null) {
            return okAsync(registry);
          } else {
            return errAsync<
              Registry,
              | NonFungibleRegistryContractError
              | RegistryFactoryContractError
              | BlockchainUnavailableError
              | RegistryPermissionError
            >(new BlockchainUnavailableError("registry not found"));
          }
        });
    });
  }

  public createRegistryEntry(
    registryName: string,
    newRegistryEntry: RegistryEntry,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | ERC20ContractError
    | GovernanceSignerUnavailableError
  > {
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [registryMap, signerAddress] = vals;
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (newRegistryEntry.tokenId === 0 || isNaN(newRegistryEntry.tokenId)) {
        return errAsync(
          new NonFungibleRegistryContractError(
            "Zero number or strings are not allowed as a token ID.",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      this.tokenERC20Contract = new ERC20Contract(
        this.signer,
        registry.registrationToken,
      );

      // Means registration token is not a zero address
      if (BigNumber.from(registry.registrationToken).isZero() === false) {
        return this.nonFungibleRegistryContract
          .registrationFeeBigNumber(registry.address)
          .andThen((registrationFees) => {
            return this.tokenERC20Contract
              .approve(registry.address, registrationFees)
              .andThen(() => {
                return this.nonFungibleRegistryContract.registerByToken(
                  newRegistryEntry.owner,
                  newRegistryEntry.label,
                  newRegistryEntry.tokenURI,
                  newRegistryEntry.tokenId,
                  registry.address,
                );
              });
          });
      } else {
        return this.nonFungibleRegistryContract.register(
          newRegistryEntry.owner,
          newRegistryEntry.label,
          newRegistryEntry.tokenURI,
          newRegistryEntry.tokenId,
          registry.address,
        );
      }
    });
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
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.registryFactoryContract.registrationFee(),
      this.registryFactoryContract.getRegistrarDefaultAdminRoleMember(),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [
        config,
        registrationFees,
        registrarDefaultAdminAddresses,
        selfAddress,
      ] = vals;
      if (this.signer == null) {
        throw new Error("No signer available!");
      }

      if (registrarDefaultAdminAddresses.includes(selfAddress) === true) {
        // This means that the user address has a default admin role and can call createRegistry without the need for hypertoken
        return this.registryFactoryContract.createRegistry(
          name,
          symbol,
          registrarAddress,
          enumerable,
        );
      }

      this.tokenERC20Contract = new ERC20Contract(
        this.signer,
        config.governanceChainInformation.hypertokenAddress,
      );

      return this.tokenERC20Contract
        .approve(
          this.registryFactoryContract.getContractAddress(),
          registrationFees,
        )
        .andThen(() => {
          return this.registryFactoryContract.createRegistryByToken(
            name,
            symbol,
            registrarAddress,
            enumerable,
          );
        });
    });
  }

  public grantRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [registryMap, signerAddress] = vals;
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (
        registry.registrarAdminAddresses.includes(
          EthereumAccountAddress(signerAddress),
        ) === false
      ) {
        return errAsync<
          void,
          | NonFungibleRegistryContractError
          | RegistryFactoryContractError
          | BlockchainUnavailableError
          | RegistryPermissionError
        >(
          new RegistryPermissionError(
            "You don't have permission to grantRole registry",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      return this.nonFungibleRegistryContract.grantRole(
        address,
        registry.address,
      );
    });
  }

  public revokeRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [registryMap, signerAddress] = vals;
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (
        registry.registrarAdminAddresses.includes(
          EthereumAccountAddress(signerAddress),
        ) === false
      ) {
        return errAsync<
          void,
          | NonFungibleRegistryContractError
          | RegistryFactoryContractError
          | BlockchainUnavailableError
          | RegistryPermissionError
        >(
          new RegistryPermissionError(
            "You don't have permission to revokeRole registry",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      return this.nonFungibleRegistryContract.revokeRole(
        address,
        registry.address,
      );
    });
  }

  public renounceRegistrarRole(
    registryName: string,
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<
    void,
    | NonFungibleRegistryContractError
    | RegistryFactoryContractError
    | BlockchainUnavailableError
    | RegistryPermissionError
    | GovernanceSignerUnavailableError
  > {
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [registryMap, signerAddress] = vals;
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      if (
        registry.registrarAdminAddresses.includes(signerAddress) === false &&
        registry.registrarAddresses.includes(signerAddress) === false
      ) {
        return errAsync<
          void,
          | NonFungibleRegistryContractError
          | RegistryFactoryContractError
          | BlockchainUnavailableError
          | RegistryPermissionError
        >(
          new RegistryPermissionError(
            "You don't have permission to renounceRole registry",
          ),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new GovernanceSignerUnavailableError(
            "Cannot update a token without a signer available",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.signer,
          registry.address,
        );

      return this.nonFungibleRegistryContract.renounceRole(
        address,
        registry.address,
      );
    });
  }

  public getNumberOfRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError
  > {
    return this.registryFactoryContract.getNumberOfEnumerableRegistries();
  }

  public getRegistryModules(): ResultAsync<
    RegistryModule[],
    NonFungibleRegistryContractError
  > {
    return this.configProvider.getConfig().andThen((config) => {
      if (this.provider == null) {
        throw new Error("No provider available!");
      }

      if (config.governanceChainInformation.modulesRegistryAddress == null) {
        return errAsync(
          new NonFungibleRegistryContractError(
            "modulesRegistryAddress is not defined!",
          ),
        );
      }

      const registryAddress =
        config.governanceChainInformation.modulesRegistryAddress;

      // Call the NFI contract of modules registry
      this.nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          this.provider,
          registryAddress,
        );

      return this.nonFungibleRegistryContract
        .totalSupply(registryAddress)
        .andThen((totalCount) => {
          const registryEntryListResult: ResultAsync<
            RegistryEntry,
            NonFungibleRegistryContractError
          >[] = [];

          for (let i = 0; i < totalCount; i++) {
            registryEntryListResult.push(
              this.nonFungibleRegistryContract
                .tokenByIndex(i, registryAddress)
                .andThen((tokenId) => {
                  return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
                    tokenId,
                    registryAddress,
                  );
                }),
            );
          }

          return ResultUtils.combine(registryEntryListResult).map(
            (registryEntries) => {
              return registryEntries.reduce((acc, registryEntry) => {
                acc.push({
                  name: registryEntry.label,
                  address: EthereumContractAddress(
                    registryEntry.tokenURI as string,
                  ),
                });
                return acc;
              }, [] as RegistryModule[]);
            },
          );
        });
    });
  }

  public createBatchRegistryEntry(
    registryName: string,
    newRegistryEntries: RegistryEntry[],
  ): ResultAsync<
    void,
    | BatchModuleContractError
    | RegistryFactoryContractError
    | NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getRegistryModules(),
    ]).andThen((vals) => {
      const [config, registryModules] = vals;

      return this.getRegistryByName([registryName]).andThen((registryMap) => {
        const registry = registryMap.get(registryName);
        if (registry == null) {
          return errAsync(
            new RegistryFactoryContractError("Registry not found!"),
          );
        }

        if (
          newRegistryEntries.some(
            (newRegistryEntry) =>
              isNaN(newRegistryEntry.tokenId) ||
              newRegistryEntry.tokenId == null ||
              newRegistryEntry.owner == null ||
              newRegistryEntry.label == null,
          )
        ) {
          return errAsync(
            new BatchModuleContractError("BatchModule register wrong inputs."),
          );
        }

        const batchModule = registryModules.find(
          (registryModule) =>
            registryModule.name ===
            config.governanceChainInformation.registryModulesNames
              .batchMintingModule,
        );

        if (batchModule?.address == null) {
          return errAsync(
            new BatchModuleContractError(
              "BatchModule contract address is not defined!",
            ),
          );
        }

        if (this.signer == null) {
          return errAsync(
            new BatchModuleContractError("BatchRegister requires a signer."),
          );
        }

        this.batchModuleContract = new BatchModuleContract(
          this.signer,
          batchModule?.address,
        );

        return this.batchModuleContract.batchRegister(
          registry.address,
          newRegistryEntries,
        );
      });
    });
  }

  public submitLazyMintSignature(
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
  > {
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [registryMap, signerAddress] = vals;
      const registry = registryMap.get(registryName);
      if (registry == null) {
        return errAsync(
          new RegistryFactoryContractError("Registry not found!"),
        );
      }

      if (this.signer == null) {
        return errAsync(
          new BlockchainUnavailableError("Method requires a signer."),
        );
      }

      if (registry.registrarAddresses.includes(signerAddress) === false) {
        return errAsync(
          new RegistryPermissionError(
            "You don't have permission to submit lazy minting signature",
          ),
        );
      }

      // hash the data
      const hash = ethers.utils
        .solidityKeccak256(
          ["address", "string", "string", "uint256"],
          [ownerAddress, "", registrationData, tokenId],
        )
        .toString();

      return ResultAsync.fromPromise(
        this.signer.signMessage(
          ethers.utils.arrayify(hash),
        ) as Promise<Signature>,
        (e) => {
          return e as BlockchainUnavailableError;
        },
      ).andThen((signature) => {
        // Save signature in ceramic didStore
        return this.didDataStoreProvider
          .initializeDIDDataStoreProvider(ownerAddress)
          .andThen((didDataStore) => {
            return this.setLazyMintingSignature(
              didDataStore,
              new LazyMintingSignature(
                registry.address,
                signature,
                tokenId,
                ownerAddress,
                registrationData,
                signerAddress,
                false,
              ),
            );
          });
      });
    });
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
  > {
    if (lazyMintingSignature.tokenClaimed === true) {
      return errAsync(new InvalidParametersError("Token already claimed!"));
    }

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getSignerAddress(),
      this.getRegistryModules(),
    ]).andThen((vals) => {
      const [config, selfAddress, registryModules] = vals;

      return this.didDataStoreProvider
        .initializeDIDDataStoreProvider(selfAddress)
        .andThen((didDataStore) => {
          return this.getLazyMintingSignatures(didDataStore)
            .andThen((lazyMintingSignatures) => {
              if (
                lazyMintingSignatures.find(
                  (item) =>
                    item.mintingSignature ===
                    lazyMintingSignature.mintingSignature,
                ) == null
              ) {
                return errAsync(
                  new InvalidParametersError(
                    "lazyMintingSignature object does not exist in did store!",
                  ),
                );
              }

              if (this.signer == null) {
                return errAsync(
                  new LazyMintModuleContractError(
                    "LazyMinting requires a signer.",
                  ),
                );
              }

              const lazyMintingModule = registryModules.find(
                (registryModule) =>
                  registryModule.name ===
                  config.governanceChainInformation.registryModulesNames
                    .lazyMintingModule,
              );

              if (lazyMintingModule?.address == null) {
                return errAsync(
                  new LazyMintModuleContractError(
                    "LazyMintModule contract address is not defined!",
                  ),
                );
              }

              this.lazyMintModuleContract = new LazyMintModuleContract(
                this.signer,
                lazyMintingModule?.address,
              );

              return this.lazyMintModuleContract.lazyRegister(
                lazyMintingSignature.registryAddress,
                lazyMintingSignature.mintingSignature,
                lazyMintingSignature.tokenId,
                lazyMintingSignature.ownerAccountAddress,
                lazyMintingSignature.registrationData,
              );
            })
            .andThen(() => {
              return this.updateLazyMintingSignatureTokenClaimed(
                didDataStore,
                lazyMintingSignature,
              );
            });
        });
    });
  }

  public revokeLazyMintSignature(
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.getSignerAddress().andThen((selfAddress) => {
      return this.didDataStoreProvider
        .initializeDIDDataStoreProvider(selfAddress)
        .andThen((didDataStore) => {
          return this.getLazyMintingSignatures(didDataStore).andThen(
            (prevLazyMintingSignatures) => {
              const filteredLazyMintingSignatures =
                prevLazyMintingSignatures.filter((item) => {
                  return (
                    item.mintingSignature !==
                    lazyMintingSignature.mintingSignature
                  );
                });

              return ResultAsync.fromPromise(
                didDataStore.set(LazyMintingSignatureSchema.title, {
                  data: [...filteredLazyMintingSignatures],
                }),
                (e) => new PersistenceError("didDataStore.set failed", e),
              ).map(() => {});
            },
          );
        });
    });
  }

  private getLazyMintingSignatures(
    didDataStore: DIDDataStore,
  ): ResultAsync<LazyMintingSignature[], PersistenceError> {
    return ResultAsync.fromPromise(
      didDataStore.get(LazyMintingSignatureSchema.title) as Promise<{
        data: LazyMintingSignature[];
      }>,
      (e) => new PersistenceError("didDataStore.get failed", e),
    ).map((response) => {
      if (response?.data == null) {
        return [];
      } else {
        return response?.data;
      }
    });
  }

  private setLazyMintingSignature(
    didDataStore: DIDDataStore,
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<void, PersistenceError> {
    return this.getLazyMintingSignatures(didDataStore).andThen(
      (prevLazyMintingSignatures) => {
        return ResultAsync.fromPromise(
          didDataStore.set(LazyMintingSignatureSchema.title, {
            data: [...prevLazyMintingSignatures, lazyMintingSignature],
          }),
          (e) => new PersistenceError("didDataStore.set failed", e),
        ).map(() => {});
      },
    );
  }

  private updateLazyMintingSignatureTokenClaimed(
    didDataStore: DIDDataStore,
    lazyMintingSignature: LazyMintingSignature,
  ): ResultAsync<void, PersistenceError> {
    return this.getLazyMintingSignatures(didDataStore).andThen(
      (prevLazyMintingSignatures) => {
        const updatedLazyMintingSignatures = prevLazyMintingSignatures.map(
          (item) => {
            if (
              item.mintingSignature === lazyMintingSignature.mintingSignature
            ) {
              item.tokenClaimed = true;
            }

            return item;
          },
        );

        return ResultAsync.fromPromise(
          didDataStore.set(LazyMintingSignatureSchema.title, {
            data: [...updatedLazyMintingSignatures],
          }),
          (e) => new PersistenceError("didDataStore.set failed", e),
        ).map(() => {});
      },
    );
  }

  public getRegistryEntryListByOwnerAddress(
    registryName: string,
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return this.registryFactoryContract
      .nameToAddress(registryName)
      .andThen((registryAddress) => {
        if (this.provider == null) {
          throw new Error("No provider available!");
        }

        // Call the NFI contract of that address
        this.nonFungibleRegistryContract =
          new NonFungibleRegistryEnumerableUpgradeableContract(
            this.provider,
            registryAddress,
          );

        return this.nonFungibleRegistryContract
          .balanceOf(ownerAddress, registryAddress)
          .andThen((numberOfTokens) => {
            const RegistryEntryListResult: ResultAsync<RegistryEntry, any>[] =
              [];
            for (let index = 0; index < numberOfTokens; index++) {
              RegistryEntryListResult.push(
                this.nonFungibleRegistryContract
                  .tokenOfOwnerByIndex(ownerAddress, index, registryAddress)
                  .andThen((tokenId) => {
                    return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
                      tokenId,
                      registryAddress,
                    );
                  }),
              );
            }

            return ResultUtils.combine(RegistryEntryListResult);
          });
      });
  }

  public getRegistryEntryListByUsername(
    registryName: string,
    username: string,
  ): ResultAsync<
    RegistryEntry[],
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).andThen(([config, provider]) => {
      this.provider = provider;

      const registryAddress =
        config.governanceChainInformation.hypernetProfileRegistryAddress;

      const hypernetProfileRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          registryAddress,
        );

      return hypernetProfileRegistryContract
        .getRegistryEntryByLabel(username, registryAddress)
        .andThen((registryEntry) => {
          return this.getRegistryEntryListByOwnerAddress(
            registryName,
            registryEntry.owner,
          );
        });
    });
  }

  public retrieveLazyMintingSignatures(): ResultAsync<
    LazyMintingSignature[],
    PersistenceError | BlockchainUnavailableError | VectorError
  > {
    return this.getSignerAddress().andThen((accountAddress) => {
      return this.didDataStoreProvider
        .initializeDIDDataStoreProvider(accountAddress)
        .andThen((didDataStore) => {
          return ResultAsync.fromPromise(
            didDataStore.get(LazyMintingSignatureSchema.title) as Promise<{
              data: LazyMintingSignature[];
            }>,
            (e) => new PersistenceError("didDataStore.get failed", e),
          ).map((res) => {
            return res?.data;
          });
        });
    });
  }

  private getRegistryByIndex(
    index: number,
  ): ResultAsync<
    Registry | null,
    RegistryFactoryContractError | NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.registryFactoryContract.enumerableRegistries(index),
      this.getRegistryModules(),
    ])
      .andThen((vals) => {
        const [config, registryAddress, registryModules] = vals;
        // Call the NFI contract of that address
        if (this.provider == null) {
          throw new Error("No provider available!");
        }
        this.nonFungibleRegistryContract =
          new NonFungibleRegistryEnumerableUpgradeableContract(
            this.provider,
            registryAddress,
          );

        // Get the name, symbol and NumberOfEntries of that registry address
        return ResultUtils.combine([
          this.nonFungibleRegistryContract.getRegistrarRoleMember(
            registryAddress,
          ),
          this.nonFungibleRegistryContract.getRegistrarRoleAdminMember(
            registryAddress,
          ),
          this.nonFungibleRegistryContract.name(registryAddress),
          this.nonFungibleRegistryContract.symbol(registryAddress),
          this.nonFungibleRegistryContract.totalSupply(registryAddress),
          this.nonFungibleRegistryContract.allowStorageUpdate(registryAddress),
          this.nonFungibleRegistryContract.allowLabelChange(registryAddress),
          this.nonFungibleRegistryContract.allowTransfers(registryAddress),
          this.nonFungibleRegistryContract.registrationToken(registryAddress),
          this.nonFungibleRegistryContract.registrationFee(registryAddress),
          this.nonFungibleRegistryContract.burnAddress(registryAddress),
          this.nonFungibleRegistryContract.burnFee(registryAddress),
          this.nonFungibleRegistryContract.primaryRegistry(registryAddress),
        ]).andThen((vals) => {
          const [
            registrarAddresses,
            registrarAdminAddresses,
            registryName,
            registrySymbol,
            registryNumberOfEntries,
            allowStorageUpdate,
            allowLabelChange,
            allowTransfers,
            registrationToken,
            registrationFee,
            burnAddress,
            burnFee,
            primaryRegistry,
          ] = vals;

          const batchModule = registryModules.find(
            (registryModule) =>
              registryModule.name ===
              config.governanceChainInformation.registryModulesNames
                .batchMintingModule,
          );

          const lazyMintModule = registryModules.find(
            (registryModule) =>
              registryModule.name ===
              config.governanceChainInformation.registryModulesNames
                .lazyMintingModule,
          );

          const modulesCapability = new RegistryModuleCapability(
            registryAddress,
            registrarAddresses.some(
              (registrarAddress) =>
                EthereumContractAddress(registrarAddress) ===
                batchModule?.address,
            ),
            registrarAddresses.some(
              (registrarAddress) =>
                EthereumContractAddress(registrarAddress) ===
                lazyMintModule?.address,
            ),
          );

          return okAsync(
            new Registry(
              registrarAddresses,
              registrarAdminAddresses,
              registryAddress,
              registryName,
              registrySymbol,
              registryNumberOfEntries,
              allowStorageUpdate,
              allowLabelChange,
              allowTransfers,
              registrationToken,
              registrationFee,
              burnAddress,
              burnFee,
              primaryRegistry,
              modulesCapability,
              index,
            ),
          );
        });
      })
      .orElse((e) => {
        // We don't want to throw errors when registry is not found
        this.logUtils.error(e);
        return okAsync(null as unknown as Registry);
      });
  }

  private getSignerAddress(): ResultAsync<
    EthereumAccountAddress,
    BlockchainUnavailableError
  > {
    if (this.signer == null) {
      throw new Error("Signer is not available");
    }
    return ResultAsync.fromPromise(
      this.signer.getAddress() as Promise<EthereumAccountAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call signer getAddress()",
          e,
        );
      },
    );
  }

  public initializeReadOnly(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).map(([config, provider]) => {
      this.provider = provider;

      return this.initializeContracts(config, provider);
    });
  }

  public initializeForWrite(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceSigner(),
    ]).map(([config, signer]) => {
      this.signer = signer;

      return this.initializeContracts(config, signer);
    });
  }

  private initializeContracts(
    config: HypernetConfig,
    signerOrProvider:
      | ethers.providers.JsonRpcSigner
      | ethers.providers.Provider,
  ): void {
    this.registryFactoryContract = new RegistryFactoryContract(
      signerOrProvider,
      config.governanceChainInformation.registryFactoryAddress,
    );
    this.tokenERC20Contract = new ERC20Contract(
      signerOrProvider,
      config.governanceChainInformation.hypertokenAddress,
    );
  }
}
