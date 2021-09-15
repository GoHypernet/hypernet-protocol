import { Proposal, BlockchainUnavailableError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { inject } from "inversify";
import { BigNumber } from "ethers";

import { IGovernanceService } from "@interfaces/business";
import {
  IGovernanceRepository,
  IGovernanceRepositoryType,
} from "@interfaces/data";

export class GovernanceService implements IGovernanceService {
  constructor(
    @inject(IGovernanceRepositoryType)
    protected governanceRepository: IGovernanceRepository,
  ) {}

  public getProposals(
    _proposalsNumberArr?: number[],
  ): ResultAsync<Proposal[], BlockchainUnavailableError> {
    return this.governanceRepository.getProposals(_proposalsNumberArr);
  }

  public getProposalsCount(
    _proposalsNumberArr?: number[],
  ): ResultAsync<BigNumber, BlockchainUnavailableError> {
    return this.governanceRepository.getProposalsCount();
  }
}
