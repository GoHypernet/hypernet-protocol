import React from "react";
import { Box, Typography } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceCard/GovernanceCardHeader/GovernanceCardHeader.style";

interface GovernanceCardHeader {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
}

export const GovernanceCardHeader: React.FC<GovernanceCardHeader> = (
  props: GovernanceCardHeader,
) => {
  const { title, description } = props;
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Typography variant="h5" color="textPrimary" className={classes.title}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="textPrimary"
        className={classes.description}
      >
        {description}
      </Typography>
    </Box>
  );
};
