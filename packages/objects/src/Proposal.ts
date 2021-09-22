import { BigNumber } from "ethers";
import { EthereumAddress } from "./EthereumAddress";

export enum EProposalState {
  UNDETERMINED = -1,
  PENDING,
  ACTIVE,
  CANCELED,
  DEFEATED,
  SUCCEEDED,
  QUEUED,
  EXPIRED,
  EXECUTED,
}

export enum EVoteSupport {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

export class ProposalVoteReceipt {
  constructor(
    public proposalId: BigNumber,
    public voterAddress: EthereumAddress,
    public hasVoted: boolean,
    public support: EVoteSupport,
    public votes: number,
  ) {}
}

export class Proposal {
  constructor(
    public id: BigNumber,
    public state: EProposalState,
    public proposalOriginator: string,
    public proposalVotesFor: string,
    public proposalVotesAgaints: string,
    public proposalETA: string,
    public description: string,
    public proposalNumber: number | null,
  ) {}
}
