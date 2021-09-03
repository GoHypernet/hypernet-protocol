import React, { useMemo } from "react";

import { Box } from "@material-ui/core";
import { useStyles } from "./ProposalState.style";
import { EProposalState } from "./ProposalState.interface";
import {
  getProposalStateColor,
  getProposalStateString,
} from "./ProposalState.utils";

interface IProposalState {
  status: EProposalState;
}

const ProposalState: React.FC<IProposalState> = (props: IProposalState) => {
  const { status } = props;

  const statusString = useMemo(() => getProposalStateString(status), [status]);

  const statusColor = useMemo(() => getProposalStateColor(status), [status]);

  const classes = useStyles({ color: statusColor });

  return <Box className={classes.box}>{statusString}</Box>;
};

export default ProposalState;
