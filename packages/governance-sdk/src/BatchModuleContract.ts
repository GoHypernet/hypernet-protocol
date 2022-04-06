import {
  EthereumContractAddress,
  GovernanceAbis,
  BatchModuleContractError,
  RegistryEntry,
  GasUnits,
  TransactionNotImplementedError,
  TransactionServerError,
  TransactionTimeoutError,
  TransactionUnknownError,
  TransactionUnsupportedOperationError,
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

  public batchRegisterAsync(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides: ContractOverrides | null = null,
  ): ResultAsync<
    ethers.providers.TransactionResponse,
    | TransactionNotImplementedError
    | TransactionServerError
    | TransactionTimeoutError
    | TransactionUnknownError
    | TransactionUnsupportedOperationError
    | BatchModuleContractError
  > {
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
        const overrideObject = {
          maxFeePerGas: gasFee.maxFeePerGas,
          ...(overrides != null ? overrides : {}),
        };
        console.log("overrideObject: ", overrideObject);

        return ResultAsync.fromPromise(
          this.contract.batchRegister(
            recipients,
            labels,
            datas,
            tokenIds,
            registryAddress,
            overrideObject,
          ) as Promise<ethers.providers.TransactionResponse>,
          (e) => {
            console.log("error from register(): ", e);
            return this.handleTransactionError(
              e,
              "Unable to call BatchModuleContract batchRegister()",
            );
          },
        );
      });
  }

  public estimateGasbatchRegister(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides: ContractOverrides | null = null,
  ): ResultAsync<GasUnits, BatchModuleContractError> {
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
          this.contract.estimateGas.batchRegister(
            recipients,
            labels,
            datas,
            tokenIds,
            registryAddress,
            { ...gasFee, ...overrides },
          ) as Promise<ethers.BigNumber>,
          (e) => {
            return new BatchModuleContractError(
              "Unable to call BatchModuleContract estimateGas.batchRegister()",
              e,
            );
          },
        ).map((estimatedGas) => GasUnits(estimatedGas.toNumber()));
      });
  }

  private handleTransactionError(
    e: any,
    defaultErrorMessage: string,
  ):
    | TransactionNotImplementedError
    | TransactionServerError
    | TransactionTimeoutError
    | TransactionUnknownError
    | TransactionUnsupportedOperationError
    | BatchModuleContractError {
    const errorCode = e?.code;
    const errorMessage = e?.body?.error?.message || defaultErrorMessage;
    if (errorCode == "NOT_IMPLEMENTED") {
      return new TransactionNotImplementedError(errorMessage, e);
    }
    if (errorCode == "SERVER_ERROR") {
      return new TransactionServerError(errorMessage, e);
    }
    if (errorCode == "TIMEOUT") {
      return new TransactionTimeoutError(errorMessage, e);
    }
    if (errorCode == "UNKNOWN_ERROR") {
      return new TransactionUnknownError(errorMessage, e);
    }
    if (errorCode == "UNSUPPORTED_OPERATION") {
      return new TransactionUnsupportedOperationError(errorMessage, e);
    }

    return new BatchModuleContractError(errorMessage, e);
  }
}
