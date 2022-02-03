import {
  EthereumContractAddress,
  GovernanceAbis,
  LazyMintModuleContractError,
  RegistryTokenId,
  Signature,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";
import { GasUtils } from "@governance-sdk/GasUtils";
import { ILazyMintModuleContract } from "@governance-sdk/ILazyMintModuleContract";

export class LazyMintModuleContract implements ILazyMintModuleContract {
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
      GovernanceAbis.LazyMintModule.abi,
      providerOrSigner,
    );
  }

  public lazyRegister(
    registryAddress: EthereumContractAddress,
    signature: Signature,
    tokenId: RegistryTokenId,
    ownerAddress: EthereumAccountAddress,
    registrationData: string,
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, LazyMintModuleContractError> {
    const label = "";
    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new LazyMintModuleContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract.lazyRegister(
            ownerAddress,
            label,
            registrationData,
            tokenId,
            signature,
            registryAddress,
            { ...gasFee, ...overrides },
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new LazyMintModuleContractError(
              "Unable to call LazyMintModuleContract batchRegister()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new LazyMintModuleContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }
}
