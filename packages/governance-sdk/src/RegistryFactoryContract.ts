import {
  EthereumAccountAddress,
  EthereumContractAddress,
  GovernanceAbis,
  RegistryFactoryContractError,
  RegistryName,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";
import { GasUtils } from "@governance-sdk/GasUtils";
import { IRegistryFactoryContract } from "@governance-sdk/IRegistryFactoryContract";

export class RegistryFactoryContract implements IRegistryFactoryContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    contractAddress: EthereumContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      GovernanceAbis.UpgradeableRegistryFactory.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EthereumContractAddress {
    return EthereumContractAddress(this.contract.address);
  }

  public getContract(): ethers.Contract | null {
    return this.contract;
  }

  public addressToName(
    registryAddress: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.addressToName(
        registryAddress,
      ) as Promise<EthereumContractAddress>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call factoryContract addressToName()",
          e,
        );
      },
    );
  }

  public enumerableRegistries(
    index: number,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.enumerableRegistries(
        index,
      ) as Promise<EthereumContractAddress>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call factoryContract enumerableRegistries()",
          e,
        );
      },
    );
  }

  public nameToAddress(
    registryName: RegistryName,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError> {
    console.log("called for registryName:", registryName);
    return ResultAsync.fromPromise(
      this.contract.nameToAddress(
        registryName,
      ) as Promise<EthereumContractAddress>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call factoryContract nameToAddress()",
          e,
        );
      },
    );
  }

  public getNumberOfEnumerableRegistries(): ResultAsync<
    number,
    RegistryFactoryContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getNumberOfEnumerableRegistries() as Promise<BigNumber>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call factoryContract getNumberOfEnumerableRegistries()",
          e,
        );
      },
    ).map((numberOfRegistries) => numberOfRegistries.toNumber());
  }

  public registrationFee(): ResultAsync<
    BigNumber,
    RegistryFactoryContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.registrationFee() as Promise<BigNumber>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call factoryContract registrationFee()",
          e,
        );
      },
    );
  }

  public createRegistryByToken(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, RegistryFactoryContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new RegistryFactoryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract.createRegistryByToken(
            name,
            symbol,
            registrarAddress,
            enumerable,
            { ...gasFee, ...overrides },
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new RegistryFactoryContractError(
              "Unable to call factoryContract createRegistryByToken()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new RegistryFactoryContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public createRegistry(
    name: string,
    symbol: string,
    registrarAddress: EthereumAccountAddress,
    enumerable: boolean,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, RegistryFactoryContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new RegistryFactoryContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract.createRegistry(
            name,
            symbol,
            registrarAddress,
            enumerable,
            { ...gasFee, ...overrides },
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new RegistryFactoryContractError(
              "Unable to call factoryContract createRegistry()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new RegistryFactoryContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public getRegistrarDefaultAdminRoleMember(): ResultAsync<
    EthereumAccountAddress[],
    RegistryFactoryContractError
  > {
    return this.getRegistrarDefaultAdminRole().andThen(
      (registrarDefaultAdminRole) => {
        return this.getRegistrarDefaultAdminRoleMemberCount(
          registrarDefaultAdminRole,
        ).andThen((countBigNumber) => {
          const count = countBigNumber.toNumber();

          const registrarResults: ResultAsync<
            EthereumAccountAddress,
            RegistryFactoryContractError
          >[] = [];

          for (let index = 0; index < count; index++) {
            registrarResults.push(
              ResultAsync.fromPromise(
                this.contract.getRoleMember(
                  registrarDefaultAdminRole,
                  index,
                ) as Promise<EthereumAccountAddress>,
                (e) => {
                  return new RegistryFactoryContractError(
                    `Unable to call getRoleMember DEFAULT_ADMIN_ROLE for registrarDefaultAdminRole: ${registrarDefaultAdminRole} - count: ${count} - index: ${index}`,
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

  private getRegistrarDefaultAdminRole(): ResultAsync<
    ethers.providers.TransactionResponse,
    RegistryFactoryContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.DEFAULT_ADMIN_ROLE() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call DEFAULT_ADMIN_ROLE",
          e,
        );
      },
    );
  }

  private getRegistrarDefaultAdminRoleMemberCount(
    registrarDefaultAdminRole: ethers.providers.TransactionResponse,
  ): ResultAsync<BigNumber, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        registrarDefaultAdminRole, // Get the registrar default admin role addresses numbers
      ) as Promise<BigNumber>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call getRegistrarDefaultAdminRoleMemberCount DEFAULT_ADMIN_ROLE",
          e,
        );
      },
    );
  }
}
