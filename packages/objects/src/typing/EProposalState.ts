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

export function stringToProposalState(str: string): EProposalState {
  if (str == "0") {
    return EProposalState.PENDING;
  } else if (str == "1") {
    return EProposalState.ACTIVE;
  } else if (str == "2") {
    return EProposalState.CANCELED;
  } else if (str == "3") {
    return EProposalState.DEFEATED;
  } else if (str == "4") {
    return EProposalState.SUCCEEDED;
  } else if (str == "5") {
    return EProposalState.QUEUED;
  } else if (str == "6") {
    return EProposalState.EXPIRED;
  } else if (str == "7") {
    return EProposalState.EXECUTED;
  } else {
    return EProposalState.UNDETERMINED;
  }
}
