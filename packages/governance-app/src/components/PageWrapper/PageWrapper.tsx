import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@governance-app/components/PageWrapper/PageWrapper.style";

interface IPageWrapper {
  children: React.ReactNode;
}

const PageWrapper: React.FC<IPageWrapper> = ({ children }: IPageWrapper) => {
  const classes = useStyles();

  return <Box className={classes.wrapper}>{children}</Box>;
};

export default PageWrapper;
