import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles(() => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  listItem: (props: { widgetUniqueIdentifier: string }) => ({
    display: "flex",
    flexDirection: "row",
    padding: "16px 0",
    [`& .${props.widgetUniqueIdentifier}-MuiListItemIcon-root`]: {
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
