import {
  ERC20ContractError,
  EthereumContractAddress,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";

export interface IERC20Contract {
  approve(
    registryAddress: EthereumContractAddress,
    registrationFee: BigNumber,
    overrides?: ContractOverrides,
  ): ResultAsync<void, ERC20ContractError>;
  delegate(
    delegateAddress: EthereumAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<void, ERC20ContractError>;
  balanceOf(
    account: EthereumAccountAddress,
  ): ResultAsync<BigNumber, ERC20ContractError>;
  getVotes(
    account: EthereumAccountAddress,
  ): ResultAsync<BigNumber, ERC20ContractError>;
}

export const IERC20ContractType = Symbol.for("IERC20Contract");
