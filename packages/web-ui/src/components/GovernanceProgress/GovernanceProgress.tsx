import React from "react";
import { LinearProgress, ThemeProvider } from "@material-ui/core";

import {
  progressTheme,
  useStyles,
} from "@web-ui/components/GovernanceProgress/GovernanceProgress.style";
import { colors } from "@web-integration/theme";

interface GovernanceProgressProps {
  value: number;
  color?: string;
  height?: number;
}

export const GovernanceProgress: React.FC<GovernanceProgressProps> = (
  props: GovernanceProgressProps,
) => {
  const { value, color = colors.GRAY500, height = 4 } = props;
  const classes = useStyles();

  return (
    <ThemeProvider theme={progressTheme}>
      <LinearProgress
        style={{ backgroundColor: color, height }}
        className={classes.wrapper}
        variant="determinate"
        value={value}
      />
    </ThemeProvider>
  );
};
