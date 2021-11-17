import {
  BlockchainUnavailableError,
  PublicIdentifier,
  RouterDetails,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRouterRepository {
  getRouterDetails(
    publicIdentifiers: PublicIdentifier[],
  ): ResultAsync<
    Map<PublicIdentifier, RouterDetails>,
    BlockchainUnavailableError
  >;
}

export const IRouterRepositoryType = Symbol.for("IRouterRepository");
