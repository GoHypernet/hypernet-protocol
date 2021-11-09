import { BigNumber, ethers } from "ethers";
import {
  EthereumAddress,
  GovernanceAbis,
  RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { IRegistryFactoryContract } from "@contracts/interfaces/utilities";

export class RegistryFactoryContract implements IRegistryFactoryContract {
  protected contract: ethers.Contract | null = null;
  constructor(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
    contractAddress: EthereumAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      GovernanceAbis.UpgradeableRegistryFactory.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EthereumAddress {
    return EthereumAddress(this.contract?.address || "");
  }

  public getContract(): ethers.Contract | null {
    return this.contract;
  }

  public addressToName(
    registryAddress: EthereumAddress,
  ): ResultAsync<EthereumAddress, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.addressToName(registryAddress) as Promise<EthereumAddress>,
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
  ): ResultAsync<EthereumAddress, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.enumerableRegistries(index) as Promise<EthereumAddress>,
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
  ): ResultAsync<EthereumAddress, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.nameToAddress(registryName) as Promise<EthereumAddress>,
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
    registrarAddress: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<void, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.createRegistryByToken(
        name,
        symbol,
        registrarAddress,
        enumerable,
      ) as Promise<any>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call factoryContract createRegistryByToken()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new RegistryFactoryContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }
}
