import {
  BatchModuleContractError,
  RegistryEntry,
  EthereumContractAddress,
  GasUnits,
  TransactionNotImplementedError,
  TransactionServerError,
  TransactionTimeoutError,
  TransactionUnknownError,
  TransactionUnsupportedOperationError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";
import { ethers } from "ethers";

export interface IBatchModuleContract {
  batchRegister(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides?: ContractOverrides | null,
  ): ResultAsync<void, BatchModuleContractError>;
  batchRegisterAsync(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides?: ContractOverrides | null,
  ): ResultAsync<
    ethers.providers.TransactionResponse,
    | TransactionNotImplementedError
    | TransactionServerError
    | TransactionTimeoutError
    | TransactionUnknownError
    | TransactionUnsupportedOperationError
    | BatchModuleContractError
  >;
  estimateGasbatchRegister(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides?: ContractOverrides | null,
  ): ResultAsync<GasUnits, BatchModuleContractError>;
}

export const IBatchModuleContractType = Symbol.for("IBatchModuleContract");
