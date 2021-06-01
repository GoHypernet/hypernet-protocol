import { colors } from "@hypernetlabs/web-ui";

import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  headerWrapper: {
    background: colors.BLACK,
    padding: "8px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: colors.WHITE,
  },
  logoWrapper: {},
  logo: {
    height: 40,
  },
  menuWrapper: {
    display: "flex",
    textTransform: "uppercase",
  },
  menuItem: {
    margin: "0 18px",
    cursor: "pointer",
    "& a": {
      color: colors.WHITE,
      textDecoration: "none",
    },
  },
  activeMenuItem: {
    borderBottom: "1px solid white",
  },
  inactiveMenuItem: {
    opacity: 0.7,
  },
  headerWrapper4: {},
  headerWrapper5: {},
});
