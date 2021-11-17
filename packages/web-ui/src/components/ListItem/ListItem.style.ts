import { makeStyles } from "@material-ui/core";

import { useWidgetUniqueIdentifier } from "@web-ui/hooks";
import { colors } from "@web-ui/theme";

export const useStyles = () => {
  const widgetUniqueIdentifier = useWidgetUniqueIdentifier();

  const styles = makeStyles(() => ({
    wrapper: {
      display: "flex",
      flexDirection: "column",
    },
    listItem: () => ({
      display: "flex",
      flexDirection: "row",
      padding: "16px 0",
      [`& .${widgetUniqueIdentifier}MuiListItemIcon-root`]: {
        minWidth: "unset",
        marginRight: 20,
      },
    }),
    rightContent: {
      marginLeft: "auto",
    },
    divider: {
      color: colors.GRAY150,
    },
  }));

  return styles();
};
