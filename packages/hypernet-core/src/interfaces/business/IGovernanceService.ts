import {
  Proposal,
  EProposalVoteSupport,
  ProposalVoteReceipt,
  HypernetGovernorContractError,
  ERC20ContractError,
  EthereumAccountAddress,
  IPFSUnavailableError,
  GovernanceSignerUnavailableError,
  BlockchainUnavailableError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGovernanceService {
  getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], HypernetGovernorContractError>;
  getProposalsCount(): ResultAsync<number, HypernetGovernorContractError>;
  createProposal(
    name: string,
    symbol: string,
    owner: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    Proposal,
    IPFSUnavailableError | HypernetGovernorContractError
  >;
  delegateVote(
    delegateAddress: EthereumAccountAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError>;
  getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError>;
  getProposalDescription(
    descriptionHash: string,
  ): ResultAsync<string, IPFSUnavailableError | HypernetGovernorContractError>;
  castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError>;
  getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAccountAddress,
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
    account: EthereumAccountAddress,
  ): ResultAsync<number, HypernetGovernorContractError | ERC20ContractError>;
  getHyperTokenBalance(
    account: EthereumAccountAddress,
  ): ResultAsync<number, ERC20ContractError>;
  initializeReadOnly(): ResultAsync<void, never>;
  initializeForWrite(): ResultAsync<
    void,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
  >;
}

export const IGovernanceServiceType = Symbol.for("IGovernanceService");
