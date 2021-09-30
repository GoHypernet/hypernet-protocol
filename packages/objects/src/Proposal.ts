import { EthereumAddress } from "@objects/EthereumAddress";
import { BigNumberString } from "@objects/BigNumberString";
import { EProposalVoteSupport, EProposalState } from "@objects/typing";

export class ProposalVoteReceipt {
  constructor(
    public proposalId: BigNumberString,
    public voterAddress: EthereumAddress,
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
    public votesFor: string,
    public votesAgaints: string,
    public proposalETA: string,
    public description: string,
    public proposalNumber: number | null,
  ) {}
}
