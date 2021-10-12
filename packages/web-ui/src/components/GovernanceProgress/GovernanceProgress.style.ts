import { makeStyles } from "@material-ui/core";

import { colors } from "@web-ui/theme";
import { useWidgetUniqueIdentifier } from "@web-ui/hooks";

export const useStyles = (props: { color?: string; height?: number }) => {
  const widgetUniqueIdentifier = useWidgetUniqueIdentifier();

  const styles = makeStyles(() => ({
    wrapper: () => ({
      [`&.${widgetUniqueIdentifier}MuiLinearProgress-root`]: {
        borderRadius: 3,
        height: props.height || 6,
        backgroundColor: colors.GRAY200,
      },
      [`& .${widgetUniqueIdentifier}MuiLinearProgress-bar`]: {
        borderRadius: 3,
      },
      [`& .${widgetUniqueIdentifier}MuiLinearProgress-bar1Determinate`]: {
        backgroundColor: props.color,
      },
    }),
  }));

  return styles();
};
