import {
  NonFungibleRegistryContractError,
  ChainInformation,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IChainInformationRepository {
  getChainInformation(): ResultAsync<ChainInformation[], never>;

  getGovernanceChainInformation(): ResultAsync<ChainInformation, never>;
}

export const IChainInformationRepositoryType = Symbol.for(
  "IChainInformationRepository",
);
