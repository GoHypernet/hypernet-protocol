import { BlockchainUnavailableError, Proposal } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { BigNumber } from "ethers";

export interface IGovernanceService {
  getProposals(
    _proposalsNumberArr?: number[],
  ): ResultAsync<Proposal[], BlockchainUnavailableError>;
  getProposalsCount(
    _proposalsNumberArr?: number[],
  ): ResultAsync<BigNumber, BlockchainUnavailableError>;
}
