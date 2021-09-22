import React from "react";
import { Box, Typography } from "@material-ui/core";

import { useStyles } from "@web-integration/components/GovernanceValueWithTitle/GovernanceValueWithTitle.style";

export interface IGovernanceValueWithTitle {
  title: string;
  value: string | number;
  topRightContent?: React.ReactNode;
  bottomRightContent?: React.ReactNode;
}

export const GovernanceValueWithTitle: React.FC<IGovernanceValueWithTitle> = (
  props: IGovernanceValueWithTitle,
) => {
  const {
    title,
    value,
    topRightContent,
    bottomRightContent,
  } = props;
  const classes = useStyles({});

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.rowWrapper}>
        <Typography variant="h6" color="textPrimary" className={classes.title}>
          {title}
        </Typography>
        {topRightContent}
      </Box>

      <Box className={classes.rowWrapper}>
        <Typography
          variant="body2"
          color="textPrimary"
          className={classes.value}
        >
          {value}
        </Typography>

        {bottomRightContent && (
          <Box className={classes.rightContent}> {bottomRightContent}</Box>
        )}
      </Box>
    </Box>
  );
};
