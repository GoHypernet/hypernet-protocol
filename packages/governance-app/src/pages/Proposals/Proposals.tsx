import React from "react";
import { useHistory } from "react-router-dom";

import PageWrapper from "@governance-app/components/PageWrapper";
import { Box, Button, Typography } from "@material-ui/core";

import { useStyles } from "./Proposals.style";
import ProposalSummaryCard from "./ProposalSummaryCard";
import { PATH } from "@governance-app/containers/Router";

const Proposals: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const proposalList = [1, 2, 3, 4, 5];

  const handleClickCreateProposal = () => {
    history.push(PATH.CreateProposal);
  };

  return (
    <PageWrapper>
      <Box className={classes.container}>
        <Box className={classes.titleContainer}>
          <Typography variant="h2">Proposals</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickCreateProposal}
          >
            Create Proposal
          </Button>
        </Box>

        {proposalList.map(() => {
          return (
            <Box mt={2}>
              <ProposalSummaryCard />
            </Box>
          );
        })}
      </Box>
    </PageWrapper>
  );
};

export default Proposals;
