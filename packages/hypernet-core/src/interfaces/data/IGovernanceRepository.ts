import { BlockchainUnavailableError, Proposal } from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IGovernanceRepository {
  getProposals(
    _proposalsNumberArr?: number[],
  ): ResultAsync<Proposal[], BlockchainUnavailableError>;
  getProposalsCount(): ResultAsync<BigNumber, BlockchainUnavailableError>;
}

export const IGovernanceRepositoryType = Symbol.for("IGovernanceRepository");
