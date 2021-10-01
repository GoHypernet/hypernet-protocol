import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles(() => ({
  list: {
    display: "flex",
    flexDirection: "row",
    borderBottom: `1px solid ${colors.GRAY150}`,
  },
  listItem: {
    "& .MuiListItemIcon-root": {
      minWidth: "unset",
      marginRight: 20,
    },
  },
  rightContent: {
    marginLeft: "auto",
  },
}));
