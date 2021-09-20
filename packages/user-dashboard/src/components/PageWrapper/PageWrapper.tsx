import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@user-dashboard/components/PageWrapper/PageWrapper.style";

interface IPageWrapper {
  children: React.ReactNode;
  label?: string;
  isGovernance?: boolean;
}

const PageWrapper: React.FC<IPageWrapper> = ({
  children,
  label,
  isGovernance,
}: IPageWrapper) => {
  const classes = useStyles();

  if (isGovernance) {
    return <Box className={classes.governanceWrapper}>{children}</Box>;
  }

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.label}>{label}</Box>
      {children}
    </Box>
  );
};

export default PageWrapper;
