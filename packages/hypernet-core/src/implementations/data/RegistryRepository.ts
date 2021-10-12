import {
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
  constructor(public factoryContract: ethers.Contract) {}
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
        const registryListResult: ResultAsync<
          Registry | null,
          BlockchainUnavailableError
        >[] = [];

        // Get registry by index
        for (
          let index = pageSize * pageNumber;
          index >= pageSize * pageNumber - pageSize;
          index--
        ) {
          registryListResult.push(
            this.getRegistryByIndex(index, provider, registryContracts),
          );
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
                GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
                provider,
              );

              // Get the symbol and NumberOfEntries of that registry address
              return ResultUtils.combine([
                this.getRegistryContractRegistrarAddresses(registryContract),
                this.getRegistryContractSymbol(registryContract),
                this.getRegistryContractTotalSupply(registryContract),
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
                GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
                provider,
              );

              // Get the symbol and NumberOfEntries of that registry address
              return ResultUtils.combine([
                this.getRegistryContractRegistrarAddresses(registryContract),
                this.getRegistryContractSymbol(registryContract),
                this.getRegistryContractTotalSupply(registryContract),
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
                  GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
                  provider,
                );
                return this.getRegistryContractTotalSupply(registryContract);
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
    registryEntriesNumberArr?: number[],
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
            GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
            provider,
          );
          let registryEntriesNumberArrResult: ResultAsync<
            number[],
            BlockchainUnavailableError
          >;

          if (registryEntriesNumberArr == null) {
            registryEntriesNumberArrResult = this.getRegistryEntriesTotalCount([
              registryName,
            ]).map((registryEntriesCountMap) => {
              const registryEntriesCount =
                registryEntriesCountMap.get(registryName);
              if (registryEntriesCount == null || registryEntriesCount == 0) {
                return [];
              }
              let countsArr: number[] = [];
              for (let index = registryEntriesCount; index >= 1; index--) {
                countsArr.push(index);
              }
              return countsArr;
            });
          } else {
            registryEntriesNumberArrResult = okAsync(registryEntriesNumberArr);
          }

          return registryEntriesNumberArrResult.andThen(
            (registryEntriesNumberArray) => {
              return ResultUtils.combine(
                registryEntriesNumberArray.map((tokenId) => {
                  return this.getRegistryEntryByTokenId(
                    registryContract,
                    tokenId,
                  );
                }),
              ).map((vals) => {
                return vals
                  .filter((registry) => registry != null)
                  .map((registry) => {
                    return registry;
                  });
              });
            },
          );
        });
      },
    );
  }

  public getRegistryEntryByLabel(
    registryName: string,
    label: string,
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
            GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
            provider,
          );

          return ResultAsync.fromPromise(
            registryContract.registryMap(label) as Promise<BigNumber>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call registryMap registryContract",
                e,
              );
            },
          ).andThen((tokenId) => {
            return ResultUtils.combine([
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
              ResultAsync.fromPromise(
                registryContract.allowStorageUpdate() as Promise<boolean>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to call allowStorageUpdate registryContract",
                    e,
                  );
                },
              ),
              ResultAsync.fromPromise(
                registryContract.allowLabelChange() as Promise<boolean>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to call allowLabelChange registryContract",
                    e,
                  );
                },
              ),
            ]).andThen((vals) => {
              const [
                owner,
                tokenURI,
                storageUpdateAllowed,
                labelChangeAllowed,
              ] = vals;
              return okAsync(
                new RegistryEntry(
                  label,
                  tokenId.toNumber(),
                  owner,
                  tokenURI,
                  storageUpdateAllowed,
                  labelChangeAllowed,
                ),
              );
            });
          });
        });
      },
    );
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen(
      ({ registryContracts, signer }) => {
        // Get registry address
        return this.getRegistryAddressByName(
          registryContracts,
          registryName,
        ).andThen((registryAddress) => {
          // Call the NFI contract of that address
          const registryContract = new ethers.Contract(
            registryAddress,
            GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
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
      },
    );
  }

  public updateRegistryEntryLabel(
    registryName: string,
    tokenId: number,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeForWrite().andThen(
      ({ registryContracts, signer }) => {
        // Get registry address
        return this.getRegistryAddressByName(
          registryContracts,
          registryName,
        ).andThen((registryAddress) => {
          // Call the NFI contract of that address
          const registryContract = new ethers.Contract(
            registryAddress,
            GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
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
      },
    );
  }

  public getNumberOfRegistries(): ResultAsync<
    number,
    BlockchainUnavailableError
  > {
    return this.initializeReadOnly().andThen(
      ({ registryContracts, provider }) => {
        return ResultAsync.fromPromise(
          registryContracts.factoryContract.getNumberOfRegistries() as Promise<BigNumber>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call factoryContract getNumberOfRegistries()",
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
          GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
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
                : [registryParams.registrationFee],
              registryParams.burnAddress == null
                ? []
                : [registryParams.burnAddress],
              registryParams.burnFee == null ? [] : [registryParams.burnFee],
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
              "Unable to call factoryContract getNumberOfRegistries()",
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

  private getRegistryByIndex(
    index: number,
    provider: ethers.providers.Provider,
    registryContracts: RegistryContracts,
  ): ResultAsync<Registry | null, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContracts.factoryContract.registries(
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
          GovernanceAbis.NonFungibleRegistryUpgradeable.abi,
          provider,
        );

        // Get the name, symbol and NumberOfEntries of that registry address
        return ResultUtils.combine([
          this.getRegistryContractRegistrarAddresses(registryContract),
          this.getRegistryContractName(registryContract),
          this.getRegistryContractSymbol(registryContract),
          this.getRegistryContractTotalSupply(registryContract),
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
    return ResultAsync.fromPromise(
      registryContract?.reverseRegistryMap(tokenId) as Promise<string>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call reverseRegistryMap label",
          e,
        );
      },
    )
      .andThen((label) => {
        return ResultUtils.combine([
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
          ResultAsync.fromPromise(
            registryContract.allowStorageUpdate() as Promise<boolean>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call allowStorageUpdate registryContract",
                e,
              );
            },
          ),
          ResultAsync.fromPromise(
            registryContract.allowLabelChange() as Promise<boolean>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call allowLabelChange registryContract",
                e,
              );
            },
          ),
        ]).andThen((vals) => {
          const [owner, tokenURI, storageUpdateAllowed, labelChangeAllowed] =
            vals;
          return okAsync(
            new RegistryEntry(
              label,
              tokenId,
              owner,
              tokenURI,
              storageUpdateAllowed,
              labelChangeAllowed,
            ),
          );
        });
      })
      .orElse((e) => {
        // We don't want to throw errors when registry is not found
        this.logUtils.error(e);
        return okAsync(null as unknown as RegistryEntry);
      });
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
      console.log("getRoleMemberCount count: ", count);
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

  private getRegistryContractTotalSupply(
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
  ): ResultAsync<number, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.registrationFee() as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _registrationFee()",
          e,
        );
      },
    ).map((fee) => Number(fee.toString()));
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
  ): ResultAsync<number, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      registryContract.burnFee() as Promise<BigNumber>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call registryContract _burnFee()",
          e,
        );
      },
    ).map((fee) => Number(fee.toString()));
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

      return new RegistryContracts(registryFactoryContract);
    });
  }
}
