import {
  BatchModuleContractError,
  RegistryEntry,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { ContractOverrides } from "@governance-sdk/ContractOverrides";

export interface IBatchModuleContract {
  batchRegister(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
    overrides?: ContractOverrides,
  ): ResultAsync<void, BatchModuleContractError>;
}

export const IBatchModuleContractType = Symbol.for("IBatchModuleContract");
