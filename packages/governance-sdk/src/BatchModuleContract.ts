import {
  EthereumContractAddress,
  GovernanceAbis,
  BatchModuleContractError,
  RegistryEntry,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";
import { GasUtils } from "@governance-sdk/GasUtils";
import { IBatchModuleContract } from "@governance-sdk/IBatchModuleContract";

export class BatchModuleContract implements IBatchModuleContract {
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
      GovernanceAbis.BatchModule.abi,
      providerOrSigner,
    );
  }

  public batchRegister(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides: ContractOverrides | null = null,
  ): ResultAsync<void, BatchModuleContractError> {
    const recipients = registryEntries.map(
      (registryEntry) => registryEntry.owner,
    );
    const labels = registryEntries.map((registryEntry) => registryEntry.label);
    const datas = registryEntries.map(
      (registryEntry) => registryEntry.tokenURI,
    );
    const tokenIds = registryEntries.map(
      (registryEntry) => registryEntry.tokenId,
    );

    return GasUtils.getGasFee(this.providerOrSigner)
      .mapErr((e) => {
        return new BatchModuleContractError("Error getting gas fee", e);
      })
      .andThen((gasFee) => {
        return ResultAsync.fromPromise(
          this.contract.batchRegister(
            recipients,
            labels,
            datas,
            tokenIds,
            registryAddress,
            { ...gasFee, ...overrides },
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            return new BatchModuleContractError(
              "Unable to call BatchModuleContract batchRegister()",
              e,
            );
          },
        );
      })
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new BatchModuleContractError("Unable to wait for tx", e);
        });
      })
      .map(() => {});
  }
}
