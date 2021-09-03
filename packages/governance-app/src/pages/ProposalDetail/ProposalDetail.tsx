import React from "react";

import PageWrapper from "@governance-app/components/PageWrapper";
import { Box, Button, IconButton, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { useStyles } from "./ProposalDetail.style";
import { useHistory } from "react-router-dom";
import ProposalState, {
  EProposalState,
} from "@governance-app/components/ProposalState";
import { PATH } from "@governance-app/containers/Router";

const ProposalDetail: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

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
          <ProposalState status={EProposalState.DEFEATED} />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default ProposalDetail;
