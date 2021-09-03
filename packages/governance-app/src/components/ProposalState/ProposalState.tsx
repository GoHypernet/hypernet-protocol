import React from "react";

import { Box } from "@material-ui/core";
import { useStyles } from "./ProposalState.style";
import { EProposalState } from "./ProposalState.interface";

interface IProposalState {
  status: EProposalState;
}

const ProposalState: React.FC<IProposalState> = (props: IProposalState) => {
  const { status } = props;
  const classes = useStyles(status);

  return <Box className={classes.box}>Executed</Box>;
};

export default ProposalState;
