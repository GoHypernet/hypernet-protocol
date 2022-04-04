import {
  BatchModuleContractError,
  RegistryEntry,
  EthereumContractAddress,
  GasUnits,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";

export interface IBatchModuleContract {
  batchRegister(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides?: ContractOverrides | null,
  ): ResultAsync<void, BatchModuleContractError>;

  estimateGasbatchRegister(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides?: ContractOverrides | null,
  ): ResultAsync<GasUnits, BatchModuleContractError>;
}

export const IBatchModuleContractType = Symbol.for("IBatchModuleContract");
