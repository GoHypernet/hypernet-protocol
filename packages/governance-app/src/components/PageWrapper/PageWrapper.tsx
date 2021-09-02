import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@governance-app/components/PageWrapper/PageWrapper.style";

interface IPageWrapper {
  children: React.ReactNode;
  label: string;
}

const PageWrapper: React.FC<IPageWrapper> = ({
  children,
  label,
}: IPageWrapper) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.label}>{label}</Box>
      {children}
    </Box>
  );
};

export default PageWrapper;
