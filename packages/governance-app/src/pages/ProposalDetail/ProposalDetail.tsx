import React from "react";

import PageWrapper from "@governance-app/components/PageWrapper";
import { Box, Button, Card, IconButton, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { useStyles } from "./ProposalDetail.style";
import { useHistory, useLocation } from "react-router-dom";
import ProposalState, {
  EProposalState,
} from "@governance-app/components/ProposalState";
import { PATH } from "@governance-app/containers/Router";
import { Proposal } from "../Proposals/Proposals";

interface LocationState {
  proposal: Proposal;
}

const ProposalDetail: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const {
    state: { proposal },
  } = useLocation<LocationState>();

  const handleBackIconClick = () => {
    history.push(PATH.Proposals);
  };

  return (
    <PageWrapper>
      <Box className={classes.container}>
        <Box className={classes.titleContainer}>
          <Box display="flex" alignItems="center">
            <IconButton aria-label="back" onClick={handleBackIconClick}>
              <ArrowBackIcon />
            </IconButton>
            <Typography>All Proposals</Typography>
          </Box>
          <ProposalState
            status={EProposalState[EProposalState[proposal.state]]}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Card style={{ width: "40%", padding: 8 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography>For</Typography>
              <Typography>{proposal.proposalVotesFor}</Typography>
            </Box>

            <Box
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "green",
                borderRadius: 4,
              }}
              mt={2}
            />
          </Card>
          <Card style={{ width: "40%", padding: 8 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography>Against</Typography>
              <Typography>{proposal.proposalVotesAgaints}</Typography>
            </Box>
            <Box
              style={{
                flex: 1,
                height: 4,
                backgroundColor: "red",
                borderRadius: 4,
              }}
              mt={2}
            />
          </Card>
        </Box>
        <Typography variant="h2">
          {proposal.description.split("\n")[0]}
        </Typography>
        <br /> <br />
        <Typography
          style={{ whiteSpace: "pre-line" }}
          variant="h2"
        >{`${proposal.description}`}</Typography>
        <br />
        <Typography variant="h4">Proposer</Typography>
        <Typography color="secondary">{proposal.proposalOriginator}</Typography>
      </Box>
    </PageWrapper>
  );
};

export default ProposalDetail;
