import React from "react";

import useStyles from "./BoxWrapper.style";

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
    <div className={classes.wrapper}>
      {label && <div className={classes.label}>{label}</div>}
      {children}
    </div>
  );
};

export default BoxWrapper;
