import React from "react";
import { Box, Typography } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceBasicValueWithTitle/GovernanceBasicValueWithTitle.style";

interface GovernanceBasicValueWithTitle {
  title: string | React.ReactNode;
  value: string | React.ReactNode;
}

export const GovernanceBasicValueWithTitle: React.FC<GovernanceBasicValueWithTitle> =
  (props: GovernanceBasicValueWithTitle) => {
    const { title, value } = props;
    const classes = useStyles();

    return (
      <Box className={classes.wrapper}>
        <Typography variant="body2">{title}</Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    );
  };
