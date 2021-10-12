import React from "react";
import { LinearProgress } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceProgress/GovernanceProgress.style";

interface GovernanceProgressProps {
  value: number;
  color?: string;
  height?: number;
}

export const GovernanceProgress: React.FC<GovernanceProgressProps> = (
  props: GovernanceProgressProps,
) => {
  const { value, color, height } = props;
  const classes = useStyles({ color, height });

  return (
    <LinearProgress
      className={classes.wrapper}
      variant="determinate"
      value={value}
    />
  );
};
