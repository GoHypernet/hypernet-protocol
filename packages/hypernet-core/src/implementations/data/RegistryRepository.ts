import {
  IRegistryFactoryContract,
  IERC20Contract,
  INonFungibleRegistryEnumerableUpgradeableContract,
  RegistryFactoryContract,
  ERC20Contract,
  NonFungibleRegistryEnumerableUpgradeableContract,
  BatchModuleContract,
  IBatchModuleContract,
} from "@hypernetlabs/governance-sdk";
import {
  BigNumberString,
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
  RegistryModuleCapability,
  chainConfig,
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
} from "@interfaces/utilities";

@injectable()
export class RegistryRepository implements IRegistryRepository {
  protected provider: ethers.providers.Provider | undefined;
  protected signer: ethers.providers.JsonRpcSigner | undefined;
  protected registryFactoryContract: IRegistryFactoryContract =
    {} as RegistryFactoryContract;
  protected hypertokenContract: IERC20Contract = {} as ERC20Contract;
  protected nonFungibleRegistryContract: INonFungibleRegistryEnumerableUpgradeableContract =
    {} as NonFungibleRegistryEnumerableUpgradeableContract;
  protected batchModuleContract: IBatchModuleContract =
    {} as BatchModuleContract;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
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

          if (index >= 0) {
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
    return this.configProvider.getConfig().andThen((config) => {
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
                this.getRegistryContractRegistrarRoleAddresses(),
                this.getRegistryContractRegistrarRoleAdminAddresses(),
                this.nonFungibleRegistryContract.symbol(),
                this.nonFungibleRegistryContract.totalSupply(),
                this.nonFungibleRegistryContract.allowStorageUpdate(),
                this.nonFungibleRegistryContract.allowLabelChange(),
                this.nonFungibleRegistryContract.allowTransfers(),
                this.nonFungibleRegistryContract.registrationToken(),
                this.nonFungibleRegistryContract.registrationFee(),
                this.nonFungibleRegistryContract.burnAddress(),
                this.nonFungibleRegistryContract.burnFee(),
                this.nonFungibleRegistryContract.primaryRegistry(),
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

                const modulesCapability = new RegistryModuleCapability(
                  registryAddress,
                  registrarAddresses.some(
                    (registrarAddress) =>
                      EthereumContractAddress(registrarAddress) ===
                      chainConfig.get(config.governanceChainId)
                        ?.batchModuleAddress,
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

    return this.configProvider.getConfig().andThen((config) => {
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
            this.getRegistryContractRegistrarRoleAddresses(),
            this.getRegistryContractRegistrarRoleAdminAddresses(),
            this.nonFungibleRegistryContract.name(),
            this.nonFungibleRegistryContract.symbol(),
            this.nonFungibleRegistryContract.totalSupply(),
            this.nonFungibleRegistryContract.allowStorageUpdate(),
            this.nonFungibleRegistryContract.allowLabelChange(),
            this.nonFungibleRegistryContract.allowTransfers(),
            this.nonFungibleRegistryContract.registrationToken(),
            this.nonFungibleRegistryContract.registrationFee(),
            this.nonFungibleRegistryContract.burnAddress(),
            this.nonFungibleRegistryContract.burnFee(),
            this.nonFungibleRegistryContract.primaryRegistry(),
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

            const modulesCapability = new RegistryModuleCapability(
              registryAddress,
              registrarAddresses.some(
                (registrarAddress) =>
                  EthereumContractAddress(registrarAddress) ===
                  chainConfig.get(config.governanceChainId)?.batchModuleAddress,
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

            return this.nonFungibleRegistryContract.totalSupply();
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
          .totalSupply()
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

              if (index >= 0) {
                const registryEntryResult: ResultAsync<
                  RegistryEntry | null,
                  NonFungibleRegistryContractError
                > = this.nonFungibleRegistryContract
                  .tokenByIndex(index)
                  .andThen((tokenId) => {
                    return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
                      tokenId,
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
        .updateRegistration(tokenId, registrationData)
        .andThen(() => {
          return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
            tokenId,
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
        .updateLabel(tokenId, label)
        .andThen(() => {
          return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
            tokenId,
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
        .getRegistryEntryByTokenId(tokenId)
        .andThen((registryEntry) => {
          return this.nonFungibleRegistryContract
            .transferFrom(tokenId, registryEntry.owner, transferToAddress)
            .andThen(() => {
              return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
                tokenId,
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

      return this.nonFungibleRegistryContract.burn(tokenId);
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
        .setRegistryParameters(params)
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

      // Means registration token is not a zero address
      if (BigNumber.from(registry.registrationToken).isZero() === false) {
        return this.nonFungibleRegistryContract
          .registrationFee()
          .andThen((registrationFees) => {
            return this.hypertokenContract
              .approve(
                registry.address,
                BigNumberString(registrationFees.toString()),
              )
              .andThen(() => {
                return this.nonFungibleRegistryContract.registerByToken(
                  newRegistryEntry.owner,
                  newRegistryEntry.label,
                  newRegistryEntry.tokenURI,
                  newRegistryEntry.tokenId,
                );
              });
          });
      } else {
        return this.nonFungibleRegistryContract.register(
          newRegistryEntry.owner,
          newRegistryEntry.label,
          newRegistryEntry.tokenURI,
          newRegistryEntry.tokenId,
        );
      }
    });
  }

  public createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError | ERC20ContractError> {
    return this.registryFactoryContract
      .registrationFee()
      .andThen((registrationFees) => {
        return this.hypertokenContract
          .approve(
            this.registryFactoryContract.getContractAddress(),
            BigNumberString(registrationFees.toString()),
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

      return this.nonFungibleRegistryContract.grantRole(address);
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

      return this.nonFungibleRegistryContract.revokeRole(address);
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

      return this.nonFungibleRegistryContract.renounceRole(address);
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
    RegistryFactoryContractError
  > {
    return this.getModulesAddresses().andThen((modulesAddresses) => {
      const moduleListResult: ResultAsync<
        RegistryModule,
        RegistryFactoryContractError
      >[] = [];

      modulesAddresses.forEach((moduleAddress) => {
        moduleListResult.push(
          this.registryFactoryContract
            .getModuleName(moduleAddress)
            .map((moduleName) => {
              return new RegistryModule(moduleName, moduleAddress);
            }),
        );
      });

      return ResultUtils.combine(moduleListResult);
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
      this.getRegistryByName([registryName]),
    ]).andThen((vals) => {
      const [registryMap] = vals;
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
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

      return this.batchModuleContract.batchRegister(
        registry.address,
        newRegistryEntries,
      );
    });
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
          .balanceOf(ownerAddress)
          .andThen((numberOfTokens) => {
            const RegistryEntryListResult: ResultAsync<RegistryEntry, any>[] =
              [];
            for (let index = 0; index < numberOfTokens; index++) {
              RegistryEntryListResult.push(
                this.nonFungibleRegistryContract
                  .tokenOfOwnerByIndex(ownerAddress, index)
                  .andThen((tokenId) => {
                    return this.nonFungibleRegistryContract.getRegistryEntryByTokenId(
                      tokenId,
                    );
                  }),
              );
            }

            return ResultUtils.combine(RegistryEntryListResult);
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
    ])
      .andThen((vals) => {
        const [config, registryAddress] = vals;
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
          this.getRegistryContractRegistrarRoleAddresses(),
          this.nonFungibleRegistryContract.getRegistrarRoleMember(),
          this.nonFungibleRegistryContract.getRegistrarRoleAdminMember(),
          this.nonFungibleRegistryContract.name(),
          this.nonFungibleRegistryContract.symbol(),
          this.nonFungibleRegistryContract.totalSupply(),
          this.nonFungibleRegistryContract.allowStorageUpdate(),
          this.nonFungibleRegistryContract.allowLabelChange(),
          this.nonFungibleRegistryContract.allowTransfers(),
          this.nonFungibleRegistryContract.registrationToken(),
          this.nonFungibleRegistryContract.registrationFee(),
          this.nonFungibleRegistryContract.burnAddress(),
          this.nonFungibleRegistryContract.burnFee(),
          this.nonFungibleRegistryContract.primaryRegistry(),
        ]).andThen((vals) => {
          const [
            registrarAddresses,
            registrarAddress,
            registrarAdminAddress,
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

          const modulesCapability = new RegistryModuleCapability(
            registryAddress,
            registrarAddresses.some(
              (registrarAddress) =>
                EthereumContractAddress(registrarAddress) ===
                chainConfig.get(config.governanceChainId)?.batchModuleAddress,
            ),
          );

          return okAsync(
            new Registry(
              [registrarAddress],
              [registrarAdminAddress],
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

  private getRegistryContractRegistrarRoleAddresses(): ResultAsync<
    EthereumAccountAddress[],
    NonFungibleRegistryContractError
  > {
    return this.nonFungibleRegistryContract
      .getRegistrarRoleMemberCount()
      .andThen((countBigNumber) => {
        const count = countBigNumber.toNumber();
        const registrarResults: ResultAsync<
          EthereumAccountAddress,
          NonFungibleRegistryContractError
        >[] = [];
        for (let index = 0; index < count; index++) {
          registrarResults.push(
            this.nonFungibleRegistryContract.getRegistrarRoleMember(index),
          );
        }
        return ResultUtils.combine(registrarResults);
      });
  }

  private getRegistryContractRegistrarRoleAdminAddresses(): ResultAsync<
    EthereumAccountAddress[],
    NonFungibleRegistryContractError
  > {
    return this.nonFungibleRegistryContract
      .getRegistrarRoleAdminMemberCount()
      .andThen((countBigNumber) => {
        const count = countBigNumber.toNumber();
        const registrarResults: ResultAsync<
          EthereumAccountAddress,
          NonFungibleRegistryContractError
        >[] = [];
        for (let index = 0; index < count; index++) {
          registrarResults.push(
            this.nonFungibleRegistryContract.getRegistrarRoleAdminMember(index),
          );
        }
        return ResultUtils.combine(registrarResults);
      });
  }

  private getModulesAddresses(): ResultAsync<
    EthereumContractAddress[],
    RegistryFactoryContractError
  > {
    return this.registryFactoryContract
      .getNumberOfModules()
      .andThen((totalCount) => {
        const moduleListResult: ResultAsync<
          EthereumContractAddress,
          RegistryFactoryContractError
        >[] = [];

        for (let i = 0; i < totalCount; i++) {
          moduleListResult.push(this.registryFactoryContract.modules(i));
        }

        return ResultUtils.combine(moduleListResult);
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

      this.registryFactoryContract = new RegistryFactoryContract(
        provider,
        config.governanceChainInformation.registryFactoryAddress,
      );
      this.hypertokenContract = new ERC20Contract(
        provider,
        config.governanceChainInformation.hypertokenAddress,
      );
      this.batchModuleContract = new BatchModuleContract(
        provider,
        config.governanceChainInformation.batchModuleAddress,
      );
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

      this.registryFactoryContract = new RegistryFactoryContract(
        signer,
        config.governanceChainInformation.registryFactoryAddress,
      );
      this.hypertokenContract = new ERC20Contract(
        signer,
        config.governanceChainInformation.hypertokenAddress,
      );
      this.batchModuleContract = new BatchModuleContract(
        signer,
        config.governanceChainInformation.batchModuleAddress,
      );
    });
  }
}
