import { makeStyles } from "@material-ui/core";

import { colors } from "@web-ui/theme";

export const useStyles = makeStyles(() => ({
  root: {
    padding: "12px 16px",
    backgroundColor: colors.GRAY150,
    boxShadow: "unset",
    display: "flex",
    width: "100%",
    marginBottom: 16,
  },
  number: {
    paddingTop: 15,
  },
  contentWrapper: {
    marginLeft: 40,
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  title: {
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
