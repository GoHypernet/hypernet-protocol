import {
  BigNumberString,
  EthereumAccountAddress,
  EthereumContractAddress,
  GovernanceAbis,
  NonFungibleRegistryContractError,
  RegistryEntry,
  RegistryTokenId,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { BigNumber, ethers } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";
import { GasUtils } from "@governance-sdk/GasUtils";
import { INonFungibleRegistryEnumerableUpgradeableContract } from "@governance-sdk/INonFungibleRegistryEnumerableUpgradeableContract";

export class NonFungibleRegistryEnumerableUpgradeableContract
  implements INonFungibleRegistryEnumerableUpgradeableContract
{
  protected contract: ethers.Contract | null = null;
  constructor(
    private providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    private registryAddress: EthereumContractAddress,
  ) {
    this.reinitializeContract(registryAddress);
  }

  public getContractAddress(): EthereumContractAddress {
    return EthereumContractAddress(this.contract?.address || "");
  }

  private getRegistrarRoleMemberCount(
    registrarRole: ethers.providers.TransactionResponse,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<BigNumber, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.getRoleMemberCount(
        registrarRole, // Get the registrar role addresses numbers
      ) as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call getRoleMemberCount REGISTRAR_ROLE",
          e,
        );
      },
    );
  }

  public getRegistrarRoleMember(
    registryAddress: EthereumContractAddress,
  ): ResultAsync<EthereumAccountAddress[], NonFungibleRegistryContractError> {
    return this.getRegistrarRole(registryAddress).andThen((registrarRole) => {
      return this.getRegistrarRoleMemberCount(
        registrarRole,
        registryAddress,
      ).andThen((countBigNumber) => {
        const count = countBigNumber.toNumber();
        this.reinitializeContract(registryAddress);

        const registrarResults: ResultAsync<
          EthereumAccountAddress,
          NonFungibleRegistryContractError
        >[] = [];
        for (let index = 0; index < count; index++) {
          registrarResults.push(
            ResultAsync.fromPromise(
              this.contract?.getRoleMember(
                registrarRole,
                index,
              ) as Promise<EthereumAccountAddress>,
              (e) => {
                return new NonFungibleRegistryContractError(
                  `Unable to call getRoleMember REGISTRAR_ROLE for registryAddress: ${registryAddress} - registrarRole: ${registrarRole} - count: ${count} - index: ${index}`,
                  e,
                );
              },
            ),
          );
        }
        return ResultUtils.combine(registrarResults);
      });
    });
  }

  private getRegistrarRole(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<
    ethers.providers.TransactionResponse,
    NonFungibleRegistryContractError
  > {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.REGISTRAR_ROLE() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call REGISTRAR_ROLE",
          e,
        );
      },
    );
  }

  private getRegistrarRoleAdminMemberCount(
    registrarRoleAdmin: ethers.providers.TransactionResponse,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<BigNumber, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.getRoleMemberCount(
        registrarRoleAdmin, // Get the registrar role admin addresses numbers
      ) as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call getRegistrarRoleAdminMemberCount REGISTRAR_ROLE_ADMIN",
          e,
        );
      },
    );
  }

  public getRegistrarRoleAdminMember(
    registryAddress: EthereumContractAddress,
  ): ResultAsync<EthereumAccountAddress[], NonFungibleRegistryContractError> {
    return this.getRegistrarRoleAdmin(registryAddress).andThen(
      (registrarRoleAdmin) => {
        return this.getRegistrarRoleAdminMemberCount(
          registrarRoleAdmin,
          registryAddress,
        ).andThen((countBigNumber) => {
          const count = countBigNumber.toNumber();
          this.reinitializeContract(registryAddress);

          const registrarResults: ResultAsync<
            EthereumAccountAddress,
            NonFungibleRegistryContractError
          >[] = [];
          for (let index = 0; index < count; index++) {
            registrarResults.push(
              ResultAsync.fromPromise(
                this.contract?.getRoleMember(
                  registrarRoleAdmin,
                  index,
                ) as Promise<EthereumAccountAddress>,
                (e) => {
                  return new NonFungibleRegistryContractError(
                    `Unable to call getRegistrarRoleAdminMember REGISTRAR_ROLE_ADMIN for registryAddress: ${registryAddress} - registrarRoleAdmin: ${registrarRoleAdmin} - count: ${count} - index: ${index}`,
                    e,
                  );
                },
              ),
            );
          }
          return ResultUtils.combine(registrarResults);
        });
      },
    );
  }

  private getRegistrarRoleAdmin(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<
    ethers.providers.TransactionResponse,
    NonFungibleRegistryContractError
  > {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.REGISTRAR_ROLE_ADMIN() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call REGISTRAR_ROLE_ADMIN",
          e,
        );
      },
    );
  }

  public name(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.name() as Promise<string>,
      (e) => {
        return new NonFungibleRegistryContractError("Unable to call name()", e);
      },
    );
  }

  public symbol(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.symbol() as Promise<string>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call symbol()",
          e,
        );
      },
    );
  }

  public totalSupply(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<number, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.totalSupply() as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call totalSupply()",
          e,
        );
      },
    ).map((totalSupply) => totalSupply.toNumber());
  }

  public allowStorageUpdate(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<boolean, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.allowStorageUpdate() as Promise<boolean>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call allowStorageUpdate()",
          e,
        );
      },
    );
  }

  public allowLabelChange(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<boolean, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.allowLabelChange() as Promise<boolean>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call allowLabelChange()",
          e,
        );
      },
    );
  }

  public allowTransfers(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<boolean, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.allowTransfers() as Promise<boolean>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call allowTransfers()",
          e,
        );
      },
    );
  }

  public registrationToken(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.registrationToken() as Promise<EthereumContractAddress>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call registrationToken()",
          e,
        );
      },
    );
  }

  public registrationFee(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<BigNumberString, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.registrationFee() as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call registrationFee()",
          e,
        );
      },
    ).map((fee) => {
      return BigNumberString(ethers.utils.formatUnits(fee, "ether"));
    });
  }

  public registrationFeeBigNumber(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<BigNumber, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.registrationFee() as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call registrationFeeBigNumber()",
          e,
        );
      },
    );
  }

  public burnAddress(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.burnAddress() as Promise<EthereumAccountAddress>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call burnAddress()",
          e,
        );
      },
    );
  }

  public burnFee(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<number, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.burnFee() as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call burnFee()",
          e,
        );
      },
    ).map((fee) => {
      return fee.toNumber();
    });
  }

  public primaryRegistry(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.primaryRegistry() as Promise<EthereumContractAddress>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call primaryRegistry()",
          e,
        );
      },
    );
  }

  public baseURI(
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.baseURI() as Promise<string>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call baseURI()",
          e,
        );
      },
    );
  }

  public tokenByIndex(
    index: number,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.tokenByIndex(index) as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call tokenByIndex()",
          e,
        );
      },
    ).map((tokenId) => RegistryTokenId(tokenId.toNumber()));
  }

  public tokenOfOwnerByIndex(
    ownerAddress: EthereumAccountAddress,
    index: number,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.tokenOfOwnerByIndex(
        ownerAddress,
        index,
      ) as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call tokenOfOwnerByIndex()",
          e,
        );
      },
    ).map((tokenId) => RegistryTokenId(tokenId.toNumber()));
  }

  public registryMap(
    label: string,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.registryMap(label) as Promise<RegistryTokenId>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call registryMap()",
          e,
        );
      },
    );
  }

  public reverseRegistryMap(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.reverseRegistryMap(tokenId) as Promise<string>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call reverseRegistryMap()",
          e,
        );
      },
    );
  }

  public ownerOf(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.ownerOf(tokenId) as Promise<EthereumAccountAddress>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call ownerOf()",
          e,
        );
      },
    );
  }

  public tokenURI(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<string, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.tokenURI(tokenId) as Promise<string>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call tokenURI()",
          e,
        );
      },
    );
  }

  public updateRegistration(
    tokenId: RegistryTokenId,
    registrationData: string,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract?.updateRegistration(
            BigNumber.from(tokenId),
            registrationData,
            { ...gasFee, ...overrides },
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call updateRegistration()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public updateLabel(
    tokenId: RegistryTokenId,
    label: string,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract?.updateLabel(BigNumber.from(tokenId), label, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call updateLabel()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public transferFrom(
    tokenId: RegistryTokenId,
    ownerAddress: EthereumAccountAddress,
    toAddress: EthereumAccountAddress,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract?.transferFrom(ownerAddress, toAddress, tokenId, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call transferFrom()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public burn(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract?.burn(tokenId, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call burn()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public setRegistryParameters(
    params: string,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract?.setRegistryParameters(params, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              `Unable to call setRegistryParameters() for registryAddress: ${registryAddress} with params: ${params}`,
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public registerByToken(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string | null,
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract?.registerByToken(
            recipientAddress,
            label,
            data,
            tokenId,
            { ...gasFee, ...overrides },
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call registerByToken()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public register(
    recipientAddress: EthereumAccountAddress,
    label: string,
    data: string | null,
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract?.register(recipientAddress, label, data, tokenId, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call register()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public grantRole(
    address: EthereumAccountAddress | EthereumContractAddress,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return this.getRegistrarRole().andThen((registrarRole) => {
          return ResultAsync.fromPromise(
            this.contract?.grantRole(registrarRole, address, {
              ...gasFee,
              ...overrides,
            }) as Promise<ethers.providers.TransactionResponse>,
            (e) => {
              return new NonFungibleRegistryContractError(
                "Unable to call grantRole",
                e,
              );
            },
          );
        });
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public revokeRole(
    address: EthereumAccountAddress | EthereumContractAddress,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new NonFungibleRegistryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return this.getRegistrarRole().andThen((registrarRole) => {
          return ResultAsync.fromPromise(
            this.contract?.revokeRole(registrarRole, address, {
              ...gasFee,
              ...overrides,
            }) as Promise<ethers.providers.TransactionResponse>,
            (e) => {
              return new NonFungibleRegistryContractError(
                "Unable to call revokeRole",
                e,
              );
            },
          );
        });
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public renounceRole(
    address: EthereumAccountAddress | EthereumContractAddress,
    registryAddress?: EthereumContractAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return this.getRegistrarRole(registryAddress)
      .andThen((registrarRole) => {
        this.reinitializeContract(registryAddress);

        return GasUtils.getGasFee(this.providerOrSigner)
          .mapErr((e) => {
            return new NonFungibleRegistryContractError(
              "Error getting gas fee",
              e,
            );
          })
          .andThen((gasFee) => {
            return ResultAsync.fromPromise(
              this.contract?.renounceRole(registrarRole, address, {
                ...gasFee,
                ...overrides,
              }) as Promise<ethers.providers.TransactionResponse>,
              (e) => {
                return new NonFungibleRegistryContractError(
                  "Unable to call renounceRole",
                  e,
                );
              },
            );
          });
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to wait for tx",
            e,
          );
        });
      })
      .map(() => {});
  }

  public getRegistryEntryByTokenId(
    tokenId: RegistryTokenId,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryEntry, NonFungibleRegistryContractError> {
    return ResultUtils.combine([
      this.reverseRegistryMap(tokenId, registryAddress),
      this.ownerOf(tokenId, registryAddress),
      this.tokenURI(tokenId, registryAddress),
    ]).andThen((vals) => {
      const [label, owner, tokenURI] = vals;
      return okAsync(new RegistryEntry(label, tokenId, owner, tokenURI, null));
    });
  }

  public balanceOf(
    address: EthereumAccountAddress,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<number, NonFungibleRegistryContractError> {
    this.reinitializeContract(registryAddress);

    return ResultAsync.fromPromise(
      this.contract?.balanceOf(address) as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call balanceOf()",
          e,
        );
      },
    ).map((numberOfTokens) => numberOfTokens.toNumber());
  }

  public getRegistryEntryByLabel(
    label: string,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryEntry, NonFungibleRegistryContractError> {
    return this.registryMap(label).andThen((tokenId) => {
      return ResultUtils.combine([
        this.ownerOf(tokenId, registryAddress),
        this.tokenURI(tokenId, registryAddress),
      ]).andThen(([owner, tokenURI]) => {
        return okAsync(
          new RegistryEntry(label, tokenId, owner, tokenURI, null),
        );
      });
    });
  }

  public getRegistryEntryByOwnerAddress(
    ownerAddress: EthereumAccountAddress,
    index: number,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryEntry | null, NonFungibleRegistryContractError> {
    return this.balanceOf(ownerAddress, registryAddress).andThen(
      (numberOfTokens) => {
        if (numberOfTokens == 0 || index >= numberOfTokens) {
          return okAsync(null);
        }

        this.reinitializeContract(registryAddress);

        return ResultAsync.fromPromise(
          this.contract?.tokenOfOwnerByIndex(
            ownerAddress,
            index,
          ) as Promise<BigNumber>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call tokenOfOwnerByIndex()",
              e,
            );
          },
        ).andThen((tokenId) => {
          return this.getRegistryEntryByTokenId(
            RegistryTokenId(tokenId.toNumber()),
            registryAddress,
          );
        });
      },
    );
  }

  public getFirstRegistryEntryByOwnerAddress(
    ownerAddress: EthereumAccountAddress,
    registryAddress?: EthereumContractAddress,
  ): ResultAsync<RegistryEntry | null, NonFungibleRegistryContractError> {
    return this.getRegistryEntryByOwnerAddress(
      ownerAddress,
      0,
      registryAddress,
    );
  }

  private reinitializeContract(registryAddress?: EthereumContractAddress) {
    this.contract = new ethers.Contract(
      registryAddress || this.registryAddress,
      GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
      this.providerOrSigner,
    );
  }
}
