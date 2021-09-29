import { colors } from "@hypernetlabs/web-ui";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  headerWrapper: {
    background: colors.PURPLE100,
    padding: "8px 25px",
    display: "flex",
    alignItems: "center",
    color: colors.WHITE,
    justifyContent: "space-between",
  },
  logoWrapper: {},
  logo: {
    height: 40,
  },
  menuWrapper: {
    display: "flex",
    textTransform: "uppercase",
    margin: "0 auto",
    height: 40,
    marginBottom: -16,
  },
  menuItem: {
    margin: "0 18px",
    flex: 1,
    whiteSpace: "nowrap",
    cursor: "pointer",
    "& p": {
      color: colors.GRAY500,
      textDecoration: "none",
    },
  },
  activeMenuItem: {
    color: colors.PURPLE700,
    borderBottom: `3px solid ${colors.PURPLE700}`,
  },
  inactiveMenuItem: {
    opacity: 0.7,
  },
  headerWrapper4: {},
  headerWrapper5: {},
  rightContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  widgetWrapper: {
    marginRight: 15,
    backgroundColor: "transparent",
    color: colors.GRAY700,
  },
});
