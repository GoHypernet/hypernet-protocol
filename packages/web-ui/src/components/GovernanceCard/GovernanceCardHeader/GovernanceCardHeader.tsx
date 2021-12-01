import React from "react";
import { Box, Divider, Typography } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceCard/GovernanceCardHeader/GovernanceCardHeader.style";

interface GovernanceCardHeader {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  hideDivider?: boolean;
  hasBottomMargin?: boolean;
}

export const GovernanceCardHeader: React.FC<GovernanceCardHeader> = (
  props: GovernanceCardHeader,
) => {
  const { title, description, hideDivider, hasBottomMargin } = props;
  const classes = useStyles();

  return (
    <Box
      {...(hasBottomMargin && {
        className: classes.wrapper,
      })}
    >
      <Box className={classes.header}>
        <Typography variant="h6" color="textPrimary" className={classes.title}>
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body1"
            color="textPrimary"
            className={classes.description}
          >
            {description}
          </Typography>
        )}
      </Box>
      {!hideDivider && <Divider />}
    </Box>
  );
};
