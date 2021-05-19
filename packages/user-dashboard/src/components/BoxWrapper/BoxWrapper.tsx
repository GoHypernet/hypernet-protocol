import React from "react";
import { Box, BoxProps } from "@material-ui/core";

import { useStyles } from "@user-dashboard/components/BoxWrapper/BoxWrapper.style";

interface IBoxWrapper extends BoxProps {
  children?: React.ReactNode;
  label?: string;
}

const BoxWrapper: React.FC<IBoxWrapper> = ({
  children,
  label,
  flex,
}: IBoxWrapper) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper} flex={flex}>
      {label && <Box className={classes.label}>{label}</Box>}
      {children}
    </Box>
  );
};

export default BoxWrapper;
