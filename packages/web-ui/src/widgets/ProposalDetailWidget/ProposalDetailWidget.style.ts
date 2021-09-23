import { makeStyles } from "@material-ui/core";
import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles({
  proposerSectionWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  proposerLabel: {
    fontWeight: EFontWeight.MEDIUM,
  },
  proposerValue: {
    marginLeft: 16,
    color: colors.GREEN700,
  },
});
