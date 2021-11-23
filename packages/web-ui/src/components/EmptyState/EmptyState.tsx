import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@web-ui/components/EmptyState/EmptyState.style";

interface IEmptyStateProps {
  label?: string;
  info?: React.ReactNode;
}

export const EmptyState: React.FC<IEmptyStateProps> = (
  props: IEmptyStateProps,
) => {
  const { label = "No results!", info } = props;
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <img
        width="150"
        src="https://res.cloudinary.com/dqueufbs7/image/upload/v1622582034/images/Screen_Shot_2021-06-02_at_00.12.25.png"
      />
      <Box className={classes.rightWrapper}>
        <Box className={classes.textWrapper}>
          <Box className={classes.label}>{label}</Box>
          {info && <Box className={classes.info}>{info}</Box>}
        </Box>
      </Box>
    </Box>
  );
};
