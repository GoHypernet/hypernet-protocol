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

export class Proposal {
  constructor(
    public id: string,
    public state: EProposalState,
    public proposalOriginator: string,
    public proposalVotesFor: string,
    public proposalVotesAgaints: string,
    public proposalETA: string,
    public description: string,
    public proposalNumber: number,
  ) {}
}
