import {
  Proposal,
  EProposalVoteSupport,
  ProposalVoteReceipt,
  HypernetGovernorContractError,
  ERC20ContractError,
  EthereumAccountAddress,
  IPFSUnavailableError,
} from "@hypernetlabs/objects";
import { IGovernanceService } from "@interfaces/business";
import {
  IGovernanceRepository,
  IGovernanceRepositoryType,
} from "@interfaces/data";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

export class GovernanceService implements IGovernanceService {
  constructor(
    @inject(IGovernanceRepositoryType)
    protected governanceRepository: IGovernanceRepository,
  ) {}

  public getProposals(
    pageNumber: number,
    pageSize: number,
  ): ResultAsync<Proposal[], HypernetGovernorContractError> {
    return this.governanceRepository.getProposals(pageNumber, pageSize);
  }

  public getProposalsCount(): ResultAsync<
    number,
    HypernetGovernorContractError
  > {
    return this.governanceRepository.getProposalsCount();
  }

  public createProposal(
    name: string,
    symbol: string,
    owner: EthereumAccountAddress,
    enumerable: boolean,
  ): ResultAsync<
    Proposal,
    IPFSUnavailableError | HypernetGovernorContractError
  > {
    return this.governanceRepository.createProposal(
      name,
      symbol,
      owner,
      enumerable,
    );
  }

  public delegateVote(
    delegateAddress: EthereumAccountAddress,
    amount: number | null,
  ): ResultAsync<void, ERC20ContractError> {
    return this.governanceRepository.delegateVote(delegateAddress, amount);
  }

  public getProposalDetails(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceRepository.getProposalDetails(proposalId);
  }

  public getProposalDescription(
    descriptionHash: string,
  ): ResultAsync<string, IPFSUnavailableError | HypernetGovernorContractError> {
    return this.governanceRepository.getProposalDescription(descriptionHash);
  }

  public castVote(
    proposalId: string,
    support: EProposalVoteSupport,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceRepository.castVote(proposalId, support);
  }

  public getProposalVotesReceipt(
    proposalId: string,
    voterAddress: EthereumAccountAddress,
  ): ResultAsync<ProposalVoteReceipt, HypernetGovernorContractError> {
    return this.governanceRepository.getProposalVotesReceipt(
      proposalId,
      voterAddress,
    );
  }

  public queueProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceRepository.queueProposal(proposalId);
  }

  public cancelProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceRepository.cancelProposal(proposalId);
  }

  public executeProposal(
    proposalId: string,
  ): ResultAsync<Proposal, HypernetGovernorContractError> {
    return this.governanceRepository.executeProposal(proposalId);
  }

  public getProposalThreshold(): ResultAsync<
    number,
    HypernetGovernorContractError
  > {
    return this.governanceRepository.getProposalThreshold();
  }

  public getVotingPower(
    account: EthereumAccountAddress,
  ): ResultAsync<number, HypernetGovernorContractError | ERC20ContractError> {
    return this.governanceRepository.getVotingPower(account);
  }

  public getHyperTokenBalance(
    account: EthereumAccountAddress,
  ): ResultAsync<number, ERC20ContractError> {
    return this.governanceRepository.getHyperTokenBalance(account);
  }
}
