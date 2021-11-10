import { BigNumber, ethers } from "ethers";
import {
  BigNumberString,
  EthereumAddress,
  GovernanceAbis,
  ERC20ContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { IERC20Contract } from "@contracts/interfaces/utilities";

export class ERC20Contract implements IERC20Contract {
  protected contract: ethers.Contract | null = null;
  constructor(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner,
    contractAddress: EthereumAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      GovernanceAbis.Hypertoken.abi,
      providerOrSigner,
    );
  }

  public approve(
    registryAddress: EthereumAddress,
    registrationFee: BigNumberString,
  ): ResultAsync<void, ERC20ContractError> {
    return ResultAsync.fromPromise(
      this.contract?.approve(registryAddress, registrationFee) as Promise<any>,
      (e) => {
        return new ERC20ContractError(
          "Unable to call hypertokenContract approve()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new ERC20ContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public delegate(
    delegateAddress: EthereumAddress,
  ): ResultAsync<void, ERC20ContractError> {
    return ResultAsync.fromPromise(
      this.contract?.delegate(delegateAddress) as Promise<any>,
      (e) => {
        return new ERC20ContractError(
          "Unable to call hypertokenContract delegate()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait() as Promise<void>, (e) => {
          return new ERC20ContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }

  public balanceOf(
    account: EthereumAddress,
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
    account: EthereumAddress,
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
