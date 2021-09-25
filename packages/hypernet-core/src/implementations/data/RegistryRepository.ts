import {
  BlockchainUnavailableError,
  EthereumAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IRegistryRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { BigNumber, ethers } from "ethers";

import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";
import { GovernanceAbis } from "@hypernetlabs/objects";

@injectable()
export class RegistryRepository implements IRegistryRepository {
  protected registryFactoryContract: ethers.Contract | null = null;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getRegistries(
    numberOfRegistries: number = 10,
  ): ResultAsync<Registry[], BlockchainUnavailableError> {
    return this.initializeContracts().andThen((signer) => {
      const registryListResult: ResultAsync<
        Registry | null,
        BlockchainUnavailableError
      >[] = [];

      // TODO: reverse the list of registries to start from numberOfRegistries
      // Get registry by index
      for (let index = 0; index < numberOfRegistries; index++) {
        registryListResult.push(this.getRegistryByIndex(index, signer));
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

  private getRegistryByIndex(
    index: number,
    signer: ethers.providers.JsonRpcSigner,
  ): ResultAsync<Registry | null, BlockchainUnavailableError> {
    return ResultAsync.fromPromise(
      this.registryFactoryContract?.registries(
        index,
      ) as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError("Unable to call registries", e);
      },
    )
      .andThen((registryAddress) => {
        // Call the NFR contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
          signer,
        );

        // Get the name, symbol and NumberOfEntries of that registry address
        return ResultAsync.fromPromise(
          registryContract?.name() as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call registryContract name()",
              e,
            );
          },
        ).andThen((registryName) => {
          console.log("registryName: ", registryName);
          return ResultAsync.fromPromise(
            registryContract?.symbol() as Promise<string>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call registryContract symbol()",
                e,
              );
            },
          ).andThen((registrySymbol) => {
            console.log("registrySymbol: ", registrySymbol);
            return ResultAsync.fromPromise(
              registryContract?.totalSupply() as Promise<BigNumber>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call registryContract totalSupply()",
                  e,
                );
              },
            ).andThen((registryNumberOfEntries) => {
              console.log("registryNumberOfEntries: ", registryNumberOfEntries);
              return okAsync(
                new Registry(
                  registryAddress,
                  registryName,
                  registrySymbol,
                  registryNumberOfEntries.toNumber(),
                ),
              );
            });
          });
        });
      })
      .orElse((e) => {
        // We don't want to throw errors when registry is not found
        this.logUtils.error(e);
        return okAsync(null as unknown as Registry);
      });
  }

  public getRegistryByName(
    registryName: string,
  ): ResultAsync<Registry, BlockchainUnavailableError> {
    return this.initializeContracts().andThen((signer) => {
      // Get registry address
      return ResultAsync.fromPromise(
        this.registryFactoryContract?.nameToAddress(
          registryName,
        ) as Promise<EthereumAddress>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call nameToAddress()",
            e,
          );
        },
      ).andThen((registryAddress) => {
        console.log("registryAddress: ", registryAddress);
        // Call the NFR contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
          signer,
        );

        // Get the symbol and NumberOfEntries of that registry address
        return ResultAsync.fromPromise(
          registryContract?.symbol() as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call registryContract symbol()",
              e,
            );
          },
        ).andThen((registrySymbol) => {
          console.log("registrySymbol: ", registrySymbol);
          return ResultAsync.fromPromise(
            registryContract?.totalSupply() as Promise<BigNumber>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call registryContract totalSupply()",
                e,
              );
            },
          ).andThen((registryNumberOfEntries) => {
            console.log("registryNumberOfEntries: ", registryNumberOfEntries);

            return okAsync(
              new Registry(
                registryAddress,
                registryName,
                registrySymbol,
                registryNumberOfEntries.toNumber(),
              ),
            );
          });
        });
      });
    });
  }

  public getRegistryByAddress(
    registryAddress: EthereumAddress,
  ): ResultAsync<Registry, BlockchainUnavailableError> {
    return this.initializeContracts().andThen((signer) => {
      // Get all registries addresses (indexes)
      return ResultAsync.fromPromise(
        this.registryFactoryContract?.addressToName(
          registryAddress,
        ) as Promise<EthereumAddress>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call nameToAddress()",
            e,
          );
        },
      ).andThen((registryName) => {
        console.log("registryName: ", registryName);
        // Call the NFT contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
          signer,
        );

        // Get the symbol and NumberOfEntries of that registry address
        return ResultAsync.fromPromise(
          registryContract?.symbol() as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call registryContract symbol()",
              e,
            );
          },
        ).andThen((registrySymbol) => {
          console.log("registrySymbol: ", registrySymbol);
          return ResultAsync.fromPromise(
            registryContract?.totalSupply() as Promise<number>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call registryContract totalSupply()",
                e,
              );
            },
          ).andThen((registryNumberOfEntries) => {
            console.log("registryNumberOfEntries: ", registryNumberOfEntries);

            return okAsync(
              new Registry(
                registryAddress,
                registryName,
                registrySymbol,
                registryNumberOfEntries,
              ),
            );
          });
        });
      });
    });
  }

  public getRegistryEntries(
    registryName: string,
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError> {
    return this.initializeContracts().andThen((signer) => {
      // Get registry address
      return ResultAsync.fromPromise(
        this.registryFactoryContract?.nameToAddress(
          registryName,
        ) as Promise<EthereumAddress>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call nameToAddress()",
            e,
          );
        },
      ).andThen((registryAddress) => {
        console.log("registryAddress: ", registryAddress);
        // Call the NFR contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
          signer,
        );
        console.log("totalSupply");
        return ResultAsync.fromPromise(
          registryContract?.totalSupply() as Promise<BigNumber>,
          (e) => {
            console.log("e: ", e);
            return new BlockchainUnavailableError(
              "Unable to retrieve totalSupply count",
              e,
            );
          },
        ).andThen((_tokenIdsCount) => {
          const tokenIdsCount = _tokenIdsCount.toNumber();
          const tokenIdsArr: number[] = [];
          const registryEntriesResult: ResultAsync<
            RegistryEntry,
            BlockchainUnavailableError
          >[] = [];

          for (let index = 1; index <= tokenIdsCount; index++) {
            tokenIdsArr.push(index);
          }
          tokenIdsArr.forEach((tokenId) => {
            registryEntriesResult.push(
              this.getRegistryEntryByTokenId(registryContract, tokenId),
            );
          });

          return ResultUtils.combine(registryEntriesResult);
        });
      });
    });
  }

  public getRegistryEntryByLabel(
    registryName: string,
    label: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeContracts().andThen((signer) => {
      // Get registry address
      return ResultAsync.fromPromise(
        this.registryFactoryContract?.nameToAddress(
          registryName,
        ) as Promise<EthereumAddress>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call nameToAddress()",
            e,
          );
        },
      ).andThen((registryAddress) => {
        console.log("registryAddress: ", registryAddress);
        // Call the NFR contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
          signer,
        );

        return ResultAsync.fromPromise(
          registryContract?.registryMap(label) as Promise<BigNumber>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call registryMap registryContract",
              e,
            );
          },
        ).andThen((tokenId) => {
          return ResultAsync.fromPromise(
            registryContract?.ownerOf(tokenId) as Promise<EthereumAddress>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call ownerOf registryContract",
                e,
              );
            },
          ).andThen((owner) => {
            return ResultAsync.fromPromise(
              registryContract?.tokenURI(tokenId) as Promise<string>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call tokenURI registryContract",
                  e,
                );
              },
            ).andThen((tokenURI) => {
              return ResultAsync.fromPromise(
                registryContract?._storageCanBeUpdated() as Promise<boolean>,
                (e) => {
                  return new BlockchainUnavailableError(
                    "Unable to call tokenURI registryContract",
                    e,
                  );
                },
              ).andThen((canUpdateURI) => {
                return ResultAsync.fromPromise(
                  registryContract?._labelCanBeChanged() as Promise<boolean>,
                  (e) => {
                    return new BlockchainUnavailableError(
                      "Unable to call tokenURI registryContract",
                      e,
                    );
                  },
                ).andThen((canUpdateLabel) => {
                  return okAsync(
                    new RegistryEntry(
                      label,
                      tokenId.toNumber(),
                      owner,
                      tokenURI,
                      canUpdateURI,
                      canUpdateLabel,
                    ),
                  );
                });
              });
            });
          });
        });
      });
    });
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeContracts().andThen((signer) => {
      // Get registry address
      return ResultAsync.fromPromise(
        this.registryFactoryContract?.nameToAddress(
          registryName,
        ) as Promise<EthereumAddress>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call nameToAddress()",
            e,
          );
        },
      ).andThen((registryAddress) => {
        // Call the NFR contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
          signer,
        );

        return ResultAsync.fromPromise(
          registryContract?.updateRegistration(
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
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.initializeContracts().andThen((signer) => {
      // Get registry address
      return ResultAsync.fromPromise(
        this.registryFactoryContract?.nameToAddress(
          registryName,
        ) as Promise<EthereumAddress>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call nameToAddress()",
            e,
          );
        },
      ).andThen((registryAddress) => {
        // Call the NFR contract of that address
        const registryContract = new ethers.Contract(
          registryAddress,
          GovernanceAbis.NonFungibleRegistry.abi,
          signer,
        );

        return ResultAsync.fromPromise(
          registryContract?.updateLabel(
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
    ).andThen((label) => {
      return ResultAsync.fromPromise(
        registryContract?.ownerOf(tokenId) as Promise<EthereumAddress>,
        (e) => {
          return new BlockchainUnavailableError(
            "Unable to call ownerOf registryContract",
            e,
          );
        },
      ).andThen((owner) => {
        return ResultAsync.fromPromise(
          registryContract?.tokenURI(tokenId) as Promise<string>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to call tokenURI registryContract",
              e,
            );
          },
        ).andThen((tokenURI) => {
          return ResultAsync.fromPromise(
            registryContract?._storageCanBeUpdated() as Promise<boolean>,
            (e) => {
              return new BlockchainUnavailableError(
                "Unable to call tokenURI registryContract",
                e,
              );
            },
          ).andThen((canUpdateURI) => {
            return ResultAsync.fromPromise(
              registryContract?._labelCanBeChanged() as Promise<boolean>,
              (e) => {
                return new BlockchainUnavailableError(
                  "Unable to call tokenURI registryContract",
                  e,
                );
              },
            ).andThen((canUpdateLabel) => {
              return okAsync(
                new RegistryEntry(
                  label,
                  tokenId,
                  owner,
                  tokenURI,
                  canUpdateURI,
                  canUpdateLabel,
                ),
              );
            });
          });
        });
      });
    });
  }

  protected initializeContracts(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    BlockchainUnavailableError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceSigner(),
    ]).andThen((vals) => {
      const [config, signer] = vals;

      this.registryFactoryContract = new ethers.Contract(
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as string,
        GovernanceAbis.RegistryFactory.abi,
        signer,
      );

      return okAsync(signer);
    });
  }
}
