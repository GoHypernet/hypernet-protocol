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

  static getGasPrice(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
  ): ResultAsync<ContractOverrides, GasPriceError> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return new GasPriceError("Error retrieving gas price", e);
    }).map((feeData) => {
      return new ContractOverrides(null, feeData.gasPrice);
    });
  }
}
