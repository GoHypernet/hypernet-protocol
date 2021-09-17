import {
  Proposal,
  BlockchainUnavailableError,
  EthereumAddress,
} from "@hypernetlabs/objects";
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

  public createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
  ): ResultAsync<string, BlockchainUnavailableError> {
    return this.governanceRepository.createProposal(name, symbol, owner);
  }

  public delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this.governanceRepository.delegateVote(delegateAddress, amount);
  }
}
