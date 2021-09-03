import React from "react";

import { Box, Typography } from "@material-ui/core";
import { Card } from "@material-ui/core";
import ProposalState, {
  EProposalState,
} from "@governance-app/components/ProposalState";
import { useStyles } from "./ProposalSummaryCard.style";

const ProposalSummaryCard: React.FC = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={0}>
      <Typography className={classes.proposalId}>1.3</Typography>
      <Typography>
        Upgrade Governance Contract to Compound's Governor Bravo
      </Typography>
      <Box ml="auto">
        <ProposalState status={EProposalState.ACTIVE} />
      </Box>
    </Card>
  );
};

export default ProposalSummaryCard;
