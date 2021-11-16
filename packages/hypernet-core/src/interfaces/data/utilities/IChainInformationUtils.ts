import {
  NonFungibleRegistryContractError,
  ChainInformation,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IChainInformationUtils {
  initialize(): ResultAsync<void, NonFungibleRegistryContractError>;

  getChainInformation(): ResultAsync<ChainInformation[], never>;

  getGovernanceChainInformation(): ResultAsync<ChainInformation, never>;
}

export const IChainInformationUtilsType = Symbol.for("IChainInformationUtils");
