import {
  BlockchainUnavailableError,
  Proposal,
  EthereumAddress,
  EProposalVoteSupport,
  ProposalVoteReceipt,
  Registry,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGovernanceService {
  getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], BlockchainUnavailableError>;
  getProposalsCount(): ResultAsync<number, BlockchainUnavailableError>;
  createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
    enumerable: boolean,
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
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, BlockchainUnavailableError>;
  getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<ProposalVoteReceipt, BlockchainUnavailableError>;
  queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError>;
  cancelProposal(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError>;
  executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, BlockchainUnavailableError>;
  getProposalThreshold(): ResultAsync<number, BlockchainUnavailableError>;
  getVotingPower(
    account: EthereumAddress,
  ): ResultAsync<number, BlockchainUnavailableError>;
  getHyperTokenBalance(
    account: EthereumAddress,
  ): ResultAsync<number, BlockchainUnavailableError>;
  initializeReadOnly(): ResultAsync<void, BlockchainUnavailableError>;
  initializeForWrite(): ResultAsync<void, BlockchainUnavailableError>;
}
