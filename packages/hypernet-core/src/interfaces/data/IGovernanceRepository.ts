import {
  Proposal,
  EthereumAddress,
  EProposalVoteSupport,
  ProposalVoteReceipt,
  HypernetGovernorContractError,
  ERC20ContractError,
  GovernanceSignerUnavailableError,
  BlockchainUnavailableError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGovernanceRepository {
  getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], HypernetGovernorContractError>;
  getProposalsCount(): ResultAsync<number, HypernetGovernorContractError>;
  createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
    enumerable: boolean,
  ): ResultAsync<Proposal, HypernetGovernorContractError>;
  delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError>;
  getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError>;
  castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError>;
  getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAddress,
  ): ResultAsync<ProposalVoteReceipt, HypernetGovernorContractError>;
  queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError>;
  cancelProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError>;
  executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError>;
  getProposalThreshold(): ResultAsync<number, HypernetGovernorContractError>;
  getVotingPower(
    account: EthereumAddress,
  ): ResultAsync<number, HypernetGovernorContractError | ERC20ContractError>;
  getHyperTokenBalance(
    account: EthereumAddress,
  ): ResultAsync<number, ERC20ContractError>;
  initializeReadOnly(): ResultAsync<void, never>;
  initializeForWrite(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;
}

export const IGovernanceRepositoryType = Symbol.for("IGovernanceRepository");
