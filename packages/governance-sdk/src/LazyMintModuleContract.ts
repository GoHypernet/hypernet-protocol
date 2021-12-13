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

import { ILazyMintModuleContract } from "@governance-sdk/ILazyMintModuleContract";

export class LazyMintModuleContract implements ILazyMintModuleContract {
  protected contract: ethers.Contract | null = null;
  constructor(
    providerOrSigner:
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
  ): ResultAsync<void, LazyMintModuleContractError> {
    const label = "";
    return ResultAsync.fromPromise(
      this.contract?.lazyRegister(
        ownerAddress,
        label,
        registrationData,
        tokenId,
        signature,
        registryAddress,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new LazyMintModuleContractError(
          "Unable to call LazyMintModuleContract batchRegister()",
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new LazyMintModuleContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }
}
