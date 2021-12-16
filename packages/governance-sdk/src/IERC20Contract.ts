import {
  ERC20ContractError,
  EthereumContractAddress,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IERC20Contract {
  approve(
    registryAddress: EthereumContractAddress,
    registrationFee: BigNumber,
  ): ResultAsync<void, ERC20ContractError>;
  delegate(
    delegateAddress: EthereumAccountAddress,
  ): ResultAsync<void, ERC20ContractError>;
  balanceOf(
    account: EthereumAccountAddress,
  ): ResultAsync<BigNumber, ERC20ContractError>;
  getVotes(
    account: EthereumAccountAddress,
  ): ResultAsync<BigNumber, ERC20ContractError>;
}

export const IERC20ContractType = Symbol.for("IERC20Contract");
