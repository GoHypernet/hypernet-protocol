import {
  NonFungibleRegistryContractError,
  PublicIdentifier,
  RouterDetails,
  RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRouterRepository {
  getRouterDetails(
    publicIdentifiers: PublicIdentifier[],
  ): ResultAsync<
    Map<PublicIdentifier, RouterDetails>,
    NonFungibleRegistryContractError | RegistryFactoryContractError
  >;
}

export const IRouterRepositoryType = Symbol.for("IRouterRepository");
