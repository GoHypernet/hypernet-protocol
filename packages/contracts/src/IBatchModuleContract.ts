import {
  BatchModuleContractError,
  RegistryEntry,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBatchModuleContract {
  batchRegister(
    registryAddress: EthereumContractAddress,
    registryEntries: RegistryEntry[],
  ): ResultAsync<void, BatchModuleContractError>;
}

export const IBatchModuleContractType = Symbol.for("IBatchModuleContract");
