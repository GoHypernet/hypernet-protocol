import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceCard/GovernanceCard.style";

interface GovernanceCard {
  children: React.ReactNode;
  className: string;
}

export const GovernanceCard: React.FC<GovernanceCard> = (
  props: GovernanceCard,
) => {
  const { children, className } = props;
  const classes = useStyles();

  return <Box className={`${classes.wrapper} ${className}`}>{children}</Box>;
};
