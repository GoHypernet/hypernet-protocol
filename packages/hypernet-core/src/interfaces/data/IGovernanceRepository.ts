import {
  BlockchainUnavailableError,
  Proposal,
  EthereumAddress,
  EVoteSupport,
  ProposalVoteReceipt,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGovernanceRepository {
  getProposals(
    _proposalsNumberArr?: number[],
  ): ResultAsync<Proposal[], BlockchainUnavailableError>;
  getProposalsCount(): ResultAsync<number, BlockchainUnavailableError>;
  createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
  ): ResultAsync<Proposal, BlockchainUnavailableError>;
  delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, BlockchainUnavailableError>;
  getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError>;
  castVote(
    proposalId: string,
    support: EVoteSupport,
  ): ResultAsync<Proposal, BlockchainUnavailableError>;
  getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<ProposalVoteReceipt, BlockchainUnavailableError>;
}

export const IGovernanceRepositoryType = Symbol.for("IGovernanceRepository");
