import {
  BigNumberString,
  EthereumAccountAddress,
  EthereumContractAddress,
  GovernanceAbis,
  NonFungibleRegistryContractError,
} from "@hypernetlabs/objects";
import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { INonFungibleRegistryEnumerableUpgradeableContract } from "@contracts/interfaces/utilities";

export class NonFungibleRegistryEnumerableUpgradeableContract
  implements INonFungibleRegistryEnumerableUpgradeableContract
{
  protected contract: ethers.Contract | null = null;
  constructor(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | undefined,
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
    return ResultAsync.fromPromise(
      this.contract?.getRoleMemberCount(
        this.contract?.REGISTRAR_ROLE(), // Get the registrar role addresses numbers
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
    index?: number,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.getRoleMember(
        this.contract?.REGISTRAR_ROLE(),
        index || 0,
      ) as Promise<EthereumAccountAddress>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call getRoleMember REGISTRAR_ROLE",
          e,
        );
      },
    );
  }

  public getRegistrarRoleAdminMemberCount(): ResultAsync<
    BigNumber,
    NonFungibleRegistryContractError
  > {
    return ResultAsync.fromPromise(
      this.contract?.getRoleMemberCount(
        this.contract?.REGISTRAR_ROLE_ADMIN(), // Get the registrar role addresses numbers
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
    index?: number,
  ): ResultAsync<EthereumAccountAddress, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.getRoleMember(
        this.contract?.REGISTRAR_ROLE_ADMIN(),
        index || 0,
      ) as Promise<EthereumAccountAddress>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call getRegistrarRoleAdminMember REGISTRAR_ROLE_ADMIN",
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

  public allowLazyRegister(): ResultAsync<
    boolean,
    NonFungibleRegistryContractError
  > {
    return ResultAsync.fromPromise(
      this.contract?.allowLazyRegister() as Promise<boolean>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call allowLazyRegister()",
          e,
        );
      },
    );
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
  ): ResultAsync<number, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.tokenByIndex(index) as Promise<BigNumber>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call tokenByIndex()",
          e,
        );
      },
    ).map((tokenId) => tokenId.toNumber());
  }

  public reverseRegistryMap(
    tokenId: number,
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
    tokenId: number,
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
    tokenId: number,
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
    tokenId: number,
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
    tokenId: number,
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
    tokenId: number,
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
    tokenId: number,
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
    data: string,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.registerByToken(
        recipientAddress,
        label,
        data,
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
    data: string,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.register(
        recipientAddress,
        label,
        data,
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
    address: EthereumAccountAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.REGISTRAR_ROLE() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call REGISTRAR_ROLE",
          e,
        );
      },
    )
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
      .map((val) => {});
  }

  public revokeRole(
    address: EthereumAccountAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.REGISTRAR_ROLE() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call REGISTRAR_ROLE",
          e,
        );
      },
    )
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
    address: EthereumAccountAddress,
  ): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.REGISTRAR_ROLE() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new NonFungibleRegistryContractError(
          "Unable to call REGISTRAR_ROLE",
          e,
        );
      },
    )
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
}
