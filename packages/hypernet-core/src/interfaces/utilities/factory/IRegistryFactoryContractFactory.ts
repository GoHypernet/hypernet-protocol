import { IRegistryFactoryContract } from "@hypernetlabs/governance-sdk";
import { ResultAsync } from "neverthrow";

export interface IRegistryFactoryContractFactory {
  factoryRegistryFactoryContract(): ResultAsync<
    IRegistryFactoryContract,
    never
  >;
}

export const IRegistryFactoryContractFactoryType = Symbol.for(
  "IRegistryFactoryContractFactory",
);
