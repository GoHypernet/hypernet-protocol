import { makeStyles } from "@material-ui/core";
import { EProposalState } from "./ProposalState.interface";

const getProposalStateColor = (status: EProposalState) => {
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

export const useStyles = makeStyles((status: EProposalState) => {
  const color = getProposalStateColor(status);
  return {
    box: {
      padding: 8,
      borderRadius: 8,
      color,
      border: `1px solid ${color}`,
    },
  };
});
