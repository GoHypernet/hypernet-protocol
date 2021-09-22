import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles(() => ({
  root: {
    padding: "12px 16px",
    backgroundColor: colors.GRAY150,
    boxShadow: "unset",
    display: "flex",
    width: "100%",
  },
  number: {
    color: colors.GRAY500,
    paddingTop: 15,
  },
  contentWrapper: {
    marginLeft: 40,
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  title: {
    color: colors.GRAY700,
    paddingTop: 15,
    marginBottom: 27,
  },
  rightContent: {
    marginLeft: "auto",
  },
  titleRow: {
    display: "flex",
    width: "100%",
  },
}));
