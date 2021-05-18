import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@user-dashboard/components/BoxWrapper/BoxWrapper.style";

interface IBoxWrapper {
  children: React.ReactNode;
  label?: string;
}

const BoxWrapper: React.FC<IBoxWrapper> = ({
  children,
  label,
}: IBoxWrapper) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      {label && <Box className={classes.label}>{label}</Box>}
      {children}
    </Box>
  );
};

export default BoxWrapper;
