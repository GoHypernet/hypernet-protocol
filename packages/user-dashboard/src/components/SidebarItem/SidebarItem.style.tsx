import { colors } from "@hypernetlabs/web-ui";
import { ListItem } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

export const StyledListItem = withStyles(() => ({
  root: {
    maxWidth: "initial",
    alignItems: "center",
    color: colors.GRAY500,

    "&$selected": {
      borderRadius: 3,
      color: colors.PURPLE400,
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  selected: {},
}))(ListItem);

export const useStyles = makeStyles({
  listItemText: {
    alignSelf: "center",
  },
  toolTip: {
    alignSelf: "center",
  },
  subListItem: {
    padding: 8,
    alignItems: "center",
  },
  subListItemText: {},
  parentListItem: {
    cursor: "default",
  },
});
