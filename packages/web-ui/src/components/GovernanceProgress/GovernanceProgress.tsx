import React from "react";
import { LinearProgress } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceProgress/GovernanceProgress.style";
import { defaultWidgetUniqueIdentifier } from "@web-ui/theme";

interface GovernanceProgressProps {
  value: number;
  color?: string;
  height?: number;
  widgetUniqueIdentifier?: string;
}

export const GovernanceProgress: React.FC<GovernanceProgressProps> = (
  props: GovernanceProgressProps,
) => {
  const {
    value,
    color,
    height,
    widgetUniqueIdentifier = defaultWidgetUniqueIdentifier,
  } = props;
  const classes = useStyles({ color, height, widgetUniqueIdentifier });

  console.log("color", color);
  return (
    <LinearProgress
      className={classes.wrapper}
      variant="determinate"
      value={value}
    />
  );
};
