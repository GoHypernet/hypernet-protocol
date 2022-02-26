import { GasPriceError } from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";

export class GasUtils {
  static getGasFee(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
  ): ResultAsync<ContractOverrides, GasPriceError> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return new GasPriceError("Error retrieving gas price", e);
    }).map((feeData) => {
      return new ContractOverrides(feeData.maxFeePerGas);
    });
  }

  static getGasFeeInfo(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    transaction: ethers.providers.TransactionResponse,
  ): ResultAsync<ContractOverrides, GasPriceError> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return new GasPriceError("Error retrieving getFeeData", e);
    }).map((feeData) => {
      return new ContractOverrides(
        feeData.maxFeePerGas,
        feeData.gasPrice,
        feeData.maxPriorityFeePerGas,
        transaction.value,
        transaction.nonce,
      );
    });
  }
}
