import { makeStyles } from "@material-ui/core";
import { EFontSize, EFontWeight, colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  topWrapper: {
    marginBottom: 24,
  },
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.palette.text.primary,
  },
  description: { marginTop: 8, color: theme.palette.text.hint },
  tableColumnHeader: {
    fontWeight: EFontWeight.SEMI_BOLD,
    fontSize: EFontSize.BODY2,
    borderBottom: `1px solid ${colors.GRAY200}`,
  },
  tableCell: {
    fontWeight: EFontWeight.MEDIUM,
    fontSize: EFontSize.H6,
    borderBottom: `1px solid ${colors.GRAY150}`,
  },
  mobileRowCard: {
    marginBottom: 24,
  },
}));
