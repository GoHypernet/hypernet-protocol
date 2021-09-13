import React from "react";
import { useHistory } from "react-router-dom";

import { Box, Typography } from "@material-ui/core";
import { Card } from "@material-ui/core";
import ProposalState, {
  EProposalState,
} from "@governance-app/components/ProposalState";
import { useStyles } from "./ProposalSummaryCard.style";
import { getRoute, PATH } from "@governance-app/containers/Router";
import { Proposal } from "../Proposals";

interface ProposalSummaryCardProps {
  proposal: Proposal;
}
const ProposalSummaryCard: React.FC<ProposalSummaryCardProps> = (props) => {
  const { proposal } = props;
  const classes = useStyles();
  const history = useHistory();

  const handleProposalClick = () => {
    history.push(
      getRoute(PATH.ProposalDetail, { id: proposal.proposalNumber }),
      { proposal },
    );
  };

  return (
    <Card className={classes.card} elevation={0} onClick={handleProposalClick}>
      <Typography className={classes.proposalId}>
        {proposal.proposalNumber}
      </Typography>
      <Typography>{proposal.description.split("\n")[0]}</Typography>
      <Box ml="auto">
        <ProposalState
          status={EProposalState[EProposalState[proposal.state]]}
        />
      </Box>
    </Card>
  );
};

export default ProposalSummaryCard;
