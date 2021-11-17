import {
  EthereumAccountAddress,
  EthereumContractAddress,
  GovernanceAbis,
  RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { IRegistryFactoryContract } from "@contracts/interfaces/utilities";

export class RegistryFactoryContract implements IRegistryFactoryContract {
  protected contract: ethers.Contract | null = null;
  constructor(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
    contractAddress: EthereumContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      GovernanceAbis.UpgradeableRegistryFactory.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EthereumContractAddress {
    return EthereumContractAddress(this.contract?.address || "");
  }

  public getContract(): ethers.Contract | null {
    return this.contract;
  }

  public addressToName(
    registryAddress: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.addressToName(
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
      this.contract?.enumerableRegistries(
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
    registryName: string,
  ): ResultAsync<EthereumContractAddress, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.nameToAddress(
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
      this.contract?.getNumberOfEnumerableRegistries() as Promise<BigNumber>,
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
      this.contract?.registrationFee() as Promise<BigNumber>,
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
  ): ResultAsync<void, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.createRegistryByToken(
        name,
        symbol,
        registrarAddress,
        enumerable,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call factoryContract createRegistryByToken()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new RegistryFactoryContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }
}
