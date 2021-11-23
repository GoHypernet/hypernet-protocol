import { BigNumberString } from "@objects/BigNumberString";
import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";
import { EProposalVoteSupport, EProposalState } from "@objects/typing";

export class ProposalVoteReceipt {
  constructor(
    public proposalId: BigNumberString,
    public voterAddress: EthereumAccountAddress,
    public hasVoted: boolean,
    public support: EProposalVoteSupport,
    public votes: number,
  ) {}
}

export class Proposal {
  constructor(
    public id: BigNumberString,
    public state: EProposalState,
    public originator: string,
    public votesFor: number,
    public votesAgainst: number,
    public votesAbstain: number,
    public description: string,
    public proposalNumber: number | null,
  ) {}
}
