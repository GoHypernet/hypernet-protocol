import {
  BigNumberString,
  BlockchainUnavailableError,
  ERegistrySortOrder,
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
import {
  IRegistryFactoryContract,
  IRegistryFactoryContractType,
  IHypertokenContract,
  IHypertokenContractType,
  INonFungibleRegistryEnumerableUpgradeableContract,
  INonFungibleRegistryEnumerableUpgradeableContractType,
} from "@hypernetlabs/contracts";

@injectable()
export class RegistryRepository implements IRegistryRepository {
  protected provider: ethers.providers.Provider | undefined;
  protected signer: ethers.providers.JsonRpcSigner | undefined;
  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IRegistryFactoryContractType)
    protected registryFactoryContract: IRegistryFactoryContract,
    @inject(IHypertokenContractType)
    protected hypertokenContract: IHypertokenContract,
    @inject(INonFungibleRegistryEnumerableUpgradeableContractType)
    protected nonFungibleRegistryContract: INonFungibleRegistryEnumerableUpgradeableContract,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getRegistries(
    pageNumber: number,
    pageSize: number,
    sortOrder: ERegistrySortOrder,
  ): ResultAsync<Registry[], BlockchainUnavailableError> {
    return this.registryFactoryContract
      .getNumberOfEnumerableRegistries()
      .andThen((totalCount) => {
        const registryListResult: ResultAsync<
          Registry | null,
          BlockchainUnavailableError
        >[] = [];

        for (let i = 1; i <= Math.min(totalCount, pageSize); i++) {
          let index = 0;
          if (sortOrder == ERegistrySortOrder.REVERSED_ORDER) {
            index = totalCount - (pageNumber - 1) * pageSize - i;
          } else {
            index =
              i + pageNumber * Math.min(totalCount, pageSize) - pageSize - 1;
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
  ): ResultAsync<Map<string, Registry>, BlockchainUnavailableError> {
    const registriesMap: Map<string, Registry> = new Map();
    return ResultUtils.combine(
      registryNames.map((registryName) => {
        return this.registryFactoryContract
          .nameToAddress(registryName)
          .andThen((registryAddress) => {
            // Call the NFI contract of that address
            this.nonFungibleRegistryContract.initializeContract(
              this.provider,
              registryAddress,
            );

            // Get the symbol and NumberOfEntries of that registry address
            return ResultUtils.combine([
              this.getRegistryContractRegistrarRoleAddresses(),
              this.getRegistryContractRegistrarRoleAdminAddresses(),
              this.nonFungibleRegistryContract.symbol(),
              this.nonFungibleRegistryContract.totalSupply(),
              this.nonFungibleRegistryContract.allowLazyRegister(),
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
                  registrarAdminAddresses,
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
  }

  public getRegistryByAddress(
    registryAddresses: EthereumAddress[],
  ): ResultAsync<Map<EthereumAddress, Registry>, BlockchainUnavailableError> {
    const registriesMap: Map<EthereumAddress, Registry> = new Map();

    return ResultUtils.combine(
      registryAddresses.map((registryAddress) => {
        // Get all registries addresses (indexes)
        return this.registryFactoryContract
          .addressToName(registryAddress)
          .andThen((registryName) => {
            // Call the NFT contract of that address
            this.nonFungibleRegistryContract.initializeContract(
              this.provider,
              registryAddress,
            );

            // Get the symbol and NumberOfEntries of that registry address
            return ResultUtils.combine([
              this.getRegistryContractRegistrarRoleAddresses(),
              this.getRegistryContractRegistrarRoleAdminAddresses(),
              this.nonFungibleRegistryContract.symbol(),
              this.nonFungibleRegistryContract.totalSupply(),
              this.nonFungibleRegistryContract.allowLazyRegister(),
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
                  registrarAdminAddresses,
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
  }

  public getRegistryEntriesTotalCount(
    registryNames: string[],
  ): ResultAsync<Map<string, number>, BlockchainUnavailableError> {
    const totalCountsMap: Map<string, number> = new Map();

    return ResultUtils.combine(
      registryNames.map((registryName) => {
        // Get registry address
        return this.registryFactoryContract
          .nameToAddress(registryName)
          .andThen((registryAddress) => {
            // Call the NFI contract of that address
            this.nonFungibleRegistryContract.initializeContract(
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
  ): ResultAsync<RegistryEntry[], BlockchainUnavailableError> {
    return this.registryFactoryContract
      .nameToAddress(registryName)
      .andThen((registryAddress) => {
        // Call the NFI contract of that address
        this.nonFungibleRegistryContract.initializeContract(
          this.provider,
          registryAddress,
        );

        return this.nonFungibleRegistryContract
          .totalSupply()
          .andThen((totalCount) => {
            const registryEntryListResult: ResultAsync<
              RegistryEntry | null,
              BlockchainUnavailableError
            >[] = [];
            for (let i = 1; i <= Math.min(totalCount, pageSize); i++) {
              let index = 0;
              if (sortOrder == ERegistrySortOrder.REVERSED_ORDER) {
                index = totalCount - (pageNumber - 1) * pageSize - i;
              } else {
                index =
                  i +
                  pageNumber * Math.min(totalCount, pageSize) -
                  pageSize -
                  1;
              }

              if (index >= 0) {
                const registryEntryResult: ResultAsync<
                  RegistryEntry | null,
                  BlockchainUnavailableError
                > = this.nonFungibleRegistryContract
                  .tokenByIndex(index)
                  .andThen((tokenId) => {
                    return this.getRegistryEntryByTokenId(tokenId);
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
          });
      });
  }

  public getRegistryEntryDetailByTokenId(
    registryName: string,
    tokenId: number,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return this.registryFactoryContract
      .nameToAddress(registryName)
      .andThen((registryAddress) => {
        // Call the NFI contract of that address
        this.nonFungibleRegistryContract.initializeContract(
          this.provider,
          registryAddress,
        );

        return this.getRegistryEntryByTokenId(tokenId);
      });
  }

  public updateRegistryEntryTokenURI(
    registryName: string,
    tokenId: number,
    registrationData: string,
  ): ResultAsync<
    RegistryEntry,
    BlockchainUnavailableError | RegistryPermissionError
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
        registry.registrarAddresses.includes(EthereumAddress(signerAddress)) ===
          false &&
        registry.allowStorageUpdate === false
      ) {
        return errAsync(
          new RegistryPermissionError(
            "You don't have permission to update registry entry token uri",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract.initializeContract(
        this.signer,
        registry.address,
      );

      return this.nonFungibleRegistryContract
        .updateRegistration(tokenId, registrationData)
        .andThen(() => {
          return this.getRegistryEntryByTokenId(tokenId);
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
        registry.registrarAddresses.includes(EthereumAddress(signerAddress)) ===
          false &&
        registry.allowLabelChange === false
      ) {
        return errAsync(
          new RegistryPermissionError(
            "You don't have permission to update registry entry label",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract.initializeContract(
        this.signer,
        registry.address,
      );

      return this.nonFungibleRegistryContract
        .updateLabel(tokenId, label)
        .andThen(() => {
          return this.getRegistryEntryByTokenId(tokenId);
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
        registry.registrarAddresses.includes(EthereumAddress(signerAddress)) ===
          false &&
        registry.allowTransfers === false
      ) {
        return errAsync(
          new RegistryPermissionError(
            "You don't have permission to transfer registry entry",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract.initializeContract(
        this.signer,
        registry.address,
      );

      return this.getRegistryEntryByTokenId(tokenId).andThen(
        (registryEntry) => {
          return this.nonFungibleRegistryContract
            .transferFrom(tokenId, registryEntry.owner, transferToAddress)
            .andThen(() => {
              return this.getRegistryEntryByTokenId(tokenId);
            });
        },
      );
    });
  }

  public burnRegistryEntry(
    registryName: string,
    tokenId: number,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError> {
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
        registry.registrarAddresses.includes(EthereumAddress(signerAddress)) ===
          false &&
        registry.allowTransfers === false
      ) {
        return errAsync(
          new RegistryPermissionError(
            "You don't have permission to burn registry entry",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract.initializeContract(
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
    BlockchainUnavailableError | RegistryPermissionError
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

      if (
        registry.registrarAddresses.includes(EthereumAddress(signerAddress)) ===
        false
      ) {
        return errAsync(
          new RegistryPermissionError(
            "Only registrar is allowed to update registry params",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract.initializeContract(
        this.signer,
        registry.address,
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
            registryParams.burnFee == null ? [] : [registryParams.burnFee],
            registryParams.primaryRegistry == null
              ? []
              : [registryParams.primaryRegistry],
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
            return errAsync(
              new BlockchainUnavailableError("registry not found"),
            );
          }
        });
    });
  }

  public createRegistryEntry(
    registryName: string,
    label: string,
    recipientAddress: EthereumAddress,
    data: string,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError> {
    return ResultUtils.combine([
      this.getRegistryByName([registryName]),
      this.getSignerAddress(),
    ]).andThen((vals) => {
      const [registryMap, signerAddress] = vals;
      const registry = registryMap.get(registryName);
      if (registry == null) {
        throw new Error("Registry not found!");
      }

      let shouldCallRegisterByToken: boolean;

      if (
        registry.registrarAddresses.includes(EthereumAddress(signerAddress)) ===
        true
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
      this.nonFungibleRegistryContract.initializeContract(
        this.signer,
        registry.address,
      );

      if (shouldCallRegisterByToken === true) {
        return this.hypertokenContract
          .approve(registry.address, registry.registrationFee)
          .andThen(() => {
            return this.nonFungibleRegistryContract.registerByToken(
              recipientAddress,
              label,
              data,
            );
          });
      } else {
        return this.nonFungibleRegistryContract.register(
          recipientAddress,
          label,
          data,
        );
      }
    });
  }

  public createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<void, BlockchainUnavailableError> {
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
    address: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError> {
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
          EthereumAddress(signerAddress),
        ) === false
      ) {
        return errAsync(
          new RegistryPermissionError(
            "You don't have permission to grantRole registry",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract.initializeContract(
        this.signer,
        registry.address,
      );

      return this.nonFungibleRegistryContract.grantRole(address);
    });
  }

  public revokeRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError> {
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
          EthereumAddress(signerAddress),
        ) === false
      ) {
        return errAsync(
          new RegistryPermissionError(
            "You don't have permission to revokeRole registry",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract.initializeContract(
        this.signer,
        registry.address,
      );

      return this.nonFungibleRegistryContract.revokeRole(address);
    });
  }

  public renounceRegistrarRole(
    registryName: string,
    address: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError | RegistryPermissionError> {
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
          EthereumAddress(signerAddress),
        ) === false &&
        registry.registrarAddresses.includes(EthereumAddress(signerAddress)) ===
          false
      ) {
        return errAsync(
          new RegistryPermissionError(
            "You don't have permission to renounceRole registry",
          ),
        );
      }

      // Call the NFI contract of that address
      this.nonFungibleRegistryContract.initializeContract(
        this.signer,
        registry.address,
      );

      return this.nonFungibleRegistryContract.renounceRole(address);
    });
  }

  public getNumberOfRegistries(): ResultAsync<
    number,
    BlockchainUnavailableError
  > {
    return this.registryFactoryContract.getNumberOfEnumerableRegistries();
  }

  private getRegistryByIndex(
    index: number,
  ): ResultAsync<Registry | null, BlockchainUnavailableError> {
    return this.registryFactoryContract
      .enumerableRegistries(index)
      .andThen((registryAddress) => {
        // Call the NFI contract of that address
        this.nonFungibleRegistryContract.initializeContract(
          this.provider,
          registryAddress,
        );

        // Get the name, symbol and NumberOfEntries of that registry address
        return ResultUtils.combine([
          this.getRegistryContractRegistrarRoleAddresses(),
          this.getRegistryContractRegistrarRoleAdminAddresses(),
          this.nonFungibleRegistryContract.name(),
          this.nonFungibleRegistryContract.symbol(),
          this.nonFungibleRegistryContract.totalSupply(),
          this.nonFungibleRegistryContract.allowLazyRegister(),
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
            registrarAdminAddresses,
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
              registrarAdminAddresses,
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
    tokenId: number,
  ): ResultAsync<RegistryEntry, BlockchainUnavailableError> {
    return ResultUtils.combine([
      this.nonFungibleRegistryContract.reverseRegistryMap(tokenId),
      this.nonFungibleRegistryContract.ownerOf(tokenId),
      this.nonFungibleRegistryContract.tokenURI(tokenId),
    ]).andThen((vals) => {
      const [label, owner, tokenURI] = vals;
      return okAsync(new RegistryEntry(label, tokenId, owner, tokenURI, null));
    });
  }

  private getRegistryContractRegistrarRoleAddresses(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this.nonFungibleRegistryContract
      .getRegistrarRoleMemberCount()
      .andThen((countBigNumber) => {
        const count = countBigNumber.toNumber();
        const registrarResults: ResultAsync<
          EthereumAddress,
          BlockchainUnavailableError
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
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this.nonFungibleRegistryContract
      .getRegistrarRoleAdminMemberCount()
      .andThen((countBigNumber) => {
        const count = countBigNumber.toNumber();
        const registrarResults: ResultAsync<
          EthereumAddress,
          BlockchainUnavailableError
        >[] = [];
        for (let index = 0; index < count; index++) {
          registrarResults.push(
            this.nonFungibleRegistryContract.getRegistrarRoleAdminMember(index),
          );
        }
        return ResultUtils.combine(registrarResults);
      });
  }

  private getSignerAddress(): ResultAsync<string, BlockchainUnavailableError> {
    if (this.signer == null) {
      throw new Error("Signer is not available");
    }
    return ResultAsync.fromPromise(
      this.signer.getAddress() as Promise<EthereumAddress>,
      (e) => {
        return new BlockchainUnavailableError(
          "Unable to call signer getAddress()",
          e,
        );
      },
    );
  }

  public initializeReadOnly(): ResultAsync<void, BlockchainUnavailableError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).map((vals) => {
      const [config, provider] = vals;
      this.provider = provider;
      this.registryFactoryContract.initializeContract(
        provider,
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as EthereumAddress,
      );
      this.registryFactoryContract.initializeContract(
        provider,
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as EthereumAddress,
      );
    });
  }

  public initializeForWrite(): ResultAsync<void, BlockchainUnavailableError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceSigner(),
    ]).map((vals) => {
      const [config, signer] = vals;
      this.signer = signer;
      this.registryFactoryContract.initializeContract(
        signer,
        config.chainAddresses[config.governanceChainId]
          ?.registryFactoryAddress as EthereumAddress,
      );
    });
  }
}
