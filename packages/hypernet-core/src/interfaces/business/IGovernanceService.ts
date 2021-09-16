import {
  BlockchainUnavailableError,
  Proposal,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { BigNumber } from "ethers";

export interface IGovernanceService {
  getProposals(
    _proposalsNumberArr?: number[],
  ): ResultAsync<Proposal[], BlockchainUnavailableError>;
  getProposalsCount(
    _proposalsNumberArr?: number[],
  ): ResultAsync<BigNumber, BlockchainUnavailableError>;
  createProposal(
    name: string,
    symbol: string,
    owner: EthereumAddress,
  ): ResultAsync<string, BlockchainUnavailableError>;
  delegateVote(
    delegateAddress: EthereumAddress,
    amount: number | null,
  ): ResultAsync<void, BlockchainUnavailableError>;
}
