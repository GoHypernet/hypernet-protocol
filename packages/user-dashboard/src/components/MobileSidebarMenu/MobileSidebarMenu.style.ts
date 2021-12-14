import { colors } from "@hypernetlabs/web-ui";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  iconButton: {
    color: colors.BLACK,
  },
  list: {
    padding: "0",
  },
  listItem: {
    padding: 16,
    borderRadius: 3,
  },
  activeListItem: {
    backgroundColor: colors.PURPLE100,
  },
  inactiveListItem: {},
  divider: { margin: "24px 0" },
  drawerContainer: {
    cursor: "pointer",
    width: 400,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowX: "hidden",
    padding: 16,
  },
  header: {
    cursor: "auto",
    marginLeft: "auto",
  },
  walletConnectedLabel: {
    margin: "8px 0",
  },
  paper: {
    top: 60,
  },
});
