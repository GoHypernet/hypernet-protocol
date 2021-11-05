import { BigNumber, ethers } from "ethers";

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
  delegate(
    delegateAddress: EthereumAddress,
  ): ResultAsync<void, HypertokenContractError>;
  balanceOf(
    account: EthereumAddress,
  ): ResultAsync<BigNumber, HypertokenContractError>;
  getVotes(
    account: EthereumAddress,
  ): ResultAsync<BigNumber, HypertokenContractError>;
}

export const IHypertokenContractType = Symbol.for("IHypertokenContract");
