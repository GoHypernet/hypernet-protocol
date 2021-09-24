import React from "react";
import { Box, Typography, Card } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceListItem/GovernanceListItem.style";

interface GovernanceListItemProps {
  number: string;
  title: string | React.ReactNode;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
}

export const GovernanceListItem: React.FC<GovernanceListItemProps> = (
  props: GovernanceListItemProps,
) => {
  const { number, title, rightContent, children } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h5" color="textSecondary" className={classes.number}>
        {`${number}.`}
      </Typography>

      <Box className={classes.contentWrapper}>
        <Box className={classes.titleRow}>
          <Typography
            variant="h5"
            color="textPrimary"
            className={classes.title}
          >
            {title}
          </Typography>
          {rightContent && (
            <Box className={classes.rightContent}>{rightContent}</Box>
          )}
        </Box>
        {children}
      </Box>
    </Box>
  );
};
