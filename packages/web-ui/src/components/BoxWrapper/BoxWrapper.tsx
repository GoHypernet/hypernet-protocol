import React from "react";
import { Box, BoxProps } from "@material-ui/core";

import { useStyles } from "@web-ui/components/BoxWrapper/BoxWrapper.style";

interface IBoxWrapper extends BoxProps {
  children?: React.ReactNode;
  label?: string;
  rightComponent?: React.ReactNode;
}

export const BoxWrapper: React.FC<IBoxWrapper> = ({
  children,
  label,
  flex,
  rightComponent,
}: IBoxWrapper) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper} flex={flex}>
      {label && (
        <Box className={classes.headerWrapper}>
          <Box className={classes.label}>{label}</Box>
          <Box display="flex" alignItems="center">
            {rightComponent}
          </Box>
        </Box>
      )}
      {children}
    </Box>
  );
};
