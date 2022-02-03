import { ResultAsync } from "neverthrow";

import { ChainId } from "@objects/ChainId";
import {
  BlockchainUnavailableError,
  InvalidParametersError,
  ProxyError,
  HypernetGovernorContractError,
  ERC20ContractError,
  GovernanceSignerUnavailableError,
  IPFSUnavailableError,
} from "@objects/errors";
import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { Proposal, ProposalVoteReceipt } from "@objects/Proposal";
import { EProposalVoteSupport } from "@objects/typing";
import { IpfsCID } from "@objects/IpfsCID";
import { InitializeStatus } from "@objects/InitializeStatus";

export interface IHypernetGovernance {
  governanceInitialized(chainId?: ChainId): ResultAsync<boolean, ProxyError>;

  waitGovernanceInitialized(chainId?: ChainId): ResultAsync<void, ProxyError>;

  initializeGovernance(
    chainId?: ChainId,
  ): ResultAsync<
    InitializeStatus,
    | GovernanceSignerUnavailableError
    | BlockchainUnavailableError
    | InvalidParametersError
    | IPFSUnavailableError
    | ProxyError
  >;

  getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], HypernetGovernorContractError | ProxyError>;

  createProposal(
    name: string,
    symbol: string,
    owner: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    Proposal,
    IPFSUnavailableError | HypernetGovernorContractError | ProxyError
  >;

  delegateVote(
    delegateAddress: EthereumAccountAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError | ProxyError>;

  getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  getProposalDescription(
    descriptionHash: IpfsCID,
  ): ResultAsync<
    string,
    IPFSUnavailableError | HypernetGovernorContractError | ProxyError
  >;

  castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAccountAddress,
  ): ResultAsync<
    ProposalVoteReceipt,
    HypernetGovernorContractError | ProxyError
  >;

  getProposalsCount(): ResultAsync<
    number,
    HypernetGovernorContractError | ProxyError
  >;

  getProposalThreshold(): ResultAsync<
    number,
    HypernetGovernorContractError | ProxyError
  >;

  getVotingPower(
    account: EthereumAccountAddress,
  ): ResultAsync<
    number,
    HypernetGovernorContractError | ERC20ContractError | ProxyError
  >;

  getHyperTokenBalance(
    account: EthereumAccountAddress,
  ): ResultAsync<number, ERC20ContractError | ProxyError>;

  queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  cancelProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;

  executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError>;
}
