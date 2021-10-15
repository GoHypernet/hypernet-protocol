import {
  BlockchainUnavailableError,
  Proposal,
  EthereumAddress,
  EProposalVoteSupport,
  ProposalVoteReceipt,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGovernanceRepository {
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
  proposeRegistryEntry(
    registryName: string,
    label: string,
    data: string,
    recipient: EthereumAddress,
  ): ResultAsync<Proposal, BlockchainUnavailableError>;
  queueProposal(
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
}

export const IGovernanceRepositoryType = Symbol.for("IGovernanceRepository");
