import React from "react";

import useStyles from "./PageWrapper.style";

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
    <div className={classes.wrapper}>
      <div className={classes.label}>{label}</div>
      {children}
    </div>
  );
};

export default PageWrapper;
