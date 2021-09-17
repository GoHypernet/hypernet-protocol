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

export class Proposal {
  constructor(
    public id: string,
    public state: EProposalState,
    public proposalOriginator: string,
    public proposalVotesFor: string,
    public proposalVotesAgaints: string,
    public proposalETA: string,
    public description: string,
    public proposalNumber: number | null,
  ) {}
}
