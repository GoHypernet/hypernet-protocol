import { ethers } from "ethers";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import {
  EthereumAddress,
  GovernanceAbis,
  RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { IRegistryFactoryContract } from "@contracts/interfaces/utilities";

export class RegistryFactoryContract implements IRegistryFactoryContract {
  protected contract: ethers.Contract | null = null;
  constructor(@inject(ILogUtilsType) protected logUtils: ILogUtils) {}

  public initializeContract(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
    contractAddress: EthereumAddress,
  ): void {
    this.contract = new ethers.Contract(
      contractAddress,
      GovernanceAbis.UpgradeableRegistryFactory.abi,
      providerOrSigner,
    );
  }

  public addressToName(
    registryAddress: EthereumAddress,
  ): ResultAsync<EthereumAddress, RegistryFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract?.factoryContract.addressToName(
        registryAddress,
      ) as Promise<EthereumAddress>,
      (e) => {
        return new RegistryFactoryContractError(
          "Unable to call addressToName()",
          e,
        );
      },
    );
  }
}
