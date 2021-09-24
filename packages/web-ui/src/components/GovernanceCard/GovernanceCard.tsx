import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceCard/GovernanceCard.style";
import { GovernanceCardHeader } from "@web-ui/components/GovernanceCard/GovernanceCardHeader";

interface GovernanceCard {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className: string;
}

export const GovernanceCard: React.FC<GovernanceCard> = (
  props: GovernanceCard,
) => {
  const { title, description, children, className } = props;
  console.log("children", children);
  const classes = useStyles();

  return (
    <Box className={`${classes.wrapper} ${className}`}>
      {(!!title || !!description) && (
        <GovernanceCardHeader title={title} description={description} />
      )}
      {children}
    </Box>
  );
};
