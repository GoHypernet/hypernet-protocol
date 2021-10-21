import React from "react";
import { LinearProgress } from "@material-ui/core";

import { colors } from "@web-integration/theme";

interface GovernanceProgressProps {
  value: number;
  color?: string;
  height?: number;
}

export const GovernanceProgress: React.FC<GovernanceProgressProps> = (
  props: GovernanceProgressProps,
) => {
  const { value, color = colors.GRAY500, height = 6 } = props;

  return (
    <LinearProgress
      style={{ backgroundColor: color, height }}
      variant="determinate"
      value={value}
    />
  );
};
