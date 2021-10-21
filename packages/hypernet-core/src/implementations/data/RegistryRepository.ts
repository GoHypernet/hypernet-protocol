import {
  BigNumberString,
  BlockchainUnavailableError,
  EthereumAddress,
  Registry,
  RegistryEntry,
  RegistryParams,
  RegistryPermissionError,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IRegistryRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { BigNumber, ethers } from "ethers";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";
import { GovernanceAbis } from "@hypernetlabs/objects";

class RegistryContracts {
  constructor(
    public factoryContract: ethers.Contract,
    public hypertokenContract: ethers.Contract,
  ) {}
}

@injectable()
export class RegistryRepository implements IRegistryRepository {
  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getRegistries(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Registry[], BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        return this.getNumberOfRegistries().andThen((totalCount) => {
          const registryListResult: ResultAsync<
            Registry | null,
            BlockchainUnavailableError
          >[] = [];

          for (let i = 1; i <= Math.min(totalCount, pageSize); i++) {
            const index = totalCount - (pageNumber - 1) * pageSize - i;

            if (index >= 0) {
              registryListResult.push(
                this.getRegistryByIndex(index, provider, registryContracts),
              );
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
      },
    );
  }

  public getRegistryByName(
    registryNames: string[],
  ): ResultAsync<Map<string, Registry>, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        const registriesMap: Map<string, Registry> = new Map();

        return ResultUtils.combine(
          registryNames.map((registryName) => {
            return this.getRegistryAddressByName(
              registryContracts,
              registryName,
            ).andThen((registryAddress) => {
              // Call the NFI contract of that address
              const registryContract = new ethers.Contract(
                registryAddress,
                GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
                provider,
              );

              // Get the symbol and NumberOfEntries of that registry address
              return ResultUtils.combine([
                this.getRegistryContractRegistrarAddresses(registryContract),
                this.getRegistryContractSymbol(registryContract),
                this.getRegistryContractIndexCount(registryContract),
                this.getRegistryContractAllowLazyRegister(registryContract),
                this.getRegistryContractAllowStorageUpdate(registryContract),
                this.getRegistryContractAllowLabelChange(registryContract),
                this.getRegistryContractAllowTransfers(registryContract),
                this.getRegistryContractRegistrationToken(registryContract),
                this.getRegistryContractRegistrationFee(registryContract),
                this.getRegistryContractBurnAddress(registryContract),
                this.getRegistryContractBurnFee(registryContract),
                this.getRegistryContractPrimaryRegistry(registryContract),
              ]).map((vals) => {
                const [
                  registrarAddresses,
                  registrySymbol,
                  registryNumberOfEntries,
                  allowLazyRegister,
                  allowStorageUpdate,
                  allowLabelChange,
                  allowTransfers,
                  registrationToken,
                  registrationFee,
                  burnAddress,
                  burnFee,
                  primaryRegistry,
                ] = vals;

                registriesMap.set(
                  registryName,
                  new Registry(
                    registrarAddresses,
                    registryAddress,
                    registryName,
                    registrySymbol,
                    registryNumberOfEntries,
                    allowLazyRegister,
                    allowStorageUpdate,
                    allowLabelChange,
                    allowTransfers,
                    registrationToken,
                    registrationFee,
                    burnAddress,
                    burnFee,
                    primaryRegistry,
                    null,
                  ),
                );
              });
            });
          }),
        ).map(() => {
          return registriesMap;
        });
      },
    );
  }

  public getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<Map<EthereumAddress, Registry>, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        const registriesMap: Map<EthereumAddress, Registry> = new Map();

        return ResultUtils.combine(
          registryAddresses.map((registryAddress) => {
            // Get all registries addresses (indexes)
            return ResultAsync.fromPromise(
              registryContracts.factoryContract.addressToName(
                registryAddress,
              ) as Promise<EthereumAddress>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call addressToName()",
                  e,
                );
              },
            ).andThen((registryName) => {
              // Call the NFT contract of that address
              const registryContract = new ethers.Contract(
                registryAddress,
                GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
                provider,
              );

              // Get the symbol and NumberOfEntries of that registry address
              return ResultUtils.combine([
                this.getRegistryContractRegistrarAddresses(registryContract),
                this.getRegistryContractSymbol(registryContract),
                this.getRegistryContractIndexCount(registryContract),
                this.getRegistryContractAllowLazyRegister(registryContract),
                this.getRegistryContractAllowStorageUpdate(registryContract),
                this.getRegistryContractAllowLabelChange(registryContract),
                this.getRegistryContractAllowTransfers(registryContract),
                this.getRegistryContractRegistrationToken(registryContract),
                this.getRegistryContractRegistrationFee(registryContract),
                this.getRegistryContractBurnAddress(registryContract),
                this.getRegistryContractBurnFee(registryContract),
                this.getRegistryContractPrimaryRegistry(registryContract),
              ]).map((vals) => {
                const [
                  registrarAddresses,
                  registrySymbol,
                  registryNumberOfEntries,
                  allowLazyRegister,
                  allowStorageUpdate,
                  allowLabelChange,
                  allowTransfers,
                  registrationToken,
                  registrationFee,
                  burnAddress,
                  burnFee,
                  primaryRegistry,
                ] = vals;

                registriesMap.set(
                  registryAddress,
                  new Registry(
                    registrarAddresses,
                    registryAddress,
                    registryName,
                    registrySymbol,
                    registryNumberOfEntries,
                    allowLazyRegister,
                    allowStorageUpdate,
                    allowLabelChange,
                    allowTransfers,
                    registrationToken,
                    registrationFee,
                    burnAddress,
                    burnFee,
                    primaryRegistry,
                    null,
                  ),
                );
              });
            });
          }),
        ).map(() => {
          return registriesMap;
        });
      },
    );
  }

  public getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<Map<string, number>, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        const totalCountsMap: Map<string, number> = new Map();

        return ResultUtils.combine(
          registryNames.map((registryName) => {
            // Get registry address
            return this.getRegistryAddressByName(
              registryContracts,
              registryName,
            )
              .andThen((registryAddress) => {
                // Call the NFI contract of that address
                const registryContract = new ethers.Contract(
                  registryAddress,
                  GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
                  provider,
                );
                return this.getRegistryContractIndexCount(registryContract);
              })
              .map((totalCount) => {
                totalCountsMap.set(registryName, totalCount);
              });
          }),
        ).map(() => {
          return totalCountsMap;
        });
      },
    );
  }

  public getRegistryEntries(
    registryName: string,
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        // Get registry address
        return this.getRegistryAddressByName(
          registryContracts,
          registryName,
        ).andThen((registryAddress) => {
          // Call the NFI contract of that address
          const registryContract = new ethers.Contract(
            registryAddress,
            GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
            provider,
          );
          return this.getRegistryContractIndexCount(registryContract).andThen(
            (totalCount) => {
              const registryEntryListResult: ResultAsync<
                RegistryEntry | null,
                BlockchainUnavailableError
              >[] = [];
              for (let i = 1; i <= Math.min(totalCount, pageSize); i++) {
                const index = totalCount - (pageNumber - 1) * pageSize - i;

                if (index >= 0) {
                  const registryEntryResult: ResultAsync<
                    RegistryEntry | null,
                    BlockchainUnavailableError
                  > = this.getRegistryContractTokenIdByIndex(
                    registryContract,
                    index,
                  ).andThen((tokenId) => {
                    return this.getRegistryEntryByTokenId(
                      registryContract,
                      tokenId,
                    );
                  });

                  registryEntryListResult.push(
                    registryEntryResult
                      .orElse((err) => {
                        return okAsync<
                          RegistryEntry | null,
                          BlockchainUnavailableError
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
                  let registryEntries: RegistryEntry[] = [];
                  registryEntriesOrNulls.forEach((registryEntryOrNull) => {
                    if (registryEntryOrNull != null) {
                      registryEntries.push(registryEntryOrNull);
                    }
                  });
                  return registryEntries;
                },
              );
            },
          );
        });
      },
    );
  }

  public getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: number,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        // Get registry address
        return this.getRegistryAddressByName(
          registryContracts,
          registryName,
        ).andThen((registryAddress) => {
          // Call the NFI contract of that address
          const registryContract = new ethers.Contract(
            registryAddress,
            GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
            provider,
          );

          return this.getRegistryEntryByTokenId(registryContract, tokenId);
        });
      },
    );
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    BlockchainUnavailableError | RegistryPermissionError
  > {
    return this.initializeForWrite().andThen(({ signer }) => {
      return ResultUtils.combine([
        this.getRegistryByName([registryName]),
        this.getSignerAddress(signer),
      ]).andThen((vals) => {
        const [registryMap, signerAddress] = vals;
        const registry = registryMap.get(registryName);
        if (registry == null) {
          throw new Error("Registry not found!");
        }

        if (
          registry.registrarAddresses.includes(
            EthereumAddress(signerAddress),
          ) === false &&
          registry.allowStorageUpdate === false
        ) {
          return errAsync(
            new RegistryPermissionError(
              "You don't have permission to update registry entry token uri",
            ),
          );
        }

        // Call the NFI contract of that address
        const registryContract = new ethers.Contract(
          registry.address,
          GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
          signer,
        );

        return ResultAsync.fromPromise(
          registryContract.updateRegistration(
            BigNumber.from(tokenId),
            registrationData,
          ) as Promise<any>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call updateRegistration registryContract",
              e,
            );
          },
        )
          .andThen((tx) => {
            return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
              return new BlockchainUnavailableError("Unable to wait for tx", e);
            });
          })
          .andThen(() => {
            return this.getRegistryEntryByTokenId(registryContract, tokenId);
          });
      });
    });
  }

  public updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<
    RegistryEntry,
    BlockchainUnavailableError | RegistryPermissionError
  > {
    return this.initializeForWrite().andThen(({ signer }) => {
      return ResultUtils.combine([
        this.getRegistryByName([registryName]),
        this.getSignerAddress(signer),
      ]).andThen((vals) => {
        const [registryMap, signerAddress] = vals;
        const registry = registryMap.get(registryName);
        if (registry == null) {
          throw new Error("Registry not found!");
        }

        if (
          registry.registrarAddresses.includes(
            EthereumAddress(signerAddress),
          ) === false &&
          registry.allowLabelChange === false
        ) {
          return errAsync(
            new RegistryPermissionError(
              "You don't have permission to update registry entry label",
            ),
          );
        }

        // Call the NFI contract of that address
        const registryContract = new ethers.Contract(
          registry.address,
          GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
          signer,
        );

        return ResultAsync.fromPromise(
          registryContract.updateLabel(
            BigNumber.from(tokenId),
            label,
          ) as Promise<any>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call updateRegistration registryContract",
              e,
            );
          },
        )
          .andThen((tx) => {
            return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
              return new BlockchainUnavailableError("Unable to wait for tx", e);
            });
          })
          .andThen(() => {
            return this.getRegistryEntryByTokenId(registryContract, tokenId);
          });
      });
    });
  }

  public transferRegistryEntry(
    registryName: string,
    tokenId: number,
    transferToAddress: EthereumAddress,
  ): ResultAsync<
    RegistryEntry,
    BlockchainUnavailableError | RegistryPermissionError
  > {
    return this.initializeForWrite().andThen(({ signer }) => {
      return ResultUtils.combine([
        this.getRegistryByName([registryName]),
        this.getSignerAddress(signer),
      ]).andThen((vals) => {
        const [registryMap, signerAddress] = vals;
        const registry = registryMap.get(registryName);
        if (registry == null) {
          throw new Error("Registry not found!");
        }

        if (
          registry.registrarAddresses.includes(
            EthereumAddress(signerAddress),
          ) === false &&
          registry.allowTransfers === false
        ) {
          return errAsync(
            new RegistryPermissionError(
              "You don't have permission to transfer registry entry",
            ),
          );
        }

        // Call the NFI contract of that address
        const registryContract = new ethers.Contract(
          registry.address,
          GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
          signer,
        );

        return this.getRegistryEntryByTokenId(
          registryContract,
          tokenId,
        ).andThen((registryEntry) => {
          return ResultAsync.fromPromise(
            registryContract.transferFrom(
              registryEntry.owner,
              transferToAddress,
              tokenId,
            ) as Promise<any>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call registryContract transferFrom",
                e,
              );
            },
          )
            .andThen((tx) => {
              return ResultAsync.fromPromise(
                tx.wait() as Promise<void>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to wait for tx",
                    e,
                  );
                },
              );
            })
            .andThen(() => {
              return this.getRegistryEntryByTokenId(registryContract, tokenId);
            });
        });
      });
    });
  }

  public burnRegistryEntry(
    registryName: string,
    tokenId: number,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError> {
    return this.initializeForWrite().andThen(({ signer }) => {
      return ResultUtils.combine([
        this.getRegistryByName([registryName]),
        this.getSignerAddress(signer),
      ]).andThen((vals) => {
        const [registryMap, signerAddress] = vals;
        const registry = registryMap.get(registryName);
        if (registry == null) {
          throw new Error("Registry not found!");
        }

        if (
          registry.registrarAddresses.includes(
            EthereumAddress(signerAddress),
          ) === false &&
          registry.allowTransfers === false
        ) {
          return errAsync(
            new RegistryPermissionError(
              "You don't have permission to burn registry entry",
            ),
          );
        }

        // Call the NFI contract of that address
        const registryContract = new ethers.Contract(
          registry.address,
          GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
          signer,
        );

        return ResultAsync.fromPromise(
          registryContract.burn(tokenId) as Promise<any>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call registryContract burn",
              e,
            );
          },
        ).map(() => {});
      });
    });
  }

  public getNumberOfRegistries(): ResultAsync<
    number,
    BlockchainUnavailableError
  > {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        return ResultAsync.fromPromise(
          registryContracts.factoryContract.getNumberOfEnumerableRegistries() as Promise<BigNumber>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call factoryContract getNumberOfEnumerableRegistries()",
              e,
            );
          },
        ).map((numberOfRegistries) => numberOfRegistries.toNumber());
      },
    );
  }

  public updateRegistryParams(
    registryParams: RegistryParams,
  ): ResultAsync<
    Registry,
    BlockchainUnavailableError | RegistryPermissionError
  > {
    return this.initializeForWrite().andThen(({ signer }) => {
      return ResultUtils.combine([
        this.getRegistryByName([registryParams.name]),
        this.getSignerAddress(signer),
      ]).andThen((vals) => {
        const [registryMap, signerAddress] = vals;
        const registry = registryMap.get(registryParams.name);
        if (registry == null) {
          throw new Error("Registry not found!");
        }

        if (
          registry.registrarAddresses.includes(
            EthereumAddress(signerAddress),
          ) === false
        ) {
          return errAsync(
            new RegistryPermissionError(
              "Only registrar is allowed to update registry params",
            ),
          );
        }

        // Call the NFI contract of that address
        const registryContract = new ethers.Contract(
          registry.address,
          GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
          signer,
        );

        const abiCoder = ethers.utils.defaultAbiCoder;

        const params = abiCoder.encode(
          [
            "tuple(string[], bool[], bool[], bool[], bool[], address[], uint256[], address[], uint256[], address[])",
          ],
          [
            [
              [],
              registryParams.allowLazyRegister == null
                ? []
                : [registryParams.allowLazyRegister],
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
              registryParams.burnFee == null
                ? []
                : [ethers.utils.parseUnits(registryParams.burnFee)],
              registryParams.primaryRegistry == null
                ? []
                : [registryParams.primaryRegistry],
            ],
          ],
        );

        return ResultAsync.fromPromise(
          registryContract.setRegistryParameters(params) as Promise<any>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call factoryContract setRegistryParameters()",
              e,
            );
          },
        )
          .andThen((tx) => {
            return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
              return new BlockchainUnavailableError(
                "Unable to wait for setRegistryParameters tx",
                e,
              );
            });
          })
          .andThen(() => {
            return this.getRegistryByName([registryParams.name]);
          })
          .andThen((registryMap) => {
            const registry = registryMap.get(registryParams.name);
            if (registry != null) {
              return okAsync(registry);
            } else {
              return errAsync(
                new BlockchainUnavailableError("registry not found"),
              );
            }
          });
      });
    });
  }

  public createRegistryEntry(
    registryName: string,
    label: string,
    recipientAddress: EthereumAddress,
    data: string,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError> {
    return this.initializeForWrite().andThen(
      ({ registryContracts, signer }) => {
        return ResultUtils.combine([
          this.getRegistryByName([registryName]),
          this.getSignerAddress(signer),
        ]).andThen((vals) => {
          const [registryMap, signerAddress] = vals;
          const registry = registryMap.get(registryName);
          if (registry == null) {
            throw new Error("Registry not found!");
          }

          let shouldCallRegisterByToken: boolean;

          if (
            registry.registrarAddresses.includes(
              EthereumAddress(signerAddress),
            ) === true
          ) {
            shouldCallRegisterByToken = false;
          } else if (
            BigNumber.from(registry.registrationToken).isZero() === false
          ) {
            shouldCallRegisterByToken = true;
          } else {
            return errAsync(
              new RegistryPermissionError(
                "you don't have permission to create NFI",
              ),
            );
          }

          // Call the NFI contract of that address
          const registryContract = new ethers.Contract(
            registry.address,
            GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
            signer,
          );

          let registerResult: ResultAsync<any, BlockchainUnavailableError>;

          if (shouldCallRegisterByToken === true) {
            registerResult = ResultAsync.fromPromise(
              registryContracts.hypertokenContract.approve(
                registry.address,
                registry.registrationFee,
              ) as Promise<any>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call hypertokenContract approve()",
                  e,
                );
              },
            )
              .andThen((tx) => {
                return ResultAsync.fromPromise(
                  tx.wait() as Promise<void>,
                  (e) => {
                    return new BlockchainUnavailableError(
                      "Unable to wait for tx",
                      e,
                    );
                  },
                );
              })
              .andThen(() => {
                return ResultAsync.fromPromise(
                  registryContract.registerByToken(
                    recipientAddress,
                    label,
                    data,
                  ) as Promise<any>,
                  (e) => {
                    return new BlockchainUnavailableError(
                      "Unable to call registryContract registerByToken()",
                      e,
                    );
                  },
                );
              });
          } else {
            registerResult = ResultAsync.fromPromise(
              registryContract.register(
                recipientAddress,
                label,
                data,
              ) as Promise<any>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call registryContract register()",
                  e,
                );
              },
            );
          }

          return registerResult
            .andThen((tx) => {
              return ResultAsync.fromPromise(
                tx.wait() as Promise<void>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to wait for tx",
                    e,
                  );
                },
              );
            })
            .map(() => {});
        });
      },
    );
  }

  private getRegistryByIndex(
    index: number,
    provider: ethers.providers.Provider,
    registryContracts: RegistryContracts,
  ): ResultAsync<Registry | null, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContracts.factoryContract.enumerableRegistries(
        index,
      ) as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError("Unable to call registries", e);
      },
    )
      .andThen((registryAddress) => {
        // Call the NFI contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
          provider,
        );

        // Get the name, symbol and NumberOfEntries of that registry address
        return ResultUtils.combine([
          this.getRegistryContractRegistrarAddresses(registryContract),
          this.getRegistryContractName(registryContract),
          this.getRegistryContractSymbol(registryContract),
          this.getRegistryContractIndexCount(registryContract),
          this.getRegistryContractAllowLazyRegister(registryContract),
          this.getRegistryContractAllowStorageUpdate(registryContract),
          this.getRegistryContractAllowLabelChange(registryContract),
          this.getRegistryContractAllowTransfers(registryContract),
          this.getRegistryContractRegistrationToken(registryContract),
          this.getRegistryContractRegistrationFee(registryContract),
          this.getRegistryContractBurnAddress(registryContract),
          this.getRegistryContractBurnFee(registryContract),
          this.getRegistryContractPrimaryRegistry(registryContract),
        ]).andThen((vals) => {
          const [
            registrarAddresses,
            registryName,
            registrySymbol,
            registryNumberOfEntries,
            allowLazyRegister,
            allowStorageUpdate,
            allowLabelChange,
            allowTransfers,
            registrationToken,
            registrationFee,
            burnAddress,
            burnFee,
            primaryRegistry,
          ] = vals;
          return okAsync(
            new Registry(
              registrarAddresses,
              registryAddress,
              registryName,
              registrySymbol,
              registryNumberOfEntries,
              allowLazyRegister,
              allowStorageUpdate,
              allowLabelChange,
              allowTransfers,
              registrationToken,
              registrationFee,
              burnAddress,
              burnFee,
              primaryRegistry,
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

  private getRegistryEntryByTokenId(
    registryContract: ethers.Contract,
    tokenId: number,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return ResultUtils.combine([
      ResultAsync.fromPromise(
        registryContract?.reverseRegistryMap(tokenId) as Promise<string>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call reverseRegistryMap label",
            e,
          );
        },
      ),
      ResultAsync.fromPromise(
        registryContract.ownerOf(tokenId) as Promise<EthereumAddress>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call ownerOf registryContract",
            e,
          );
        },
      ),
      ResultAsync.fromPromise(
        registryContract.tokenURI(tokenId) as Promise<string>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call tokenURI registryContract",
            e,
          );
        },
      ),
    ]).andThen((vals) => {
      const [label, owner, tokenURI] = vals;
      return okAsync(new RegistryEntry(label, tokenId, owner, tokenURI, null));
    });
  }

  private getRegistryContractTokenIdByIndex(
    registryContract: ethers.Contract,
    index: number,
  ): ResultAsync<number, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.tokenByIndex(index) as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call getRoleMember",
          e,
        );
      },
    ).map((tokenId) => tokenId.toNumber());
  }

  private getRegistryContractRegistrarAddresses(
    registryContract: ethers.Contract,
  ): ResultAsync<EthereumAddress[], BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.getRoleMemberCount(
        registryContract.REGISTRAR_ROLE(),
      ) as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call getRoleMember",
          e,
        );
      },
    ).andThen((countBigNumber) => {
      const count = countBigNumber.toNumber();
      const registrarResults: ResultAsync<
        EthereumAddress,
        BlockchainUnavailableError
      >[] = [];
      for (let index = 0; index < count; index++) {
        registrarResults.push(
          this.getRegistryContractRegistrar(registryContract, index),
        );
      }
      return ResultUtils.combine(registrarResults);
    });
  }

  private getRegistryContractRegistrar(
    registryContract: ethers.Contract,
    index: number,
  ): ResultAsync<EthereumAddress, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.getRoleMember(
        registryContract.REGISTRAR_ROLE(),
        index,
      ) as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call getRoleMember",
          e,
        );
      },
    );
  }

  private getRegistryAddressByName(
    registryContracts: RegistryContracts,
    registryName: string,
  ): ResultAsync<EthereumAddress, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContracts.factoryContract.nameToAddress(
        registryName,
      ) as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call nameToAddress()",
          e,
        );
      },
    );
  }

  private getRegistryContractName(
    registryContract: ethers.Contract,
  ): ResultAsync<string, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.name() as Promise<string>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract name()",
          e,
        );
      },
    );
  }

  private getRegistryContractSymbol(
    registryContract: ethers.Contract,
  ): ResultAsync<string, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.symbol() as Promise<string>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract symbol()",
          e,
        );
      },
    );
  }

  private getRegistryContractIndexCount(
    registryContract: ethers.Contract,
  ): ResultAsync<number, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.totalSupply() as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract totalSupply()",
          e,
        );
      },
    ).map((totalSupply) => totalSupply.toNumber());
  }

  private getRegistryContractAllowLazyRegister(
    registryContract: ethers.Contract,
  ): ResultAsync<boolean, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.allowLazyRegister() as Promise<boolean>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _allowLazyRegister()",
          e,
        );
      },
    );
  }

  private getRegistryContractAllowStorageUpdate(
    registryContract: ethers.Contract,
  ): ResultAsync<boolean, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.allowStorageUpdate() as Promise<boolean>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _allowStorageUpdate()",
          e,
        );
      },
    );
  }

  private getRegistryContractAllowLabelChange(
    registryContract: ethers.Contract,
  ): ResultAsync<boolean, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.allowLabelChange() as Promise<boolean>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _allowLabelChange()",
          e,
        );
      },
    );
  }

  private getRegistryContractAllowTransfers(
    registryContract: ethers.Contract,
  ): ResultAsync<boolean, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.allowTransfers() as Promise<boolean>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _allowTransfers()",
          e,
        );
      },
    );
  }

  private getRegistryContractRegistrationToken(
    registryContract: ethers.Contract,
  ): ResultAsync<EthereumAddress, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.registrationToken() as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _registrationToken()",
          e,
        );
      },
    );
  }

  private getRegistryContractRegistrationFee(
    registryContract: ethers.Contract,
  ): ResultAsync<BigNumberString, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.registrationFee() as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _registrationFee()",
          e,
        );
      },
    ).map((fee) => {
      return BigNumberString(ethers.utils.formatUnits(fee, "ether"));
    });
  }

  private getRegistryContractBurnAddress(
    registryContract: ethers.Contract,
  ): ResultAsync<EthereumAddress, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.burnAddress() as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract __burnAddress()",
          e,
        );
      },
    );
  }

  private getRegistryContractBurnFee(
    registryContract: ethers.Contract,
  ): ResultAsync<BigNumberString, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.burnFee() as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _burnFee()",
          e,
        );
      },
    ).map((fee) => {
      return BigNumberString(ethers.utils.formatUnits(fee, "ether"));
    });
  }

  private getRegistryContractPrimaryRegistry(
    registryContract: ethers.Contract,
  ): ResultAsync<EthereumAddress, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.primaryRegistry() as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract __primaryRegistry()",
          e,
        );
      },
    );
  }

  private getSignerAddress(
    signer: ethers.providers.JsonRpcSigner,
  ): ResultAsync<string, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      signer.getAddress() as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call signer getAddress()",
          e,
        );
      },
    );
  }

  private initializeForWrite(): ResultAsync<
    {
      registryContracts: RegistryContracts;
      signer: ethers.providers.JsonRpcSigner;
    },
    BlockchainUnavailableError
  > {
    return this.blockchainProvider.getGovernanceSigner().andThen((signer) => {
      return this.initializeContracts(signer).map((registryContracts) => {
        return {
          registryContracts,
          signer,
        };
      });
    });
  }

  private initializeReadOnly(): ResultAsync<
    {
      registryContracts: RegistryContracts;
      provider: ethers.providers.Provider;
    },
    BlockchainUnavailableError
  > {
    return this.blockchainProvider
      .getGovernanceProvider()
      .andThen((provider) => {
        return this.initializeContracts(provider).map((registryContracts) => {
          return {
            registryContracts,
            provider,
          };
        });
      });
  }

  private initializeContracts(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
  ): ResultAsync<RegistryContracts, never> {
    return this.configProvider.getConfig().map((config) => {
      const registryFactoryContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as string,
        GovernanceAbis.UpgradeableRegistryFactory.abi,
        providerOrSigner,
      );

      const hypertokenContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.hypertokenAddress as string,
        GovernanceAbis.Hypertoken.abi,
        providerOrSigner,
      );

      return new RegistryContracts(registryFactoryContract, hypertokenContract);
    });
  }
}
