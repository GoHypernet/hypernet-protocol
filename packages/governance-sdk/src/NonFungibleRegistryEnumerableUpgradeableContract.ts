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

import { INonFungibleRegistryEnumerableUpgradeableContract } from "@governance-sdk/INonFungibleRegistryEnumerableUpgradeableContract";

export class NonFungibleRegistryEnumerableUpgradeableContract
  implements INonFungibleRegistryEnumerableUpgradeableContract
{
  protected contract: ethers.Contract | null = null;
  constructor(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    registryAddress: EthereumContractAddress,
  ) {
    this.contract = new ethers.Contract(
      registryAddress,
      GovernanceAbis.NonFungibleRegistryEnumerableUpgradeable.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EthereumContractAddress {
    return EthereumContractAddress(this.contract?.address || "");
  }

  public getRegistrarRoleMemberCount(): ResultAsync<
    BigNumber,
    NonFungibleRegistryContractError
  > {
    return this.getRegistrarRole().andThen((registrarRole) => {
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
    });
  }

  public getRegistrarRoleMember(
    index?: number,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError> {
    return this.getRegistrarRole().andThen((registrarRole) => {
      return ResultAsync.fromPromise(
        this.contract?.getRoleMember(
          registrarRole,
          index || 0,
        ) as Promise<EthereumAccountAddress>,
        (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to call getRoleMember REGISTRAR_ROLE",
            e,
          );
        },
      );
    });
  }

  private getRegistrarRole(): ResultAsync<
    ethers.providers.TransactionResponse,
    NonFungibleRegistryContractError
  > {
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

  public getRegistrarRoleAdminMemberCount(): ResultAsync<
    BigNumber,
    NonFungibleRegistryContractError
  > {
    return this.getRegistrarRoleAdmin().andThen((registrarRoleAdmin) => {
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
    });
  }

  public getRegistrarRoleAdminMember(
    index?: number,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError> {
    return this.getRegistrarRoleAdmin().andThen((registrarRoleAdmin) => {
      return ResultAsync.fromPromise(
        this.contract?.getRoleMember(
          registrarRoleAdmin,
          index || 0,
        ) as Promise<EthereumAccountAddress>,
        (e) => {
          return new NonFungibleRegistryContractError(
            "Unable to call getRegistrarRoleAdminMember REGISTRAR_ROLE_ADMIN",
            e,
          );
        },
      );
    });
  }

  private getRegistrarRoleAdmin(): ResultAsync<
    ethers.providers.TransactionResponse,
    NonFungibleRegistryContractError
  > {
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

  public name(): ResultAsync<string, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.name() as Promise<string>,
      (e) => {
        return new NonFungibleRegistryContractError("Unable to call name()", e);
      },
    );
  }

  public symbol(): ResultAsync<string, NonFungibleRegistryContractError> {
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

  public totalSupply(): ResultAsync<number, NonFungibleRegistryContractError> {
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

  public allowStorageUpdate(): ResultAsync<
    boolean,
    NonFungibleRegistryContractError
  > {
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

  public allowLabelChange(): ResultAsync<
    boolean,
    NonFungibleRegistryContractError
  > {
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

  public allowTransfers(): ResultAsync<
    boolean,
    NonFungibleRegistryContractError
  > {
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

  public registrationToken(): ResultAsync<
    EthereumContractAddress,
    NonFungibleRegistryContractError
  > {
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

  public registrationFee(): ResultAsync<
    BigNumberString,
    NonFungibleRegistryContractError
  > {
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

  public registrationFeeBigNumber(): ResultAsync<
    BigNumber,
    NonFungibleRegistryContractError
  > {
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

  public burnAddress(): ResultAsync<
    EthereumAccountAddress,
    NonFungibleRegistryContractError
  > {
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

  public burnFee(): ResultAsync<number, NonFungibleRegistryContractError> {
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

  public primaryRegistry(): ResultAsync<
    EthereumContractAddress,
    NonFungibleRegistryContractError
  > {
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

  public tokenByIndex(
    index: number,
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError> {
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
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError> {
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
  ): ResultAsync<RegistryTokenId, NonFungibleRegistryContractError> {
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
  ): ResultAsync<string, NonFungibleRegistryContractError> {
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
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError> {
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
  ): ResultAsync<string, NonFungibleRegistryContractError> {
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
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.updateRegistration(
        BigNumber.from(tokenId),
        registrationData,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call updateRegistration()",
          e,
        );
      },
    )
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
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.updateLabel(
        BigNumber.from(tokenId),
        label,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call updateLabel()",
          e,
        );
      },
    )
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
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.transferFrom(
        ownerAddress,
        toAddress,
        tokenId,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call transferFrom()",
          e,
        );
      },
    )
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
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.burn(
        tokenId,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError("Unable to call burn()", e);
      },
    ).map(() => {});
  }

  public setRegistryParameters(
    params: string,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.setRegistryParameters(
        params,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call setRegistryParameters()",
          e,
        );
      },
    )
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
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.registerByToken(
        recipientAddress,
        label,
        data,
        tokenId,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call registerByToken()",
          e,
        );
      },
    )
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
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.register(
        recipientAddress,
        label,
        data,
        tokenId,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call register()",
          e,
        );
      },
    )
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
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return this.getRegistrarRole()
      .andThen((registrarRole) => {
        return ResultAsync.fromPromise(
          this.contract?.grantRole(
            registrarRole,
            address,
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call grantRole",
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

  public revokeRole(
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return this.getRegistrarRole()
      .andThen((registrarRole) => {
        return ResultAsync.fromPromise(
          this.contract?.revokeRole(
            registrarRole,
            address,
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call revokeRole",
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

  public renounceRole(
    address: EthereumAccountAddress | EthereumContractAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return this.getRegistrarRole()
      .andThen((registrarRole) => {
        return ResultAsync.fromPromise(
          this.contract?.renounceRole(
            registrarRole,
            address,
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new NonFungibleRegistryContractError(
              "Unable to call renounceRole",
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

  public getRegistryEntryByTokenId(
    tokenId: RegistryTokenId,
  ): ResultAsync<RegistryEntry, NonFungibleRegistryContractError> {
    return ResultUtils.combine([
      this.reverseRegistryMap(tokenId),
      this.ownerOf(tokenId),
      this.tokenURI(tokenId),
    ]).andThen((vals) => {
      const [label, owner, tokenURI] = vals;
      return okAsync(new RegistryEntry(label, tokenId, owner, tokenURI, null));
    });
  }

  public balanceOf(
    address: EthereumAccountAddress,
  ): ResultAsync<number, NonFungibleRegistryContractError> {
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
  ): ResultAsync<RegistryEntry, NonFungibleRegistryContractError> {
    return this.registryMap(label).andThen((tokenId) => {
      return ResultUtils.combine([
        this.ownerOf(tokenId),
        this.tokenURI(tokenId),
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
  ): ResultAsync<RegistryEntry | null, NonFungibleRegistryContractError> {
    return this.balanceOf(ownerAddress).andThen((numberOfTokens) => {
      if (numberOfTokens == 0 || index >= numberOfTokens) {
        return okAsync(null);
      }

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
        );
      });
    });
  }

  public getFirstRegistryEntryByOwnerAddress(
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<RegistryEntry | null, NonFungibleRegistryContractError> {
    return this.getRegistryEntryByOwnerAddress(ownerAddress, 0);
  }
}
