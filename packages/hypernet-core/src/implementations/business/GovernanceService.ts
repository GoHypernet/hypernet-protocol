import {
  Proposal,
  BlockchainUnavailableError,
  EthereumAddress,
  EVoteSupport,
  ProposalVoteReceipt,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { inject } from "inversify";

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

  public getProposalsCount(): ResultAsync<number, BlockchainUnavailableError> {
    return this.governanceRepository.getProposalsCount();
  }

  public createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.governanceRepository.createProposal(name, symbol, owner);
  }

  public delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this.governanceRepository.delegateVote(delegateAddress, amount);
  }

  public getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.governanceRepository.getProposalDetails(proposalId);
  }

  public castVote(
    proposalId: string,
    support: EVoteSupport,
  ): ResultAsync<Proposal, BlockchainUnavailableError> {
    return this.governanceRepository.castVote(proposalId, support);
  }

  public getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<ProposalVoteReceipt, BlockchainUnavailableError> {
    return this.governanceRepository.getProposalVotesReceipt(
      proposalId,
      voterAddress,
    );
  }
}
