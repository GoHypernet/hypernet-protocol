import React from "react";
import { useHistory } from "react-router-dom";

import { Box, Typography } from "@material-ui/core";
import { Card } from "@material-ui/core";
import ProposalState, {
  EProposalState,
} from "@governance-app/components/ProposalState";
import { useStyles } from "./ProposalSummaryCard.style";
import { getRoute, PATH } from "@governance-app/containers/Router";

const ProposalSummaryCard: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleProposalClick = () => {
    history.push(getRoute(PATH.ProposalDetail, { id: 5 }));
  };

  return (
    <Card className={classes.card} elevation={0} onClick={handleProposalClick}>
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
