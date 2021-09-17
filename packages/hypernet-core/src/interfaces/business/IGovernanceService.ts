import {
  BlockchainUnavailableError,
  Proposal,
  EthereumAddress,
  EVoteSupport,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { BigNumber } from "ethers";

export interface IGovernanceService {
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
}
