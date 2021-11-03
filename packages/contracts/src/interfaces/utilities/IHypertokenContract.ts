import { ethers } from "ethers";

import {
  HypertokenContractError,
  BigNumberString,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHypertokenContract {
  initializeContract(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
    contractAddress: EthereumAddress,
  ): void;
  approve(
    registryAddress: EthereumAddress,
    registrationFee: BigNumberString,
  ): ResultAsync<void, HypertokenContractError>;
}

export const IHypertokenContractType = Symbol.for("IHypertokenContract");
