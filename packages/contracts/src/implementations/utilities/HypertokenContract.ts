import { BigNumber, ethers } from "ethers";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import {
  BigNumberString,
  EthereumAddress,
  GovernanceAbis,
  HypertokenContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { IHypertokenContract } from "@contracts/interfaces/utilities";

export class HypertokenContract implements IHypertokenContract {
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
      GovernanceAbis.Hypertoken.abi,
      providerOrSigner,
    );
  }

  public approve(
    registryAddress: EthereumAddress,
    registrationFee: BigNumberString,
  ): ResultAsync<void, HypertokenContractError> {
    return ResultAsync.fromPromise(
      this.contract?.factoryContract.addressToName(
        registryAddress,
        registrationFee,
      ) as Promise<any>,
      (e) => {
        return new HypertokenContractError(
          "Unable to call hypertokenContract approve()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new HypertokenContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }
}
