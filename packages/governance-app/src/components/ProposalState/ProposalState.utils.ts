import { EProposalState } from "./ProposalState.interface";

export const getProposalStateString = (status: EProposalState) => {
  switch (status) {
    case EProposalState.UNDETERMINED:
      return "UNDETERMINED";
    case EProposalState.ACTIVE:
      return "ACTIVE";
    case EProposalState.CANCELED:
      return "CANCELED";
    case EProposalState.DEFEATED:
      return "DEFEATED";
    case EProposalState.EXECUTED:
      return "EXECUTED";
    case EProposalState.EXPIRED:
      return "EXPIRED";
    case EProposalState.PENDING:
      return "PENDING";
    case EProposalState.QUEUED:
      return "QUEUED";
    case EProposalState.SUCCEEDED:
      return "SUCCEEDED";

    default:
      return "UNDETERMINED";
  }
};

export const getProposalStateColor = (status: EProposalState) => {
  switch (status) {
    case EProposalState.UNDETERMINED:
      return "#27AE60";
    case EProposalState.PENDING:
      return "#8F96AC";
    case EProposalState.ACTIVE:
      return "#27AE60";
    case EProposalState.CANCELED:
      return "#8F96AC";
    case EProposalState.DEFEATED:
      return "#FF4343";
    case EProposalState.SUCCEEDED:
      return "#27AE60";
    case EProposalState.QUEUED:
      return "#8F96AC";
    case EProposalState.EXPIRED:
      return "#FF4343";
    case EProposalState.EXECUTED:
      return "#27AE60";
    default:
      return "#27AE60";
  }
};
