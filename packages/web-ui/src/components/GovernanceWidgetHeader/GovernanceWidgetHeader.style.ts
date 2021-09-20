import { makeStyles } from "@material-ui/core";
import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    color: colors.GRAY700,
  },
  rightSection: {
    display: "flex",
    marginLeft: "auto",
  },
  label: {
    fontWeight: EFontWeight.BOLD,
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
