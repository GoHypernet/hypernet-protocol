import { BigNumber } from "ethers";

import {
  ERC20ContractError,
  BigNumberString,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IERC20Contract {
  approve(
    registryAddress: EthereumAddress,
    registrationFee: BigNumberString,
  ): ResultAsync<void, ERC20ContractError>;
  delegate(
    delegateAddress: EthereumAddress,
  ): ResultAsync<void, ERC20ContractError>;
  balanceOf(
    account: EthereumAddress,
  ): ResultAsync<BigNumber, ERC20ContractError>;
  getVotes(
    account: EthereumAddress,
  ): ResultAsync<BigNumber, ERC20ContractError>;
}

export const IERC20ContractType = Symbol.for("IERC20Contract");
