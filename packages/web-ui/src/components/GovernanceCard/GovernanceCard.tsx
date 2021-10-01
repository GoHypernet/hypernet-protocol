import React, { useMemo } from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceCard/GovernanceCard.style";
import { GovernanceCardHeader } from "@web-ui/components/GovernanceCard/GovernanceCardHeader";

interface GovernanceCard {
  title?: string | React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className: string;
  hideDivider?: boolean;
}

export const GovernanceCard: React.FC<GovernanceCard> = (
  props: GovernanceCard,
) => {
  const { title, description, children, className, hideDivider } = props;
  const classes = useStyles();

  const hasCardHeader = useMemo(
    () => !!title || !!description,
    [title, description],
  );

  return (
    <Box className={`${classes.wrapper} ${className}`}>
      {hasCardHeader && (
        <GovernanceCardHeader
          title={title}
          description={description}
          hideDivider={hideDivider}
          hasBottomMargin={!!children}
        />
      )}
      {!!children && (
        <Box
          className={
            hasCardHeader ? classes.bodyWithHeader : classes.bodyWithoutHeader
          }
        >
          {children}
        </Box>
      )}
    </Box>
  );
};
