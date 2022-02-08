import {
  BigNumberString,
  EthereumContractAddress,
  GovernanceAbis,
  ERC20ContractError,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { BigNumber, ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";
import { GasUtils } from "@governance-sdk/GasUtils";
import { IERC20Contract } from "@governance-sdk/IERC20Contract";

export class ERC20Contract implements IERC20Contract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    contractAddress: EthereumContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      GovernanceAbis.Hypertoken.abi,
      providerOrSigner,
    );
  }

  public approve(
    registryAddress: EthereumContractAddress,
    registrationFee: BigNumber,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, ERC20ContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new ERC20ContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract.approve(registryAddress, registrationFee, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new ERC20ContractError(
              "Unable to call hypertokenContract approve()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ERC20ContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public delegate(
    delegateAddress: EthereumAccountAddress,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, ERC20ContractError> {
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new ERC20ContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract?.delegate(delegateAddress, {
            ...gasFee,
            ...overrides,
          }) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new ERC20ContractError(
              "Unable to call hypertokenContract delegate()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ERC20ContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public balanceOf(
    account: EthereumAccountAddress,
  ): ResultAsync<BigNumber, ERC20ContractError> {
    return ResultAsync.fromPromise(
      this.contract?.balanceOf(account) as Promise<BigNumber>,
      (e) => {
        return new ERC20ContractError(
          "Unable to call HypernetGovernorContract balanceOf()",
          e,
        );
      },
    );
  }

  public getVotes(
    account: EthereumAccountAddress,
  ): ResultAsync<BigNumber, ERC20ContractError> {
    return ResultAsync.fromPromise(
      this.contract?.getVotes(account) as Promise<BigNumber>,
      (e) => {
        return new ERC20ContractError(
          "Unable to call HypernetGovernorContract getVotes()",
          e,
        );
      },
    );
  }
}
