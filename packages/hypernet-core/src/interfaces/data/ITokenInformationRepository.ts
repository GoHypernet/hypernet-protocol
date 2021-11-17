import {
  NonFungibleRegistryContractError,
  TokenInformation,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITokenInformationRepository {
  getTokenInformation(): ResultAsync<
    TokenInformation[],
    NonFungibleRegistryContractError
  >;
}
