import { makeStyles } from "@material-ui/core";

import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  topSection: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomSection: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  leftSection: {
    display: "flex",
    flex: 1,
    paddingRight: 20,
    flexDirection: "column",
  },
  rightSection: {
    display: "flex",
    marginLeft: "auto",
    flexDirection: "column",
  },
  label: {
    fontWeight: EFontWeight.BOLD,
  },
  description: {
    marginTop: 16,
  },
  navigationWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    cursor: "pointer",
  },
  navigationIcon: {
    color: colors.GRAY400,
    marginRight: 8,
  },
  navigationLabel: {
    fontWeight: EFontWeight.MEDIUM,
  },
  buttonWrapper: {
    marginLeft: 16,
  },
}));
