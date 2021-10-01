import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

import { useStyles } from "@web-ui/components/GovernanceProposalListItem/GovernanceProposalListItem.style";
import { GovernanceStatusTag } from "@web-ui/components/GovernanceStatusTag";
import { EProposalState } from "@hypernetlabs/objects";

interface GovernanceProposalListItemProps {
  number: string;
  title: string;
  status: EProposalState;
  onClick?: () => void;
}

export const GovernanceProposalListItem: React.FC<GovernanceProposalListItemProps> =
  (props: GovernanceProposalListItemProps) => {
    const { number, title, status, onClick } = props;
    const classes = useStyles();

    return (
      <Button fullWidth className={classes.button} onClick={onClick}>
        <Typography variant="h5" className={classes.number}>
          {number}
        </Typography>
        {status === EProposalState.ACTIVE && (
          <Skeleton
            variant="circle"
            animation="pulse"
            className={classes.activePulse}
          />
        )}
        <Typography variant="h5" color="textPrimary" className={classes.title}>
          {title}
        </Typography>
        <Box className={classes.status}>
          <GovernanceStatusTag status={status} />
        </Box>
      </Button>
    );
  };
