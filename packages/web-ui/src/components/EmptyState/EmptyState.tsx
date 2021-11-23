import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@web-ui/components/EmptyState/EmptyState.style";
import { HYPERNET_LOGO_DARK } from "@web-ui/constants";

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
      <img width="150" src={HYPERNET_LOGO_DARK} />
      <Box className={classes.rightWrapper}>
        <Box className={classes.textWrapper}>
          <Box className={classes.label}>{label}</Box>
          {info && <Box className={classes.info}>{info}</Box>}
        </Box>
      </Box>
    </Box>
  );
};
