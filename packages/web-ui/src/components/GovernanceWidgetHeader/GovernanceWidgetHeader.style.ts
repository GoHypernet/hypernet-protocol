import { makeStyles } from "@material-ui/core";
import { colors, EFontSize } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",

    color: colors.GRAY700,
  },
  rightSection: {
    display: "flex",
  },
  label: {
    fontWeight: "bold",
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
    fontWeight: "bold",
  },
  buttonWrapper: {
    marginLeft: 16,
  },
}));
