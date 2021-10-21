import { createTheme, makeStyles } from "@material-ui/core";

import { colors, lightTheme } from "@web-ui/theme";
import { useWidgetUniqueIdentifier } from "@web-ui/hooks";

interface GovernanceProgressStyleProps {
  color?: string;
  height?: number;
}

export const progressTheme = createTheme({
  overrides: {
    MuiLinearProgress: {
      root: {
        height: "inherit",
      },
      barColorPrimary: {
        backgroundColor: "inherit",
      },
    },
  },
});

export const useStyles = () => {
  const widgetUniqueIdentifier = useWidgetUniqueIdentifier();

  const styles = makeStyles(() => ({
    wrapper: () => ({
      [`& .${widgetUniqueIdentifier}MuiLinearProgress-root`]: {
        borderRadius: 3,
        backgroundColor: colors.GRAY200,
      },
      [`& .${widgetUniqueIdentifier}MuiLinearProgress-bar`]: {
        borderRadius: 3,
      },
    }),
  }));

  return styles();
};
